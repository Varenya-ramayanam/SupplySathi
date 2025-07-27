import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Plus, ClipboardList, Trash2, PackageX, LogOut } from "lucide-react";

const VendorDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newItem, setNewItem] = useState({ productName: "", quantity: 1 });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const loadTodos = async () => {
    try {
      const res = await API.get("/vendor/todo");
      setTodos(res.data.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load items.");
    }
  };

  const addTodo = async () => {
    if (!newItem.productName.trim()) {
      setError("Product name is required");
      return;
    }
    try {
      await API.post("/vendor/todo", newItem);
      setNewItem({ productName: "", quantity: 1 });
      loadTodos();
    } catch (err) {
      console.error(err);
      setError("Failed to add item.");
    }
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/vendor/todo/${id}`);
      loadTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAll = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all items?");
    if (confirmDelete) {
      try {
        await API.delete("/vendor/todo");
        setTodos([]);
      } catch (error) {
        console.error("Failed to delete all items:", error);
        alert("Something went wrong while deleting.");
      }
    }
  };

  const handleReceived = async (item) => {
    const confirm = window.confirm("Have you received this item?");
    if (!confirm) return;

    try {
      const deliveryRes = await API.get("/vendor/deliveries");
      const deliveries = deliveryRes.data.deliveries || [];

      const itemProductId = item.shopProductId?._id || item.shopProductId;
      const matchingDelivery = deliveries.find(
        (d) =>
          (d.productId?._id || d.productId) === itemProductId &&
          d.status === "started_to_deliver"
      );

      if (!matchingDelivery) {
        alert("No matching delivery found.");
        return;
      }

      await API.patch(`/vendor/delivery/${matchingDelivery._id}/reached`);

      const rating = prompt("Please rate the product (1-5 stars):");
      if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        alert("Invalid rating. Review not submitted.");
        return;
      }

      const comment = prompt("Any comments or suggestions?") || "";

      await API.post("/vendor/review", {
        productId: matchingDelivery.productId._id || matchingDelivery.productId,
        shopId: matchingDelivery.shopId,
        rating: Number(rating),
        comment,
        productQuality: "good",
      });

      alert("Review submitted successfully.");
      loadTodos();
    } catch (err) {
      console.error("Error confirming delivery:", err);
      alert("Failed to confirm delivery");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 shadow-lg rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-2 text-white">
            <ClipboardList className="w-7 h-7" /> Vendor Dashboard
          </h2>
          <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
            {todos.length > 0 && (
              <button
                onClick={deleteAll}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Delete All
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Input Form */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Product Name"
            className="bg-gray-700 text-white border border-gray-600 focus:border-blue-400 rounded-lg px-4 py-2 w-full md:w-1/2"
            value={newItem.productName}
            onChange={(e) =>
              setNewItem({ ...newItem, productName: e.target.value })
            }
          />
          <input
            type="number"
            min={1}
            placeholder="Quantity"
            className="bg-gray-700 text-white border border-gray-600 focus:border-blue-400 rounded-lg px-4 py-2 w-full md:w-1/4"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
            }
          />
          <button
            onClick={addTodo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full md:w-auto transition"
          >
            <Plus className="w-5 h-5" /> Add Item
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {info && <div className="text-yellow-400 mt-2">{info}</div>}

        {/* Todo List */}
        {todos.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <PackageX className="w-10 h-10 mx-auto mb-2" />
            No items added yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-700 border border-gray-600 px-4 py-3 rounded-lg shadow-sm transition hover:bg-gray-600"
              >
                <div>
                  <span className="font-semibold text-lg">
                    {item.productName}
                  </span>
                  <div className="text-sm text-gray-300">
                    Qty: {item.quantity}
                  </div>
                  {item.status === "started_to_deliver" && !item.reviewGiven && (
                    <div className="mt-1 flex gap-2">
                      <button
                        className="text-sm text-green-400 underline"
                        onClick={() => handleReceived(item)}
                      >
                        Received
                      </button>
                      <button
                        className="text-sm text-red-400 underline"
                        onClick={() =>
                          alert(
                            "Marking as not received. Please contact middleman."
                          )
                        }
                      >
                        Not Received
                      </button>
                    </div>
                  )}
                  {item.reviewGiven && (
                    <div className="text-sm text-yellow-300 mt-1">
                      ✅ Received and Reviewed
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteItem(item._id)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
