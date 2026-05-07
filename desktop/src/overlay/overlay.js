const overlay = document.getElementById('blur-overlay');
const messageEl = document.getElementById('overlay-message');

window.electronAPI.onApplyBlur((message) => {
  if (message) {
    messageEl.textContent = message;
  } else {
    messageEl.textContent = "Straighten up! PostureGuard active.";
  }
  overlay.classList.add('active');
});

window.electronAPI.onRemoveBlur(() => {
  overlay.classList.remove('active');
});
