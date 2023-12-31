# myVicRoads Clone

A fully functional, 100% offline clone of the myVicRoads app.
Cloned from https://angus-copy-904497c8.base44.app/

## Features

- ✅ Complete React application with all functionality
- ✅ TailwindCSS styling - no CSS issues
- ✅ All 16 images downloaded and served locally
- ✅ Backend API mocked with localStorage (fully offline)
- ✅ Works completely offline - zero external network calls
- ✅ PWA enabled for fullscreen mobile experience
- ✅ Data persists in browser localStorage

## How to Run

### Option 1: Python HTTP Server (Recommended)
```bash
python -m http.server 8080
```
Then open http://localhost:8080 in your browser

### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8080
```
Then open http://localhost:8080 in your browser

### Access on Mobile (Same WiFi Network)
Find your computer's IP address and access from your phone:
```bash
# Windows
ipconfig | Select-String -Pattern "IPv4"

# Then on your phone, go to:
http://YOUR_IP_ADDRESS:8080
```

## Files Structure

```
├── index.html                      # Main HTML file
├── manifest.json                   # PWA manifest for mobile
├── vercel.json                     # Vercel deployment + cache config
├── assets/
│   ├── index-v2.css               # TailwindCSS styles (72KB)
│   ├── index-v2.js                # React app bundle (436KB, patched for offline)
│   └── images/
│       ├── vicroads-favicon.webp   # App icon / favicon
│       ├── vicroads-logo.png       # VicRoads logo
│       ├── demerit-icon.jpg        # Demerit points icon
│       ├── vehicles-icon.jpg       # Vehicles icon
│       ├── lock-icon.jpg           # PIN lock icon
│       ├── expand-icon.png         # Expand arrow
│       ├── nav-bar.png             # Bottom navigation bar
│       ├── hologram.png            # Licence hologram overlay
│       ├── outline.png             # Licence outline
│       ├── licence-bg.jpg          # Licence background
│       ├── vic-coat-arms.jpg       # Victorian coat of arms
│       ├── vic-coat-arms2.jpg      # Victorian coat of arms (alt)
│       ├── screenshot-licence.png  # Licence screenshot
│       ├── screenshot-detail.jpeg  # Detail screenshot
│       ├── image-generic.png       # Generic placeholder image
│       ├── image-extra.png         # Extra placeholder image
│       └── 1774435723224-019d249b-f5bc-7340-a1cc-dd8987f72632.png  # Profile photo placeholder
└── README.md                       # This file
```

## App Flow

1. **Splash Screen** - Shows VicRoads logo with spinner (2 seconds)
2. **PIN Entry** - Enter any 6 digits to proceed
3. **Home** - Dashboard with demerit points, vehicles, licence card
4. **Bottom Nav** - Home, Vehicles, Licence, Payments, Profile tabs
5. **Admin Mode** - Tap the VicRoads logo 5 times on splash to access

## 📱 Install as Fullscreen App on Mobile

### iPhone/iPad (Safari):
1. Open the site in Safari
2. Tap Share → "Add to Home Screen"
3. Tap "Add"
4. Launch from home screen = fullscreen, no URL bar!

### Android (Chrome):
1. Open in Chrome
2. Menu → "Add to Home Screen"
3. Tap "Add"
4. Launch from home screen = fullscreen, no URL bar!

## Notes

- 100% offline - no external dependencies
- All images are local (downloaded from original Supabase storage)
- Backend API fully mocked with localStorage
- Data persists across sessions in the browser
- Custom logo on splash screen
- Ready to share or deploy anywhere
