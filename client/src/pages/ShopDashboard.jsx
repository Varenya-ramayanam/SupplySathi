import React, { useEffect, useState } from 'react';
import API from '../api';

const ShopDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: '',
    expiryDate: '',
    photoUrl: ''
  });

  const loadProducts = async () => {
    const res = await API.get('/shop/products');
    setProducts(res.data);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert('Product name is required');
    await API.post('/shop/products', form);
    setForm({ name: '', price: '', quantity: '', expiryDate: '', photoUrl: '' });
    loadProducts();
  };

  useEffect(() => { loadProducts(); }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Shop Owner Dashboard</h2>

        {/* Product Form */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            className="border px-3 py-2 rounded"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            className="border px-3 py-2 rounded"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded"
            placeholder="Expiry Date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />
          <input
            className="border px-3 py-2 rounded col-span-2 md:col-span-1"
            placeholder="Photo URL"
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
          />
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Add Product
          </button>
        </div>

        {/* Product List */}
        <h3 className="text-xl font-semibold mb-4">Your Products</h3>
        <ul className="space-y-3">
          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            products.map((p) => (
              <li
                key={p._id}
                className="flex items-center justify-between bg-gray-50 border px-4 py-2 rounded"
              >
                <div>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-gray-600 ml-2">₹{p.price} (Qty: {p.quantity})</span>
                </div>
                <span className="text-xs text-gray-500">
                  Exp: {new Date(p.expiryDate).toLocaleDateString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ShopDashboard;
