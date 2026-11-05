#!/bin/bash

# Create WhatsApp/OG preview image using ImageMagick
convert -size 1200x630 \
  gradient:'#667eea'-'#764ba2' \
  -font 'Arial-Bold' \
  -pointsize 80 \
  -fill '#FFD700' \
  -gravity center \
  -annotate +0-150 '🪔 Happy Diwali 🪔' \
  -pointsize 50 \
  -fill white \
  -annotate +0-50 'दिवाली की शुभकामनाएं' \
  -pointsize 40 \
  -annotate +0+50 'आपके लिए एक खास Gift 🎁' \
  -pointsize 35 \
  -annotate +0+120 '✨ दीपों का त्यौहार मुबारक हो ✨' \
  preview.jpg

echo "✅ Preview image created: preview.jpg"
