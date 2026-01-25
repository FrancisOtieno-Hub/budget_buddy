# 💰 Budget Buddy - Personal Finance & Budgeting PWA

**Budget Buddy** is a modern, beautiful, and intuitive Progressive Web App (PWA) designed to help users manage personal finances effortlessly. Built with vanilla HTML, CSS, and JavaScript, it features offline capabilities, real-time tracking, and a responsive interface suitable for all age groups.

![Version](https://img.shields.io/badge/version-2.0.0-green)
![License](https://img.shields.io/badge/license-GPL--3.0-blue)
![PWA](https://img.shields.io/badge/PWA-ready-orange)

---

## ✨ Features

### Core Functionality
- ✅ **Real-time Tracking** - Monitor income, expenses, and balance instantly
- 📝 **Transaction Management** - Add, edit, delete transactions with ease
- 🏷️ **Smart Categories** - Organize spending across 11+ categories
- 📊 **Visual Analytics** - Interactive pie chart with color-coded legend
- 🔍 **Advanced Filtering** - Search and filter by category, type, or keyword
- 💾 **Data Export** - Export transactions to CSV for external analysis
- 📱 **Responsive Design** - Perfect experience on mobile, tablet, and desktop

### PWA Features
- 🚀 **Installable** - Add to home screen on any device
- 📴 **Offline Support** - Full functionality without internet
- ⚡ **Fast Loading** - Smart caching strategy for instant access
- 🔄 **Auto-updates** - Seamless background updates
- 🎨 **Native Feel** - Looks and feels like a native app

### User Experience
- 🎯 **Intuitive Interface** - Clean, modern design language
- 🌈 **Color Coding** - Green for income, red for expenses
- ✨ **Smooth Animations** - Delightful micro-interactions
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 👴 **Senior-Friendly** - Large fonts and clear layouts
- 🔔 **Toast Notifications** - Clear feedback for all actions

---

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FrancisOtieno-Hub/budget_buddy.git
   cd budget_buddy
   ```

2. **Serve locally** (for full PWA features)
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

4. **Install as PWA**
   - **Desktop**: Click the install icon in the address bar
   - **Mobile**: Tap "Add to Home Screen" from browser menu

---

## 📖 User Guide

### Adding Transactions

1. **Fill in the form**
   - Enter a description (e.g., "Grocery shopping")
   - Input the amount (positive number)
   - Select a category from the dropdown
   - Choose transaction type (Income or Expense)

2. **Submit**
   - Click "Add Transaction" button
   - Transaction appears instantly in the list
   - Summary cards update automatically

### Editing Transactions

1. Click the ✏️ edit icon on any transaction
2. Form populates with existing data
3. Make your changes
4. Click "Update Transaction"

### Filtering & Search

- **Search Box**: Type to filter by description
- **Category Filter**: Select a specific category
- **Type Filter**: Show only income or expenses
- **Combine Filters**: Use multiple filters together

### Exporting Data

1. Click the 📊 export button in the header
2. Downloads CSV file with all transactions
3. Open in Excel, Google Sheets, or any spreadsheet app

### Managing Data

- **Delete Single**: Click 🗑️ icon on any transaction
- **Clear All**: Use "Clear All" button (requires confirmation)
- **Edit Mode**: Cancel button appears during editing

---

## 🛠️ Technical Details

### Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure |
| **CSS3** | Modern styling with CSS Grid/Flexbox |
| **JavaScript** | App logic and interactivity |
| **Canvas API** | Pie chart visualization |
| **Service Worker** | Offline caching and PWA features |
| **LocalStorage** | Client-side data persistence |
| **Web App Manifest** | PWA installation metadata |

### Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Opera 70+

### Project Structure

```
budget-buddy/
│
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── app.js              # Application logic
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline caching
├── icon.png            # App icon (192x192 & 512x512)
├── README.md           # Documentation
└── LICENSE             # GPL-3.0 License
```

---

## 🎨 Key Improvements Over v1.0

### Fixed Bugs
- ✅ Radio button labels now properly connected
- ✅ Transactions section moved outside form
- ✅ Form validation with clear error messages
- ✅ XSS protection with HTML escaping

### New Features
- ✅ Edit transaction functionality
- ✅ Advanced search and filtering
- ✅ CSV export capability
- ✅ Toast notifications for feedback
- ✅ Chart legend with category breakdown
- ✅ Period selection for charts
- ✅ More categories (11 total)
- ✅ Transaction timestamps
- ✅ Clear all transactions option

### UI/UX Enhancements
- ✅ Modern gradient designs
- ✅ Smooth animations and transitions
- ✅ Better color scheme
- ✅ Responsive grid layouts
- ✅ Improved mobile experience
- ✅ Better accessibility (ARIA labels)
- ✅ Category icons for visual recognition
- ✅ Staggered list animations

### Performance
- ✅ Optimized service worker with cache versioning
- ✅ Smart cache cleanup
- ✅ Faster initial load
- ✅ Efficient DOM updates

---

## 🔐 Data & Privacy

- **Local Storage Only**: All data stays on your device
- **No Server**: No data sent to external servers
- **No Tracking**: Zero analytics or tracking
- **Your Data**: Full control over your financial information
- **Export Anytime**: Download your data as CSV

---

## 🚧 Future Enhancements

### Planned Features
- [ ] Budget goals and alerts
- [ ] Recurring transactions
- [ ] Multiple currency support
- [ ] Dark mode toggle
- [ ] Monthly/yearly reports
- [ ] Receipt photo attachments
- [ ] Cloud backup option (optional)
- [ ] Multi-language support
- [ ] Voice input for transactions
- [ ] Custom categories
- [ ] Import from CSV
- [ ] Budget vs actual comparison
- [ ] Bill reminders
- [ ] Multiple accounts

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on multiple devices/browsers
- Update documentation as needed

---

## 📝 License

This project is licensed under the **GNU General Public License v3.0**

See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Icons from standard emoji set
- Color palette inspired by Material Design
- Community feedback and suggestions

---

## 📧 Contact & Support

- **GitHub**: [@FrancisOtieno-Hub](https://github.com/FrancisOtieno-Hub)
- **Issues**: [Report a bug](https://github.com/FrancisOtieno-Hub/budget_buddy/issues)
- **Discussions**: [Join the conversation](https://github.com/FrancisOtieno-Hub/budget_buddy/discussions)

---

## 🌟 Star History

If you find Budget Buddy useful, please consider giving it a ⭐️ on GitHub!

---

**Made with ❤️ for better personal finance management**
