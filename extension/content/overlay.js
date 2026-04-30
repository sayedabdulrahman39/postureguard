// content/overlay.js

// Initialize overlay elements
const overlay = document.createElement('div');
overlay.id = 'postureguard-overlay';

const message = document.createElement('div');
message.className = 'pg-message';
message.innerText = 'Straighten up! PostureGuard active.';

overlay.appendChild(message);
document.body.appendChild(overlay);

// Listen for background service worker messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'APPLY_BLUR') {
    overlay.classList.add('active');
  } else if (request.type === 'REMOVE_BLUR') {
    overlay.classList.remove('active');
  } else if (request.type === 'EXTENSION_OFF') {
    overlay.classList.remove('active');
  }
});
