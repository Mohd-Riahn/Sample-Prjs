function showToast(id) {
    const toast = document.getElementById(id);
    toast.style.display = 'flex';
    const timer = toast.querySelector('.toast-timer');
    const timingDisplay = document.getElementById(`${id}-timing`);

    let remainingTime = 3; // Seconds
    timingDisplay.textContent = `${remainingTime}s`;

    const interval = setInterval(() => {
      remainingTime -= 1;
      timingDisplay.textContent = `${remainingTime}s`;
      if (remainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    timer.style.animation = 'none';
    setTimeout(() => (timer.style.animation = ''), 0);

    setTimeout(() => {
      hideToast(id);
      clearInterval(interval);
    }, 3000);
  }

  function hideToast(id) {
    const toast = document.getElementById(id);
    toast.style.display = 'none';
  }

  document.getElementById('btn-success').addEventListener('click', () => showToast('toast-success'));
  document.getElementById('btn-error').addEventListener('click', () => showToast('toast-error'));
  document.getElementById('btn-warning').addEventListener('click', () => showToast('toast-warning'));
  document.getElementById('btn-info').addEventListener('click', () => showToast('toast-info'));