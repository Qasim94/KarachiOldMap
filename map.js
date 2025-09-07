// Karachi Tiles Map Application - GCS Version
class KarachiTilesMap {
    constructor() {
        this.map = null;
        this.customTileLayer = null;
        this.tilesLoaded = 0;
        this.init();
    }

    init() {
        this.initMap();
        this.setupTileLayer();
        this.setupEventListeners();
        this.updateInfo();
    }

    initMap() {
        // Initialize the map centered exactly where your tiles exist
        // From tilemapresource.xml: BoundingBox 66.91-67.08, 24.77-24.88
        this.map = L.map('map', {
            center: [24.8267, 66.9976], // Center of actual tile bounding box
            zoom: 10, // Start at zoom 10 where tiles begin
            maxZoom: 18,
            minZoom: 1 // Allow zooming out to see the whole world
        });

        // Add base map underneath your tiles
        const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        });
        baseLayer.addTo(this.map);
    }

    setupTileLayer() {
        // GCS tile layer - this loads your tiles from Google Cloud Storage
        this.customTileLayer = L.tileLayer('https://storage.googleapis.com/karachi_tiles/{z}/{x}/{y}.png', {
            attribution: '© Karachi Tiles from Google Cloud Storage',
            maxZoom: 18,
            minZoom: 10,
            tms: true, // Important: Use TMS coordinate system
            opacity: 0.9,
            // Define the bounds where tiles exist
            bounds: [[24.775039672851562, 66.91925048828125], 
                    [24.88196325605469, 67.08074951171875]]
        });

        // Event handlers for debugging
        this.customTileLayer.on('tileload', (e) => {
            this.tilesLoaded++;
            this.updateInfo();
            console.log('Tile loaded:', e.url);
        });

        this.customTileLayer.on('tileerror', (e) => {
            console.log('Tile error:', e.tile.src);
        });

        this.customTileLayer.addTo(this.map);
    }

    setupEventListeners() {
        // Update info panel when map moves or zooms
        this.map.on('moveend zoomend', () => {
            this.updateInfo();
        });

        // Opacity control
        const opacitySlider = document.getElementById('opacitySlider');
        const opacityValue = document.getElementById('opacityValue');
        
        if (opacitySlider && opacityValue) {
            opacitySlider.addEventListener('input', (e) => {
                const opacity = parseFloat(e.target.value);
                this.customTileLayer.setOpacity(opacity);
                opacityValue.textContent = opacity.toFixed(1);
            });
        }
    }

    updateInfo() {
        const zoom = this.map.getZoom();
        const center = this.map.getCenter();
        
        document.getElementById('currentZoom').textContent = zoom;
        document.getElementById('currentCenter').textContent = 
            `${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`;
        document.getElementById('tilesLoaded').textContent = this.tilesLoaded;
    }
}

// Initialize the map when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Karachi Tiles Map...');
    console.log('Tile URL template: https://storage.googleapis.com/karachi_tiles/{z}/{x}/{y}.png');
    console.log('Example tile: https://storage.googleapis.com/karachi_tiles/10/702/584.png');
    
    window.karachiMap = new KarachiTilesMap();
});

// Initialize the map
const map = L.map('map', {
    center: CONFIG.CENTER,
    zoom: CONFIG.DEFAULT_ZOOM,
    minZoom: CONFIG.MIN_ZOOM,
    maxZoom: CONFIG.MAX_ZOOM,
    zoomControl: true
});

// Add a base map layer (OpenStreetMap)
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Create the tile layer using Google Cloud Storage URLs
const karachiTileLayer = L.tileLayer(
    `https://storage.googleapis.com/${CONFIG.BUCKET_NAME}/{z}/{x}/{y}.png`,
    {
        attribution: '© Karachi Tiles | Hosted on Google Cloud Storage',
        tms: true, // Important: Use TMS coordinate system
        opacity: 0.9,
        errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Transparent 1x1 pixel
        bounds: [
            [CONFIG.BOUNDS.south, CONFIG.BOUNDS.west],
            [CONFIG.BOUNDS.north, CONFIG.BOUNDS.east]
        ]
    }
);

// Add the tile layer to the map
karachiTileLayer.addTo(map);

// Debug: Log the tile URL template
console.log('Tile URL template:', `https://storage.googleapis.com/${CONFIG.BUCKET_NAME}/{z}/{x}/{y}.png`);
console.log('Example tile URL:', 'https://storage.googleapis.com/karachi_tiles/10/702/584.png');

// Fit the map to the bounds of available tiles
const bounds = L.latLngBounds(
    L.latLng(CONFIG.BOUNDS.south, CONFIG.BOUNDS.west),
    L.latLng(CONFIG.BOUNDS.north, CONFIG.BOUNDS.east)
);

// Set max bounds to prevent excessive panning
map.setMaxBounds(bounds.pad(0.1));

// Initial fit to bounds
map.fitBounds(bounds);

// Coordinate display functionality
const coordinatesDiv = document.getElementById('coordinates');

function updateCoordinates(lat, lng, zoom) {
    coordinatesDiv.innerHTML = `
        Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}<br>
        Zoom: ${zoom}
    `;
}

// Update coordinates on map events
map.on('click', function(e) {
    updateCoordinates(e.latlng.lat, e.latlng.lng, map.getZoom());
});

map.on('zoomend moveend', function() {
    const center = map.getCenter();
    updateCoordinates(center.lat, center.lng, map.getZoom());
});

// Add a marker for Karachi center
const karachiMarker = L.marker(CONFIG.CENTER)
    .addTo(map)
    .bindPopup('<b>Karachi</b><br>Center of the map area')
    .openPopup();

// Loading indicator
const loadingDiv = document.getElementById('loading');

// Show loading when tiles are loading
let tilesLoading = 0;
karachiTileLayer.on('loading', function() {
    tilesLoading++;
    if (tilesLoading > 0) {
        loadingDiv.style.display = 'block';
    }
});

karachiTileLayer.on('load', function() {
    tilesLoading = Math.max(0, tilesLoading - 1);
    if (tilesLoading === 0) {
        loadingDiv.style.display = 'none';
    }
});

// Error handling for missing tiles
karachiTileLayer.on('tileerror', function(e) {
    console.log('Tile loading error:', e);
    // The errorTileUrl will handle display of missing tiles
});

// Add scale control
L.control.scale({
    position: 'bottomleft',
    metric: true,
    imperial: false
}).addTo(map);

// Add zoom control with custom position
map.zoomControl.setPosition('topleft');

// Console information
console.log('Karachi Map initialized');
console.log('Tile URL template:', `https://storage.googleapis.com/${CONFIG.BUCKET_NAME}/${CONFIG.TILES_PATH}/{z}/{x}/{y}.png`);
console.log('Map bounds:', CONFIG.BOUNDS);
console.log('TMS coordinate system enabled');

// Export for debugging
window.karachiMap = {
    map: map,
    tileLayer: karachiTileLayer,
    config: CONFIG,
    bounds: bounds
};
