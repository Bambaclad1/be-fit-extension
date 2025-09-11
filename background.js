// Background script for Be Fit extension
// Handles timer functionality and push-up notifications

let timerState = {
  isActive: false,
  intervalMinutes: 30, // Default 30 minutes
  lastReminder: null
};

// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Be Fit extension installed');
  
  // Create notification on install
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: 'Be Fit Extension Ready!',
    message: '💪 Ready to help you stay fit with push-up reminders!'
  });
});

// Start the timer
function startTimer(intervalMinutes = 30) {
  timerState.isActive = true;
  timerState.intervalMinutes = intervalMinutes;
  
  // Clear any existing alarm
  chrome.alarms.clear('pushupReminder');
  
  // Create new alarm
  chrome.alarms.create('pushupReminder', {
    delayInMinutes: intervalMinutes,
    periodInMinutes: intervalMinutes
  });
  
  console.log(`Timer started: ${intervalMinutes} minute intervals`);
}

// Stop the timer
function stopTimer() {
  timerState.isActive = false;
  chrome.alarms.clear('pushupReminder');
  console.log('Timer stopped');
}

// Handle alarm triggers
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pushupReminder' || alarm.name === 'snoozeReminder') {
    showPushupReminder();
  }
});

// Show push-up reminder notification
function showPushupReminder() {
  const messages = [
    '💪 Time for push-ups! Drop and give me 10!',
    '⏰ Push-up break! Your body will thank you!',
    '🔥 Let\'s get those muscles moving! Push-up time!',
    '💯 Stay strong! Do some push-ups right now!',
    '⚡ Energy boost time! Quick push-up session!'
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: 'Be Fit Reminder',
    message: randomMessage,
    buttons: [
      { title: 'Done! ✓' },
      { title: 'Snooze 5min' }
    ]
  });
  
  timerState.lastReminder = Date.now();
}

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // "Done" button clicked
    chrome.notifications.clear(notificationId);
  } else if (buttonIndex === 1) {
    // "Snooze" button clicked
    chrome.notifications.clear(notificationId);
    
    // Create snooze alarm
    chrome.alarms.create('snoozeReminder', {
      delayInMinutes: 5
    });
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    startTimer(request.intervalMinutes);
    sendResponse({ success: true, message: 'Timer started' });
  } else if (request.action === 'stopTimer') {
    stopTimer();
    sendResponse({ success: true, message: 'Timer stopped' });
  } else if (request.action === 'getStatus') {
    sendResponse({
      isActive: timerState.isActive,
      intervalMinutes: timerState.intervalMinutes,
      lastReminder: timerState.lastReminder
    });
  } else if (request.action === 'testNotification') {
    showPushupReminder();
    sendResponse({ success: true, message: 'Test notification sent' });
  }
  
  return true; // Keep message channel open for async response
});