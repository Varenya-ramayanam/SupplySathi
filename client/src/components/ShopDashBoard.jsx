import React, { useState } from "react";
import { Dialog } from "@headlessui/react"; // Or use any modal library
import API from "../api";

const ProductDashboard = ({ products, setProducts }) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("none");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [acceptQty, setAcceptQty] = useState("");

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "price") return a.price - b.price;
      if (sortKey === "rating")
        return (b.averageRating || 0) - (a.averageRating || 0);
      return 0;
    });

  

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Available Products from Shops</h3>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
        />
        <select
          className="px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <option value="none">Sort By</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-400">No products available.</p>
      ) : (
        <ul className="space-y-3">
          {filteredProducts.map((p) => (
            <li
              key={p._id}
              className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-gray-700 border border-gray-600 px-4 py-3 rounded-lg"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={p.photoUrl}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                />
                <div>
                  <p className="font-semibold text-white text-lg">{p.name}</p>
                  <p className="text-sm text-gray-300">
                    ₹{p.price} | Qty: {p.quantity} | ⭐{" "}
                    {p.averageRating?.toFixed(1) || "N/A"}
                  </p>
                  <p className="text-sm text-gray-400">
                    From: {p.shopOwnerId?.shopName || p.shopOwnerId?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      
    </section>
  );
};

export default ProductDashboard;
 