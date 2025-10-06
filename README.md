# Finder's Augury - Steampunk Location Finder

A beautiful, mobile-friendly location finder website with a steampunk theme. This application uses the Google Maps Geocoding API to display your current location as a street address, postal code, and coordinates.

## Features

- 🎨 **Steampunk-themed UI** - Beautiful vintage aesthetic with brass, copper, and glowing cyan accents
- 📱 **Mobile-friendly** - Fully responsive design that works on all devices
- 🗺️ **Location Detection** - Uses browser geolocation to find your current position
- 📍 **Address Display** - Shows street address and postal code
- 🧭 **Coordinate Display** - Shows latitude/longitude in both DMS and decimal formats
- ⚙️ **Animated Interface** - Smooth animations and glowing effects

## Setup Instructions

### 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Geocoding API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Geocoding API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Configure the API Key

1. Open `script.js` in a text editor
2. Find this line near the top:
   ```javascript
   const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
   ```
3. Replace `'YOUR_GOOGLE_MAPS_API_KEY_HERE'` with your actual API key:
   ```javascript
   const GOOGLE_MAPS_API_KEY = 'AIzaSyC...your-actual-key-here';
   ```
4. Save the file

### 3. Run the Website

#### Option A: Simple File Opening
1. Double-click `index.html` to open it in your default browser
2. **Note:** Some browsers may block geolocation on local files. If this happens, use Option B.

#### Option B: Using a Local Server (Recommended)

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

**Using Node.js (npx):**
```bash
npx serve

# Then open the URL shown in the terminal
```

**Using VS Code:**
- Install the "Live Server" extension
- Right-click on `index.html`
- Select "Open with Live Server"

### 4. Grant Location Permission

When you click the "Activate the Chrono-Locator" button, your browser will ask for permission to access your location. Click "Allow" to enable the location finder.

## File Structure

```
personal-website/
├── index.html          # Main HTML file
├── styles.css          # Steampunk styling
├── script.js           # Location finder logic
└── README.md          # This file
```

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### "Location access denied"
- Check your browser's location settings
- Make sure you clicked "Allow" when prompted
- Try using HTTPS or localhost instead of file://

### "Please configure your Google Maps API key"
- Make sure you've replaced the placeholder API key in `script.js`
- Verify the Geocoding API is enabled in Google Cloud Console
- Check that your API key has no restrictions blocking localhost

### "API key is invalid"
- Double-check you copied the entire API key correctly
- Ensure there are no extra spaces or quotes
- Verify the API key is active in Google Cloud Console

### Coordinates show but no address
- Check your API key configuration
- Ensure the Geocoding API is enabled
- Check the browser console (F12) for error messages

## Privacy & Security

- **Location data** is only used locally in your browser and sent to Google's Geocoding API
- **No data is stored** or sent to any other servers
- **API key security**: For production use, consider implementing API key restrictions in Google Cloud Console

## Credits

Created by **Alan Craik**

## License

This project is free to use for personal purposes.

---

Enjoy discovering the world with Finder's Augury! 🧭
