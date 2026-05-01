// background/service-worker.js

let offscreenCreated = false;

// Manage Offscreen Document Lifecycle
async function setupOffscreenDocument(path) {
  // Check if it already exists
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(path)]
  });

  if (existingContexts.length > 0) {
    return;
  }

  // Create the offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ['USER_MEDIA'],
      justification: 'To run MediaPipe for PostureGuard slouch detection'
    });
    await creating;
    creating = null;
    offscreenCreated = true;
  }
}

async function closeOffscreenDocument() {
  if (!offscreenCreated) return;
  await chrome.offscreen.closeDocument();
  offscreenCreated = false;
}

let creating;

// Listen for messages from popup or offscreen document
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "TOGGLE_ON":
      setupOffscreenDocument('background/offscreen.html').then(() => {
        chrome.runtime.sendMessage({ target: 'offscreen', type: 'START_CAMERA' });
      });
      break;

    case "TOGGLE_OFF":
      chrome.runtime.sendMessage({ target: 'offscreen', type: 'STOP_CAMERA' }, () => {
        closeOffscreenDocument();
      });
      // Remove blur from active tabs
      chrome.tabs.query({active: true}, (tabs) => {
        tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { type: "EXTENSION_OFF" }).catch(() => {}));
      });
      break;

    case "CALIBRATION_START":
      chrome.runtime.sendMessage({ target: 'offscreen', type: 'START_CALIBRATION' });
      break;

    case "APPLY_BLUR":
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { type: "APPLY_BLUR" }).catch(() => {}));
      });
      break;

    case "REMOVE_BLUR":
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { type: "REMOVE_BLUR" }).catch(() => {}));
      });
      break;

    case "DEBUG_STATS":
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message).catch(() => {}));
      });
      break;
  }
  return true;
});
