// API Configuration
// Use localhost for development, production URL for deployment
const API_BASE_URL = 
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://backendofquickmoney.onrender.com';

export default API_BASE_URL;

