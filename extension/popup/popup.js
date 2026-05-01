document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-btn');
  const statusBadge = document.getElementById('status-badge');
  const aiStatus = document.getElementById('ai-status');

  let isRunning = false;

  // Retrieve state from storage
  chrome.storage.local.get(['isRunning'], (result) => {
    isRunning = result.isRunning || false;
    updateUI();
  });

  function updateUI() {
    if (isRunning) {
      toggleBtn.textContent = 'Stop Guarding';
      statusBadge.textContent = 'ON';
      statusBadge.classList.remove('off');
      statusBadge.classList.add('on');
      aiStatus.textContent = 'Awaiting Baseline';
    } else {
      toggleBtn.textContent = 'Start Guarding';
      statusBadge.textContent = 'OFF';
      statusBadge.classList.remove('on');
      statusBadge.classList.add('off');
      aiStatus.textContent = 'Inactive';
    }
  }

  toggleBtn.addEventListener('click', async () => {
    if (!isRunning) {
      // Request camera permission in the popup first (required by Chrome)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop immediately, just needed for permission
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.message.includes('dismissed')) {
          chrome.tabs.create({ url: chrome.runtime.getURL("popup/setup.html") });
        } else {
          alert("Camera Error: " + err.name + " - " + err.message + "\n\nPlease check if your camera is connected.");
        }
        return;
      }
    }

    isRunning = !isRunning;
    chrome.storage.local.set({ isRunning });
    updateUI();
    
    // Notify Background Worker
    const message = isRunning ? "TOGGLE_ON" : "TOGGLE_OFF";
    chrome.runtime.sendMessage({ type: message });
  });

  // Listen for updates from offscreen document/background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'AI_STATUS') {
      aiStatus.textContent = request.status;
    } else if (request.type === 'DEBUG_STATS' && isRunning) {
      document.getElementById('popup-debug').style.display = 'block';
      if (request.frame) {
        document.getElementById('popup-video').src = request.frame;
      }
      if (request.analysis) {
        const state = request.analysis.state;
        const dist = (request.analysis.currentDistance || 0).toFixed(3);
        const base = (request.analysis.baseline || 0).toFixed(3);
        const ratio = request.analysis.ratio ? (request.analysis.ratio * 100).toFixed(0) : '---';
        
        let html = `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Status:</span> <strong style="color:${state==='GOOD'?'#10b981':(state==='BLUR'?'#ef4444':'#f59e0b')}">${state}</strong></div>`;
        html += `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Baseline:</span> <span>${base}</span></div>`;
        html += `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Current:</span> <span>${dist}</span></div>`;
        html += `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Ratio:</span> <span>${ratio}%</span></div>`;
        
        if (request.analysis.slouchDurationMs) {
          html += `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Time Slouching:</span> <span style="color:#ef4444">${(request.analysis.slouchDurationMs / 1000).toFixed(1)}s / 2.0s</span></div>`;
        }
        
        document.getElementById('popup-stats').innerHTML = html;
      }
    }
  });
});
