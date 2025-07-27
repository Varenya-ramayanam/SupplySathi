// src/api.js

import axios from 'axios';

// Create an axios instance with the base URL pointing to your backend API prefix
const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}/api`, // Important: includes /api prefix to match your Express routes
});

// Automatically attach the JWT token from localStorage (if exists) to every request's Authorization header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
