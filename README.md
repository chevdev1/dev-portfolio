# ChevDev1 - Development Portfolio & Business Card

🚀 **Professional landing page for development services**

A modern, responsive portfolio website showcasing development capabilities with a focus on landing pages, web applications, and automation solutions.

## 🌟 Features

- **Multilingual Support**: Russian & Ukrainian languages
- **Responsive Design**: Perfect on all devices
- **Interactive Elements**: Animated icons, smooth transitions
- **Contact Forms**: Telegram integration for client inquiries
- **Portfolio Showcase**: Real project demonstrations
- **Easter Egg**: Hidden discount offer (click the rocket! 🚀)

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: TailwindCSS, Custom Animations
- **Icons**: Lucide Icons
- **Deployment**: GitHub Pages Ready

## 📁 Project Structure

```
├── index.html          # Main landing page
├── css/
│   └── animations.css  # Custom animations & styles
├── js/
│   ├── main.js         # Core functionality
│   └── translations.js # Language switching system
└── img/
    ├── avatar.png      # Developer avatar
    └── projects/       # Portfolio project images
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chevdev-portfolio.git
   cd chevdev-portfolio
   ```

2. **Open in browser**
   ```bash
   # Just open index.html in your browser
   # Or use Live Server in VS Code
   ```

3. **Deploy to GitHub Pages**
   - Push to GitHub
   - Enable Pages in repository settings
   - Your site will be available at: `https://yourusername.github.io/chevdev-portfolio`

## ⚙️ Configuration

### Telegram Bot Setup
To receive contact form submissions:

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Find your chat ID
4. Update `js/translations.js`:
   ```javascript
   const BOT_CONFIG = {
     token: 'YOUR_BOT_TOKEN',
     chatId: 'YOUR_CHAT_ID'
   };
   ```

### Language Customization
Edit translations in `js/translations.js` to modify content for both languages.

## 🎨 Customization

- **Colors**: Modify CSS custom properties in `css/animations.css`
- **Content**: Update text in `js/translations.js` for both languages
- **Portfolio**: Replace images in `img/projects/` and update descriptions
- **Contact**: Change Telegram link and contact information

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Edge 90+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contact

- **Telegram**: [@chevdev1](https://t.me/chevdev1)
- **GitHub**: [Your GitHub Profile](https://github.com/yourusername)

---

**Made with ❤️ for showcasing development skills and attracting clients**