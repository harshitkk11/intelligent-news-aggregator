import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add other default headers if needed
  },
  timeout: 10000, // Optional: set request timeout
});

export default api;