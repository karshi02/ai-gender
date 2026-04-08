// ========== CONFIGURATION ==========
const MAX_IMAGE_SIZE_MB = 5;
const MIN_IMAGE_DIMENSION = 200;
const API_BASE = '/api';

// ========== GLOBAL STATE ==========
let currentScreen = 'welcome';
let photoDataUrl = null;
let photoBase64 = null;
let selectedTheme = null;
let resultUrl = null;
let cameraStream = null;
let generatedImages = [];
let selectedImageIndex = -1;
let currentInterval = null;
let currentTimeout = null;