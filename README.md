# 💪 Be Fit Extension

A Chrome browser extension that helps you stay healthy by reminding you to do push-ups at regular intervals. Perfect for developers, office workers, or anyone who spends long hours at their computer!

## ✨ Features

- **⏰ Customizable Timer**: Set reminders from 1 minute (for testing) up to 1 hour intervals
- **🔔 Smart Notifications**: Browser notifications with motivational messages and snooze functionality
- **🎮 Interactive UI**: Clean, professional popup interface with status indicators
- **💾 Persistent State**: Timer continues running even when browser is minimized
- **🧪 Test Mode**: Instant notification testing to verify everything works

## 🚀 Installation

1. **Download the Extension**
   - Clone this repository or download as ZIP
   ```bash
   git clone https://github.com/Bambaclad1/be-fit-extension.git
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder containing `manifest.json`

3. **Start Using**
   - The extension icon will appear in your Chrome toolbar
   - Click it to open the popup and start your timer!

## 📖 How to Use

### Basic Usage
1. Click the Be Fit extension icon in your toolbar
2. Select your preferred reminder interval (30 minutes is default)
3. Click "START TIMER"
4. Get motivated with push-up reminders at your chosen interval!

### Advanced Features
- **Test Notifications**: Click "Test Notification" to see a sample reminder
- **Snooze**: When a notification appears, click "Snooze 5min" for a short delay
- **Status Tracking**: View when your last reminder occurred
- **Quick Tips**: Built-in motivation and form tips

## 🎯 Notification Messages

The extension randomly selects from motivational messages like:
- "💪 Time for push-ups! Drop and give me 10!"
- "⏰ Push-up break! Your body will thank you!"
- "🔥 Let's get those muscles moving! Push-up time!"
- "💯 Stay strong! Do some push-ups right now!"
- "⚡ Energy boost time! Quick push-up session!"

## 🛠️ Technical Details

- **Manifest Version**: 3 (Latest Chrome Extension standard)
- **Permissions**: `notifications`, `alarms`
- **Architecture**: Service Worker background script with popup UI
- **APIs Used**: Chrome Alarms API, Notifications API
- **Styling**: Modern CSS with responsive design

## 📁 File Structure

```
be-fit-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (timer logic)
├── popup.html            # User interface
├── popup.js              # UI interaction logic  
├── popup.css             # Styling
├── icons/                # Extension icons
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md             # This file
```

## 🧪 Development & Testing

### Testing Intervals
- Use "1 minute (testing)" for quick validation
- Production intervals: 15min, 30min, 45min, 1 hour

### Debugging
- Check `chrome://extensions/` for any error messages
- Use "Test Notification" to verify notification permissions
- Monitor background script in Chrome DevTools

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

---

**Stay healthy, stay strong! 💪**
