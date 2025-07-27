import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Signup = () => {
  const navigate = useNavigate();

  const [forms, setForms] = useState({
    vendor: { name: '', email: '', password: '', phone: '', address: '' },
    shop: { name: '', shopName: '', email: '', password: '', phone: '', address: '' },
    middleman: { name: '', godownAddress: '', email: '', password: '', phone: '', address: '' }
  });

  const handleChange = (role, field, value) => {
    setForms(prev => ({
      ...prev,
      [role]: { ...prev[role], [field]: value },
    }));
  };

  const handleSignup = async (role) => {
    try {
      await API.post(`/${role}/signup`, forms[role]);
      alert(`${role} signed up successfully`);
      navigate('/');
    } catch (err) {
      alert(`${role} signup failed`);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Signup as Vendor, Shop Owner, or Middleman
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">

        {/* Vendor Signup */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Vendor Signup</h3>
          <input placeholder="Name" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('vendor', 'name', e.target.value)} />
          <input placeholder="Email" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('vendor', 'email', e.target.value)} />
          <input type="password" placeholder="Password" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('vendor', 'password', e.target.value)} />
          <input placeholder="Phone" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('vendor', 'phone', e.target.value)} />
          <input placeholder="Address" className="w-full border px-3 py-2 mb-5 rounded" onChange={(e) => handleChange('vendor', 'address', e.target.value)} />
          <button onClick={() => handleSignup('vendor')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Signup</button>
        </div>

        {/* Shop Owner Signup */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Shop Owner Signup</h3>
          <input placeholder="Name" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('shop', 'name', e.target.value)} />
          <input placeholder="Shop Name" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('shop', 'shopName', e.target.value)} />
          <input placeholder="Email" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('shop', 'email', e.target.value)} />
          <input type="password" placeholder="Password" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('shop', 'password', e.target.value)} />
          <input placeholder="Phone" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('shop', 'phone', e.target.value)} />
          <input placeholder="Address" className="w-full border px-3 py-2 mb-5 rounded" onChange={(e) => handleChange('shop', 'address', e.target.value)} />
          <button onClick={() => handleSignup('shop')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Signup</button>
        </div>

        {/* Middleman Signup */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Middleman Signup</h3>
          <input placeholder="Name" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('middleman', 'name', e.target.value)} />
          <input placeholder="Godown Address" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('middleman', 'godownAddress', e.target.value)} />
          <input placeholder="Email" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('middleman', 'email', e.target.value)} />
          <input type="password" placeholder="Password" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('middleman', 'password', e.target.value)} />
          <input placeholder="Phone" className="w-full border px-3 py-2 mb-3 rounded" onChange={(e) => handleChange('middleman', 'phone', e.target.value)} />
          <input placeholder="Address" className="w-full border px-3 py-2 mb-5 rounded" onChange={(e) => handleChange('middleman', 'address', e.target.value)} />
          <button onClick={() => handleSignup('middleman')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Signup</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
