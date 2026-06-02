chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "befitAlarm") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "be-fit",
            message: "Time to do your push-ups!"
        });
        chrome.storage.local.remove("countDownDate");
    }
});