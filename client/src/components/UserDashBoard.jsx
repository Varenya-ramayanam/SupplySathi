import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = ({
  todos,
  handleAddToMemo,
  products,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredTodos = todos
    .filter(
      (req) =>
        req.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity
    );

  return (
    <section>
      {/* Header and Logout */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Vendor Requests</h3>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by vendor or product"
          className="w-full md:w-2/3 px-3 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 rounded-md bg-gray-700 text-white"
        >
          <option value="asc">Sort by Quantity: Low → High</option>
          <option value="desc">Sort by Quantity: High → Low</option>
        </select>
      </div>

      {/* Vendor List */}
      {filteredTodos.length === 0 ? (
        <p className="text-gray-400">No matching vendor requests.</p>
      ) : (
        <ul className="space-y-3">
          {filteredTodos.map((req) => {
            const matchingProduct = products.find(
              (p) => p.name.toLowerCase() === req.productName.toLowerCase()
            );

            return (
              <li
                key={req._id}
                className="flex justify-between items-start bg-gray-700 border border-gray-600 px-4 py-3 rounded-lg"
              >
                <div>
                  <p className="font-medium text-lg">{req.productName}</p>
                  <p className="text-sm text-gray-300">Vendor: {req.vendorName}</p>
                  <p className="text-sm text-gray-400">Qty needed: {req.quantity}</p>
                </div>

                <div className="mt-2 md:mt-0">
                  {req.status === "delivered" ? (
                    <span className="text-yellow-400 text-sm">✅ Delivered</span>
                  ) : (
                    <button
                      onClick={() => handleAddToMemo(req, matchingProduct)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
                    >
                      🚚 Deliver
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default UserDashboard;
