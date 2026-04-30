// background/service-worker.js

let stream = null;
let cameraBusyState = false;

// Attempt to get the camera stream
async function requestCamera() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    
    if (videoDevices.length === 0) {
      console.warn("No camera found.");
      return;
    }

    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraBusyState = false;
    console.log("Camera access granted.");
  } catch (error) {
    if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      console.error("Camera is busy or in use by another app.");
      cameraBusyState = true;
      notifyCameraBusy();
      scheduleRetry();
    } else {
      console.error("Camera error:", error);
    }
  }
}

// Destroy stream on toggle OFF
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    console.log("Camera stream stopped.");
  }
}

function notifyCameraBusy() {
  chrome.runtime.sendMessage({ type: "CAMERA_BUSY" }).catch(() => {});
}

// Polling retry for camera when busy
function scheduleRetry() {
  setTimeout(() => {
    if (cameraBusyState) requestCamera();
  }, 30000);
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "TOGGLE_ON":
      requestCamera();
      sendResponse({ status: "started" });
      break;
    case "TOGGLE_OFF":
      stopCamera();
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if(tabs.length) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "EXTENSION_OFF" }).catch(() => {});
        }
      });
      sendResponse({ status: "stopped" });
      break;
    case "APPLY_BLUR":
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if(tabs.length) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "APPLY_BLUR" }).catch(() => {});
        }
      });
      break;
    case "REMOVE_BLUR":
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if(tabs.length) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "REMOVE_BLUR" }).catch(() => {});
        }
      });
      break;
  }
  return true;
});

// Handle tab focus changes to manage camera intelligently
chrome.tabs.onActivated.addListener(() => {
  if (stream) {
    // Optional: Pause logic for tab changes
    // stopCamera();
    // setTimeout(requestCamera, 500);
  }
});
