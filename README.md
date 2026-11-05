# 🪔 Happy Diwali - Personalized Wish Sharing Platform

A beautiful web application to create and share personalized Diwali wishes with photos.

![Diwali](https://www.surajrana.dev/happydiwali/preview.jpg)

## ✨ Features

- 🎨 **Beautiful Animations**: Fireworks, diyas, floating lanterns, and boat animations
- 📸 **Photo Upload**: Add your photo to personalize wishes
- 🔒 **Server-Side Storage**: Images stored securely on server
- 📱 **WhatsApp Integration**: Direct share to WhatsApp (Mobile & Web)
- 🎁 **Gift Animation**: Interactive gift box opening animation
- 🌊 **Boat Animation**: Lord Ram's return to Ayodhya animation
- 📲 **WhatsApp Preview**: Beautiful thumbnail preview when shared
- 🎯 **Mobile Responsive**: Perfect on all devices
- 💾 **Short URLs**: Compact shareable links (~85 chars)

## 🚀 Live Demo

**Website**: [https://www.surajrana.dev/happydiwali/](https://www.surajrana.dev/happydiwali/)

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Animations, gradients, responsive design
- **JavaScript (Vanilla)** - No frameworks, pure JS
- **Canvas API** - Fireworks animation

### Backend
- **Node.js** - API server
- **PM2** - Process management
- **Nginx** - Reverse proxy & SSL
- **HTTPS** - Secure communication

### Infrastructure
- **VPS Hosting** - Ubuntu 22.04
- **SSL/TLS** - Let's Encrypt certificate
- **File Storage** - Temporary image storage (7-day auto-cleanup)

## 📋 Features Breakdown

### 1. Image Upload & Compression
- Auto-resize to 150px × 150px
- JPEG compression at 40% quality
- ~3-8KB compressed images
- Perfect for circular profile display

### 2. Server-Side API
- **POST** `/api/save` - Save wish with image
- **GET** `/api/load/:id` - Load wish by ID
- **GET** `/api/cleanup` - Auto-cleanup old wishes
- Data stored as JSON files
- Auto-delete after 7 days

### 3. WhatsApp Sharing
- **Mobile**: Direct app open with `whatsapp://`
- **Desktop**: WhatsApp Web via `api.whatsapp.com`
- Pre-filled personalized message
- Fallback handling for popup blockers

### 4. Animations
- ✨ Fireworks (canvas-based)
- 🪔 Floating diyas with flames
- 🏮 Flying sky lanterns
- 🚤 Boat animation (Lord Ram's return)
- 🎁 Gift box opening animation
- ✨ Sparkles and glowing effects

## 📱 WhatsApp Message Format

```
"Suraj" ने, आपको Gift 🎁 भेजा है!

दिवाली की हार्दिक शुभकामनाएं! 🎆

https://www.surajrana.dev/happydiwali/?name=Suraj&id=xyz123
```

## 🔧 Installation

### Prerequisites
- Node.js (v14+)
- PM2 (for production)
- Nginx (for reverse proxy)
- SSL Certificate

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/surajranaofficial/diwali-gift-wishes.git
cd diwali-gift-wishes
```

2. **Install PM2 (if not installed)**
```bash
npm install -g pm2
```

3. **Start the API server**
```bash
pm2 start api.js --name diwali-api
pm2 save
pm2 startup
```

4. **Configure Nginx**
```nginx
location /happydiwali/api/ {
    proxy_pass http://127.0.0.1:3030/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

5. **Open in browser**
```
https://yourdomain.com/happydiwali/
```

## 📂 Project Structure

```
diwali-gift-wishes/
├── index.html          # Main HTML file
├── style.css           # All styles and animations
├── script.js           # Client-side JavaScript
├── api.js              # Node.js API server
├── preview.jpg         # WhatsApp preview thumbnail
├── uploads/            # Temporary image storage
└── README.md           # This file
```

## 🔐 Security

- ✅ No passwords or API keys in code
- ✅ HTTPS enabled for all communications
- ✅ CORS properly configured
- ✅ File permissions set correctly
- ✅ Auto-cleanup of user data (7 days)
- ✅ No tracking or analytics

## 🎨 Customization

### Change Colors
Edit `style.css` gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change API Port
Edit `api.js`:
```javascript
const PORT = 3030;
```

### Change Image Size
Edit `script.js`:
```javascript
const maxSize = 150; // Image dimensions
const quality = 0.4; // JPEG quality (0.0 - 1.0)
```

## 🚀 Deployment

### One-Click Deployment
Use the included deployment script:
```bash
./auto-deploy-diwali.sh
```

### Manual Deployment
```bash
# Upload files to server
scp index.html script.js style.css preview.jpg user@server:/path/

# Start API server
pm2 start api.js --name diwali-api

# Reload Nginx
sudo systemctl reload nginx
```

## 📊 API Endpoints

### Save Wish
```
POST /api/save
Content-Type: application/json

{
  "name": "Suraj",
  "image": "data:image/jpeg;base64,..."
}

Response:
{
  "id": "xyz123",
  "success": true
}
```

### Load Wish
```
GET /api/load/xyz123

Response:
{
  "name": "Suraj",
  "image": "data:image/jpeg;base64,...",
  "timestamp": 1697812345678
}
```

## 🎯 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly buttons (min 50px height)
- Optimized animations for mobile
- WhatsApp app integration
- Compressed images for fast loading

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Suraj Rana**
- Website: [surajrana.dev](https://www.surajrana.dev)
- GitHub: [@surajranaofficial](https://github.com/surajranaofficial)

## 🎉 Acknowledgments

- Inspired by traditional Diwali celebrations
- Built with ❤️ for spreading Diwali joy
- Special thanks to the open-source community

## 📞 Support

For support, email or create an issue in the GitHub repository.

---

## 🪔 Happy Diwali! 🎆

Made with ❤️ in India 🇮🇳

---

## 📋 Branding & SEO Instructions

- **Brand & Backlink**: Powered by [EasyLauncher](https://easylauncher.net)
- **Google Tag Manager**: `GTM-TWXXLBPN` integrated
- **SEO**: Comprehensive SEO optimization implemented
