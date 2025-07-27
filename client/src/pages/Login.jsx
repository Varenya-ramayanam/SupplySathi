import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();

  const [forms, setForms] = useState({
    vendor: { email: '', password: '' },
    shop: { email: '', password: '' },
    middleman: { email: '', password: '' },
  });

  const handleChange = (role, field, value) => {
    setForms((prev) => ({
      ...prev,
      [role]: { ...prev[role], [field]: value },
    }));
  };

  const handleLogin = async (role) => {
    const { email, password } = forms[role];

    if (!email || !password) {
      toast.error("❗ Please enter both email and password");
      return;
    }

    try {
      const res = await API.post(`/${role}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success(`✅ Logged in as ${role}`);
      navigate(`/${role}`);
    } catch (err) {
      console.error(`Login failed for ${role}:`, err);
      toast.error(`❌ Login failed for ${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
        Welcome Back 👋<br />Login to your Role
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        {['vendor', 'shop', 'middleman'].map((role) => (
          <div
            key={role}
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-8 w-full hover:shadow-2xl transition duration-300"
          >
            <h3 className="text-2xl font-semibold capitalize text-center mb-6 text-blue-400">
              {role} Login
            </h3>

            <input
              type="email"
              placeholder="Email"
              value={forms[role].email}
              onChange={(e) => handleChange(role, 'email', e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={forms[role].password}
              onChange={(e) => handleChange(role, 'password', e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => handleLogin(role)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-400 mt-5">
              New to platform?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;
