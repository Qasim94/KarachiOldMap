// Karachi Map Configuration for GCS-hosted tiles
// This script loads map tiles from Google Cloud Storage

// Configuration
const CONFIG = {
    // Google Cloud Storage bucket configuration
    BUCKET_NAME: 'karachi_tiles',
    TILES_PATH: '', // Empty because tiles are at root level of bucket
    
    // Map bounds (from tilemapresource.xml)
    BOUNDS: {
        north: 24.88196325605469,
        south: 24.775039672851562,
        east: 67.08074951171875,
        west: 66.91925048828125
    },
    
    // Default map center (Karachi center - adjusted to tile area)
    CENTER: [24.8282, 67.0001], // Centered on available tiles
    DEFAULT_ZOOM: 10, // Start at zoom level where tiles exist
    MIN_ZOOM: 1,
    MAX_ZOOM: 18
};

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
