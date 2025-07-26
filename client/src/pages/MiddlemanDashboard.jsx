import React, { useEffect, useState } from "react";
import API from "../api";

const MiddlemanDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [products, setProducts] = useState([]);

  const loadTodos = async () => {
    const res = await API.get("/middleman/vendor-requests");
    setTodos(res.data);
  };

  const loadProducts = async () => {
    const res = await API.get("/middleman/available-products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadTodos();
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-8">
        <h2 className="text-3xl font-bold text-center">Middleman Dashboard</h2>

        {/* Vendor Requirements */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Vendor Requirements</h3>
          {todos.length === 0 ? (
            <p className="text-gray-500">No vendor requests found.</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((req) => (
                <li
                  key={req._id}
                  className="flex justify-between items-center border px-4 py-2 rounded bg-gray-50"
                >
                  <div>
                    <span className="font-medium">{req.productName}</span>
                    <p className="text-sm text-gray-500">
                      Vendor: {req.vendorName}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600">
                    Qty: {req.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Shop Products */}
        <section>
          <h3 className="text-xl font-semibold mb-4">
            Available Products from Shops
          </h3>
          {products.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (
            <ul className="space-y-2">
              {products.map((p) => (
                <li
                  key={p._id}
                  className="flex flex-col md:flex-row md:justify-between items-start md:items-center border px-4 py-2 rounded bg-gray-50"
                >
                  <div>
                    <span className="font-medium">{p.name}</span>
                    <p className="text-sm text-gray-600">
                      ₹{p.price} | Qty: {p.quantity}
                    </p>
                  </div>
                  <span className="text-sm text-gray-700 mt-1 md:mt-0">
                    From: {p.shopOwnerId?.shopName || p.shopOwnerId?.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default MiddlemanDashboard;
