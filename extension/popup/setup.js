document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('grant-btn').addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      document.getElementById('grant-btn').style.display = 'none';
      document.getElementById('success-msg').style.display = 'block';
    } catch (err) {
      alert("Failed to get permission: " + err.message);
    }
  });
});
