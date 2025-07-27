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

  const handleAccept = async () => {
    const qty = parseInt(acceptQty);
    if (!qty || qty <= 0 || qty > selectedProduct.quantity) return;

    try {
      const res = await API.patch(`/products/accept/${selectedProduct._id}`, {
        acceptedQuantity: qty,
      });

      const updated = res.data;

      if (updated.quantity === 0) {
        setProducts((prev) =>
          prev.filter((p) => p._id !== selectedProduct._id)
        );
      } else {
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
      }

      setSelectedProduct(null);
      setAcceptQty("");
    } catch (err) {
      console.error("Error accepting product:", err);
    }
  };

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
              <button
                onClick={() => {
                  setSelectedProduct(p);
                  setAcceptQty("");
                }}
                className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50 p-4">
          <Dialog.Panel className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Accept Product: {selectedProduct?.name}
            </Dialog.Title>
            <input
              type="number"
              min={1}
              max={selectedProduct?.quantity}
              value={acceptQty}
              onChange={(e) => setAcceptQty(e.target.value)}
              placeholder={`Max: ${selectedProduct?.quantity}`}
              className="w-full px-4 py-2 mb-4 rounded-md bg-gray-700 text-white border border-gray-600"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Confirm Accept
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
};

export default ProductDashboard;
