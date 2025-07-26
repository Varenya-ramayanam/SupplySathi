import React, { useEffect, useState } from 'react';
import API from '../api';

const VendorDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newItem, setNewItem] = useState({ productName: '', quantity: 1 });

  const loadTodos = async () => {
    const res = await API.get('/vendor/todo');
    setTodos(res.data.items || []);
  };

  const addTodo = async () => {
    if (!newItem.productName.trim()) return alert("Product name is required");
    await API.post('/vendor/todo', newItem);
    setNewItem({ productName: '', quantity: 1 });
    loadTodos();
  };

  useEffect(() => { loadTodos(); }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Vendor Dashboard</h2>
        
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            className="border rounded px-3 py-2 w-full md:w-1/2"
            placeholder="Product Name"
            value={newItem.productName}
            onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
          />
          <input
            type="number"
            min={1}
            className="border rounded px-3 py-2 w-full md:w-1/4"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            Add Item
          </button>
        </div>

        <ul className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center">No items added yet.</p>
          ) : (
            todos.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center bg-gray-50 border px-4 py-2 rounded">
                <span className="font-medium">{item.productName}</span>
                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default VendorDashboard;
