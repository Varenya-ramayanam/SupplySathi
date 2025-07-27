import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-hot-toast';

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
      toast.success(`🎉 ${role} signed up successfully`);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${role} signup failed`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Signup as Vendor, Shop Owner, or Middleman
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">

        {/* Vendor Signup */}
        <SignupForm
          title="Vendor Signup"
          fields={['name', 'email', 'password', 'phone', 'address']}
          formData={forms.vendor}
          onChange={(field, value) => handleChange('vendor', field, value)}
          onSubmit={() => handleSignup('vendor')}
        />

        {/* Shop Owner Signup */}
        <SignupForm
          title="Shop Owner Signup"
          fields={['name', 'shopName', 'email', 'password', 'phone', 'address']}
          formData={forms.shop}
          onChange={(field, value) => handleChange('shop', field, value)}
          onSubmit={() => handleSignup('shop')}
        />

        {/* Middleman Signup */}
        <SignupForm
          title="Middleman Signup"
          fields={['name', 'godownAddress', 'email', 'password', 'phone', 'address']}
          formData={forms.middleman}
          onChange={(field, value) => handleChange('middleman', field, value)}
          onSubmit={() => handleSignup('middleman')}
        />
      </div>
    </div>
  );
};

const SignupForm = ({ title, fields, formData, onChange, onSubmit }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-semibold text-center mb-4">{title}</h3>
    {fields.map((field, idx) => (
      <input
        key={idx}
        type={field === 'password' ? 'password' : 'text'}
        placeholder={field.replace(/([A-Z])/g, ' $1')}
        className="w-full border px-3 py-2 mb-3 rounded"
        value={formData[field] || ''}
        onChange={(e) => onChange(field, e.target.value)}
      />
    ))}
    <button
      onClick={onSubmit}
      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
    >
      Signup
    </button>
  </div>
);

export default Signup;
