import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import API from "../api";

const MiddlemanDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveredProductIds, setDeliveredProductIds] = useState([]);
  const navigate = useNavigate();

  const loadTodos = async () => {
    try {
      const res = await API.get("/middleman/vendor-requests");
      setTodos(res.data);
    } catch (err) {
      console.error("Error loading vendor requests:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await API.get("/middleman/available-products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading shop products:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAddToMemo = async (vendorRequest, matchingProduct) => {
    try {
      const memoData = {
        vendorId: vendorRequest.vendorId,
        productName: vendorRequest.productName,
        quantity: vendorRequest.quantity,
        shopProductId: matchingProduct._id
      };

      const res = await API.post("/middleman/add-to-memo", memoData);

      // Update delivered product IDs
      setDeliveredProductIds((prev) => [...prev, matchingProduct._id]);

      // If quantity became 0, remove from list; else update product
      const updated = res.data.updatedProduct;
      if (!updated || updated.quantity <= 0) {
        setProducts((prev) =>
          prev.filter((p) => p._id !== matchingProduct._id)
        );
      } else {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === updated._id ? { ...p, quantity: updated.quantity } : p
          )
        );
      }

      alert("✅ Product added to vendor memo!");
    } catch (err) {
      console.error("❌ Failed to add to memo", err);
      alert("Error adding product to memo");
    }
  };

  useEffect(() => {
    loadTodos();
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-800 shadow-md rounded-xl p-6 space-y-8">
        {/* Logout Button */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center">Middleman Dashboard</h2>

        {/* Vendor Requirements */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Vendor Requirements</h3>
          {todos.length === 0 ? (
            <p className="text-gray-400">No vendor requests found.</p>
          ) : (
            <ul className="space-y-3">
              {todos.map((req) => {
                const matchingProduct = products.find(
                  (p) => p.name.toLowerCase() === req.productName.toLowerCase()
                );

                const isAlreadyDelivered = deliveredProductIds.includes(
                  matchingProduct?._id
                );

                return (
                  <li
                    key={req._id}
                    className="flex justify-between items-start bg-gray-700 border border-gray-600 px-4 py-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-lg">{req.productName}</p>
                      <p className="text-sm text-gray-300">
                        Vendor: {req.vendorName}
                      </p>
                      <p className="text-sm text-gray-400">
                        Qty: {req.quantity}
                      </p>
                    </div>

                    {matchingProduct ? (
                      isAlreadyDelivered ? (
                        <span className="mt-2 md:mt-0 text-yellow-400 text-sm">
                          🚚 Started to Deliver
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleAddToMemo(req, matchingProduct)
                          }
                          className="mt-2 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
                        >
                          ✅ Available
                        </button>
                      )
                    ) : (
                      <span className="text-red-400 mt-2 md:mt-0 text-sm">
                        ❌ Not Available
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Shop Products */}
        <section>
          <h3 className="text-xl font-semibold mb-4">
            Available Products from Shops
          </h3>
          {products.length === 0 ? (
            <p className="text-gray-400">No products available.</p>
          ) : (
            <ul className="space-y-3">
              {products.map((p) => (
                <li
                  key={p._id}
                  className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-gray-700 border border-gray-600 px-4 py-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-white text-lg">{p.name}</p>
                    <p className="text-sm text-gray-300">
                      ₹{p.price} | Qty: {p.quantity}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 md:mt-0">
                    From: {p.shopOwnerId?.shopName || p.shopOwnerId?.name || "Unknown"}
                  </p>
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
