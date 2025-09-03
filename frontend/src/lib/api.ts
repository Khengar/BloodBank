import axios from 'axios';

// Create a configured instance of axios
const api = axios.create({
  baseURL: '/api', // This should match your backend's proxy or URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;