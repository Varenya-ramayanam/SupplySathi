// ✅ src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import {Toaster} from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster/>
    <App />
  </BrowserRouter>
);