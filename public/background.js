function startAlarm(minutes) {
  chrome.alarms.create('myTimer', { periodInMinutes: minutes });
  chrome.storage.local.set({ 
    alarmEnd: Date.now() + minutes * 60 * 1000,
    alarmMinutes: minutes
  });
}

// default value
chrome.runtime.onInstalled.addListener(() => {
  startAlarm(15);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'myTimer') {
    console.log('tick');
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '128x128.png',
      title: 'be-fit',
      message: "die kaulo tijd is over!"
    });

    // restart for next period
    chrome.storage.local.get('alarmMinutes', ({ alarmMinutes }) => {
      chrome.storage.local.set({ alarmEnd: Date.now() + alarmMinutes * 60 * 1000 });
    });
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'startAlarm') {
    startAlarm(msg.minutes);
  }
});