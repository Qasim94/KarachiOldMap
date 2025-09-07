# Karachi Old Map 🗺️

An interactive map of Karachi displaying historical map tiles hosted on Google Cloud Storage and served via GitHub Pages.

## 🚀 Live Demo

Visit the live map: [https://Qasim94.github.io/KarachiOldMap/](https://Qasim94.github.io/KarachiOldMap/)

## 📖 About

This project displays interactive map tiles of Karachi using:
- **Frontend**: Leaflet.js for interactive mapping
- **Hosting**: GitHub Pages (free)
- **Tiles**: Google Cloud Storage
- **Coordinate System**: TMS (Tile Map Service)
- **Zoom Levels**: 10-18

## 🎯 Features

- 🗺️ Interactive pan and zoom
- 📍 Click to get coordinates
- 📱 Mobile-friendly responsive design
- ⚡ Fast tile loading from Google Cloud Storage
- 🎨 Clean, modern interface
- 🔧 Bounded to available tile area

## 🛠️ Technical Details

### Map Configuration
- **Bounds**: 24.775°N to 24.882°N, 66.919°E to 67.081°E
- **Center**: Karachi (24.8607°N, 67.0011°E)
- **Tile Format**: PNG images in TMS coordinate system
- **Source**: `https://storage.googleapis.com/karachi_tiles/karachi_tiles/{z}/{x}/{y}.png`

### Files
- `index.html` - Main webpage with map interface
- `map.js` - JavaScript configuration for Leaflet.js
- `README.md` - This documentation

## 🔧 Local Development

To run locally:
1. Clone this repository
2. Serve files using any web server:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

## 📊 Performance

- **Hosting Cost**: Free (GitHub Pages)
- **Tile Storage**: ~$0.02/month for 1GB on Google Cloud Storage
- **Bandwidth**: ~$0.12/GB for tile transfers
- **Global CDN**: Included with GitHub Pages

## 🎨 Customization

To modify the map configuration, edit the `CONFIG` object in `map.js`:

```javascript
const CONFIG = {
    BUCKET_NAME: 'your-bucket-name',
    TILES_PATH: 'your-tiles-path',
    CENTER: [24.8607, 67.0011],
    // ... other settings
};
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Contact

- GitHub: [@Qasim94](https://github.com/Qasim94)
- Project: [KarachiOldMap](https://github.com/Qasim94/KarachiOldMap)

---

Made with ❤️ for exploring Karachi's geography
