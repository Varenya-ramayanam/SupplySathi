import React, { useEffect, useState } from 'react';
import API from '../api';
import { LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ShopDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: '',
    expiryDate: '',
    photoFile: null,
  });

  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const res = await API.get('/shop/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("❌ Failed to fetch products");
    }
  };

  const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await API.post("/shop/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.url;
  } catch (err) {
    console.error("Image upload failed:", err);
    toast.error("Image upload failed");
    return null;
  }
};


  const handleSubmit = async () => {
    const { name, price, quantity, expiryDate, photoFile } = form;

    if (!name || !price || !quantity || !expiryDate || !photoFile) {
      toast.error('⚠️ Please fill out all fields and upload an image');
      return;
    }

    const photoUrl = await handleImageUpload(photoFile);
    if (!photoUrl) return;

    const productData = {
      name,
      price,
      quantity,
      expiryDate,
      photoUrl,
    };

    try {
      await API.post('/shop/products', productData);
      toast.success("✅ Product added successfully");
      setForm({
        name: '',
        price: '',
        quantity: '',
        expiryDate: '',
        photoFile: null,
      });
      loadProducts();
    } catch (err) {
      console.error("Error adding product", err);
      toast.error("❌ Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/shop/product/${id}`);
      toast.success("🗑️ Product deleted");
      setProducts((prev) => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      toast.error("❌ Failed to delete product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast("👋 Logged out");
    navigate('/');
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-xl p-6 relative">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold w-full text-center">Shop Owner Dashboard</h2>
          <button
            onClick={handleLogout}
            className="absolute right-6 top-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Product Form */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            type="date"
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded col-span-2 md:col-span-1"
            onChange={(e) => setForm({ ...form, photoFile: e.target.files[0] })}
          />
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
          >
            Add Product
          </button>
        </div>

        {/* Product List */}
        <h3 className="text-xl font-semibold mb-4">Your Products</h3>
        <ul className="space-y-3">
          {products.length === 0 ? (
            <p className="text-gray-400">No products added yet.</p>
          ) : (
            products.map((p) => (
              <li
                key={p._id}
                className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-gray-700 border border-gray-600 px-4 py-3 rounded-lg shadow-sm transition hover:bg-gray-600"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded border border-gray-500"
                  />
                  <div>
                    <span className="font-semibold text-lg">{p.name}</span>
                    <div className="text-sm text-gray-300">
                      ₹{p.price} | Qty: {p.quantity}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Exp: {new Date(p.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-400 hover:text-red-600 transition mt-3 sm:mt-0 sm:ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ShopDashboard;
