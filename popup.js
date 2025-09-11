// Popup script for Be Fit extension
// Handles user interface interactions

document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const intervalSelect = document.getElementById('interval-select');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  const lastReminderElement = document.getElementById('last-reminder').querySelector('span');
  const testNotificationBtn = document.getElementById('test-notification');

  // Load current status
  loadStatus();

  // Event listeners
  startBtn.addEventListener('click', startTimer);
  stopBtn.addEventListener('click', stopTimer);
  testNotificationBtn.addEventListener('click', testNotification);

  function loadStatus() {
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
      if (response) {
        updateUI(response.isActive, response.intervalMinutes, response.lastReminder);
        if (response.intervalMinutes) {
          intervalSelect.value = response.intervalMinutes;
        }
      }
    });
  }

  function startTimer() {
    const intervalMinutes = parseInt(intervalSelect.value);
    
    chrome.runtime.sendMessage({
      action: 'startTimer',
      intervalMinutes: intervalMinutes
    }, (response) => {
      if (response && response.success) {
        updateUI(true, intervalMinutes);
        showMessage('Timer started! 🚀', 'success');
      } else {
        showMessage('Failed to start timer', 'error');
      }
    });
  }

  function stopTimer() {
    chrome.runtime.sendMessage({ action: 'stopTimer' }, (response) => {
      if (response && response.success) {
        updateUI(false);
        showMessage('Timer stopped', 'info');
      } else {
        showMessage('Failed to stop timer', 'error');
      }
    });
  }

  function testNotification() {
    chrome.runtime.sendMessage({ action: 'testNotification' }, (response) => {
      if (response && response.success) {
        showMessage('Test notification sent!', 'success');
      }
    });
  }

  function updateUI(isActive, intervalMinutes = null, lastReminder = null) {
    if (isActive) {
      statusIndicator.classList.remove('stopped');
      statusIndicator.classList.add('running');
      statusText.textContent = `Timer Running (${intervalMinutes || intervalSelect.value} min)`;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      intervalSelect.disabled = true;
    } else {
      statusIndicator.classList.remove('running');
      statusIndicator.classList.add('stopped');
      statusText.textContent = 'Timer Stopped';
      startBtn.disabled = false;
      stopBtn.disabled = true;
      intervalSelect.disabled = false;
    }

    // Update last reminder time
    if (lastReminder) {
      const lastTime = new Date(lastReminder);
      const now = new Date();
      const diffMinutes = Math.floor((now - lastTime) / (1000 * 60));
      
      if (diffMinutes < 60) {
        lastReminderElement.textContent = `Last reminder: ${diffMinutes} minutes ago`;
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        lastReminderElement.textContent = `Last reminder: ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      }
    } else {
      lastReminderElement.textContent = 'Last reminder: Never';
    }
  }

  function showMessage(message, type = 'info') {
    // Create a temporary message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Insert at the top of container
    const container = document.querySelector('.container');
    container.insertBefore(messageEl, container.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 3000);
  }

  // Refresh status every 30 seconds
  setInterval(loadStatus, 30000);
});