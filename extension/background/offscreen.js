// background/offscreen.js
import { analyzePosture, calibrate, resetCalibration } from '../cv/slouch-detector.js';

const videoElement = document.getElementById('webcam');
let camera = null;
let isCalibrating = false;
let currentBlurState = false;

// Initialize MediaPipe Pose
const pose = new Pose({
  locateFile: (file) => {
    return chrome.runtime.getURL(`node_modules/@mediapipe/pose/${file}`);
  }
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

pose.onResults(onResults);

const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
let lastDebugFrameTime = 0;

function onResults(results) {
  if (!results.poseLandmarks) return;

  const analysis = analyzePosture(results.poseLandmarks);
  
  if (analysis.state === "CALIBRATING_DONE") {
    chrome.runtime.sendMessage({ type: "AI_STATUS", status: "Active" });
  } else if (analysis.state === "BLUR" && !currentBlurState) {
    currentBlurState = true;
    chrome.runtime.sendMessage({ type: "APPLY_BLUR" });
  } else if (analysis.state === "GOOD" && currentBlurState) {
    currentBlurState = false;
    chrome.runtime.sendMessage({ type: "REMOVE_BLUR" });
  }

  // Debug broadcasting (throttled to ~10 FPS)
  const now = Date.now();
  if (now - lastDebugFrameTime > 100) {
    lastDebugFrameTime = now;
    
    // Draw the current camera frame to the hidden canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // Draw horizontally flipped (mirror)
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.restore();

    const dataUrl = canvasElement.toDataURL('image/jpeg', 0.5);

    chrome.runtime.sendMessage({
      type: "DEBUG_STATS",
      frame: dataUrl,
      analysis: analysis
    });
  }
}

// Start Camera
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    await videoElement.play();
    
    let isProcessing = false;
    
    // Dedicated canvas for extracting video frames safely
    const processingCanvas = document.createElement('canvas');
    processingCanvas.width = 640;
    processingCanvas.height = 480;
    const processingCtx = processingCanvas.getContext('2d', { willReadFrequently: true });
    
    async function processFrame() {
      if (!videoElement.srcObject) return; // Stop loop if camera stopped
      
      if (!isProcessing && videoElement.videoWidth > 0) {
        isProcessing = true;
        try {
          // Draw video to canvas first to prevent MediaPipe Wasm crashes
          processingCtx.drawImage(videoElement, 0, 0, processingCanvas.width, processingCanvas.height);
          await pose.send({ image: processingCanvas });
        } catch (poseError) {
          chrome.runtime.sendMessage({ type: "AI_STATUS", status: "Pose Error: " + poseError.message });
        }
        isProcessing = false;
      }
      
      // Use setTimeout instead of requestAnimationFrame to bypass offscreen throttling
      setTimeout(processFrame, 100); // ~10 FPS
    }
    
    processFrame(); // Start the loop
    
    chrome.runtime.sendMessage({ type: "AI_STATUS", status: "Awaiting Baseline" });
  } catch (error) {
    console.error("Webcam Error:", error);
    chrome.runtime.sendMessage({ type: "AI_STATUS", status: "Camera Error" });
  }
}

// Stop Camera
function stopWebcam() {
  const stream = videoElement.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  videoElement.srcObject = null;
}

// Listen for messages from the service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen') return;

  switch (message.type) {
    case 'START_CAMERA':
      startWebcam();
      sendResponse({ status: "started" });
      break;
    case 'STOP_CAMERA':
      stopWebcam();
      sendResponse({ status: "stopped" });
      break;
    case 'START_CALIBRATION':
      resetCalibration();
      isCalibrating = true;
      sendResponse({ status: "calibrating" });
      break;
  }
});

// Auto-start the camera as soon as the offscreen document loads
startWebcam();
