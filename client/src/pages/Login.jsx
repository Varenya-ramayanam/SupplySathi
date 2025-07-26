import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const navigate = useNavigate();

  const [forms, setForms] = useState({
    vendor: { email: '', password: '' },
    shop: { email: '', password: '' },
    middleman: { email: '', password: '' },
  });

  const handleChange = (role, field, value) => {
    setForms(prev => ({
      ...prev,
      [role]: { ...prev[role], [field]: value },
    }));
  };

  const handleLogin = async (role) => {
    const { email, password } = forms[role];
    try {
      const res = await API.post(`/${role}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      navigate(`/${role}`);
    } catch (err) {
      alert(`Login failed for ${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-center">Login as Vendor, Shop Owner, or Middleman</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        {['vendor', 'shop', 'middleman'].map((role) => (
          <div key={role} className="bg-white p-6 rounded-xl shadow-md w-full">
            <h3 className="text-xl font-semibold capitalize text-center mb-4">{role} Login</h3>
            <input
              type="email"
              placeholder="Email"
              value={forms[role].email}
              onChange={(e) => handleChange(role, 'email', e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              value={forms[role].password}
              onChange={(e) => handleChange(role, 'password', e.target.value)}
              className="w-full border rounded px-3 py-2 mb-6"
            />
            <button
              onClick={() => handleLogin(role)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              New? <button onClick={() => navigate(`/signup`)} className="text-blue-500 hover:underline">Sign up</button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;
