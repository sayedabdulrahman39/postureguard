document.addEventListener('DOMContentLoaded', () => {
  // Title bar controls
  document.getElementById('minimize-btn').addEventListener('click', () => {
    window.electronAPI.minimizeApp();
  });
  
  document.getElementById('close-btn').addEventListener('click', () => {
    window.electronAPI.closeApp();
  });

  const toggleBtn = document.getElementById('toggle-btn');
  const statusBadge = document.getElementById('status-badge');
  const aiStatus = document.getElementById('ai-status');

  // Auth Elements
  const authOverlay = document.getElementById('auth-overlay');
  const userDisplay = document.getElementById('user-display');
  const logoutBtn = document.getElementById('logout-btn');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const loginBtn = document.getElementById('login-btn');
  const openSignupBtn = document.getElementById('open-signup');
  const viewAnalyticsBtn = document.getElementById('view-analytics-btn');

  // Timer Elements
  const workTimeInput = document.getElementById('work-time');
  const restTimeInput = document.getElementById('rest-time');
  const timerDisplay = document.getElementById('timer-display');
  const timeLeftEl = document.getElementById('time-left');

  let isRunning = false;
  let currentUser = null;
  let timerInterval = null;
  let timerMode = 'OFF'; // 'WORK', 'REST', 'OFF'
  let secondsRemaining = 0;

  function startTimer(minutes, mode) {
    timerMode = mode;
    secondsRemaining = minutes * 60;
    timerDisplay.style.display = 'block';
    updateTimerDisplay();

    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
      secondsRemaining--;
      updateTimerDisplay();

      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        handleTimerEnd();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    
    if (timerMode === 'WORK') {
      timeLeftEl.textContent = timeStr;
      timeLeftEl.style.color = '#dc2626';
      timerDisplay.firstChild.textContent = 'Next Break in: ';
    } else if (timerMode === 'REST') {
      timeLeftEl.textContent = timeStr;
      timeLeftEl.style.color = '#10b981';
      timerDisplay.firstChild.textContent = 'Back to work in: ';
    }
  }

  async function handleTimerEnd() {
    if (timerMode === 'WORK') {
      // Switch to REST
      window.electronAPI.toggleOff(); // Stops camera
      window.electronAPI.applyBlur("Time to take rest!");
      window.electronAPI.playRestSound();
      
      const restMins = parseInt(restTimeInput.value) || 5;
      startTimer(restMins, 'REST');
    } else if (timerMode === 'REST') {
      // Application OFF
      window.electronAPI.closeApp();
    }
  }

  async function checkUser() {
    currentUser = await window.electronAPI.getUser();
    if (currentUser) {
      authOverlay.style.display = 'none';
      userDisplay.textContent = currentUser.email.split('@')[0];
      logoutBtn.style.display = 'block';
    } else {
      authOverlay.style.display = 'flex';
      userDisplay.textContent = 'Guest';
      logoutBtn.style.display = 'none';
    }
  }

  checkUser();

  loginBtn.addEventListener('click', async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    if (!email || !password) return alert('Please enter email and password');
    
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    const { data, error } = await window.electronAPI.signIn({ email, password });
    
    if (error) {
      alert(`Login Failed: ${error.message}`);
    } else {
      checkUser();
    }
    
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  });

  logoutBtn.addEventListener('click', async () => {
    await window.electronAPI.signOut();
    checkUser();
  });

  viewAnalyticsBtn.addEventListener('click', () => {
    window.electronAPI.openExternal('http://localhost:5173/dashboard');
  });

  function updateUI() {
    if (isRunning) {
      toggleBtn.textContent = 'Stop Guarding';
      statusBadge.textContent = 'ON';
      statusBadge.classList.remove('off');
      statusBadge.classList.add('on');
      
      // Start Work Timer
      const workMins = parseInt(workTimeInput.value) || 25;
      startTimer(workMins, 'WORK');
    } else {
      toggleBtn.textContent = 'Start Guarding';
      statusBadge.textContent = 'OFF';
      statusBadge.classList.remove('on');
      statusBadge.classList.add('off');
      aiStatus.textContent = 'Inactive';
      document.getElementById('popup-debug').style.display = 'none';
      
      // Stop Timers
      if (timerInterval) clearInterval(timerInterval);
      timerDisplay.style.display = 'none';
      timerMode = 'OFF';
    }
  }

  toggleBtn.addEventListener('click', async () => {
    isRunning = !isRunning;
    updateUI();
    
    if (isRunning) {
      window.electronAPI.toggleOn();
    } else {
      window.electronAPI.toggleOff();
    }
  });

  window.electronAPI.onAiStatus((status) => {
    aiStatus.textContent = status;
  });

  window.electronAPI.onDebugStats((request) => {
    if (!isRunning) return;
    
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
  });
});
