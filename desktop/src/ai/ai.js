import { analyzePosture, calibrate, resetCalibration } from '../cv/slouch-detector.js';

const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
const beepSound = document.getElementById('beep-sound');

let isRunning = false;
let currentBlurState = false;
let lastDebugFrameTime = 0;
let frameTimeout;

// Initialize MediaPipe Pose
const pose = new window.Pose({
  locateFile: (file) => {
    return `../../node_modules/@mediapipe/pose/${file}`;
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

function onResults(results) {
  if (!results.poseLandmarks) return;

  const analysis = analyzePosture(results.poseLandmarks);
  
  if (analysis.state === "CALIBRATING_DONE") {
    window.electronAPI.sendAiStatus("Active");
  } else if (analysis.state === "BLUR" && !currentBlurState) {
    currentBlurState = true;
    window.electronAPI.applyBlur();
    // Start beep sound loop
    if (beepSound) {
      beepSound.currentTime = 0;
      beepSound.play().catch(err => console.log('Beep play error:', err));
    }
  } else if (analysis.state === "GOOD" && currentBlurState) {
    currentBlurState = false;
    window.electronAPI.removeBlur();
    // Stop beep sound
    if (beepSound) {
      beepSound.pause();
      beepSound.currentTime = 0;
    }
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

    window.electronAPI.sendDebugStats({
      frame: dataUrl,
      analysis: analysis
    });
  }
}

// Start Camera
async function startWebcam() {
  if (isRunning) return;
  isRunning = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    await videoElement.play();
    
    let isProcessing = false;
    
    const processingCanvas = document.createElement('canvas');
    processingCanvas.width = 640;
    processingCanvas.height = 480;
    const processingCtx = processingCanvas.getContext('2d', { willReadFrequently: true });
    
    async function processFrame() {
      if (!isRunning) return; // Stop loop if camera stopped
      
      if (!isProcessing && videoElement.videoWidth > 0) {
        isProcessing = true;
        try {
          processingCtx.drawImage(videoElement, 0, 0, processingCanvas.width, processingCanvas.height);
          await pose.send({ image: processingCanvas });
        } catch (poseError) {
          window.electronAPI.sendAiStatus("Pose Error: " + poseError.message);
        }
        isProcessing = false;
      }
      
      frameTimeout = setTimeout(processFrame, 100); // ~10 FPS
    }
    
    processFrame(); // Start the loop
    resetCalibration();
    window.electronAPI.sendAiStatus("Awaiting Baseline");
  } catch (error) {
    console.error("Webcam Error:", error);
    window.electronAPI.sendAiStatus("Camera Error");
  }
}

// Stop Camera
function stopWebcam() {
  isRunning = false;
  clearTimeout(frameTimeout);
  const stream = videoElement.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  videoElement.srcObject = null;
  // Stop beep sound when camera stops
  if (beepSound) {
    beepSound.pause();
    beepSound.currentTime = 0;
  }
  window.electronAPI.sendAiStatus("Inactive");
}

// Listen for messages from the main process
window.electronAPI.onStartCamera(() => {
  startWebcam();
});

window.electronAPI.onStopCamera(() => {
  stopWebcam();
});

window.electronAPI.onPlayRestSound(() => {
  const restSound = document.getElementById('rest-sound');
  if (restSound) {
    restSound.currentTime = 0;
    restSound.play().catch(err => console.log('Rest sound error:', err));
  }
});
