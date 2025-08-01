// ✅ src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VendorDashboard from './pages/VendorDashboard';
import ShopDashboard from './pages/ShopDashboard';
import MiddlemanDashboard from './pages/MiddlemanDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReviewForm from './pages/ReviewForm';


function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/vendor" element={<VendorDashboard />} />
      <Route path="/shop" element={<ShopDashboard />} />
      <Route path="/middleman" element={<MiddlemanDashboard />} />
      <Route path="/vendor/review/:deliveryId" element={<ReviewForm />} />
    </Routes>
  );
}

export default App;
