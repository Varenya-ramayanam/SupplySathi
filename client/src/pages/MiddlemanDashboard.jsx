import React, { useEffect, useState } from "react";
import API from "../api";
import UserDashboard from "../components/UserDashBoard";
import ProductDashboard from "../components/ShopDashBoard";

const MiddlemanDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const todosRes = await API.get("/middleman/vendor-requests");
      const productsRes = await API.get("/middleman/available-products");
      setTodos(todosRes.data);
      setProducts(productsRes.data);
    })();
  }, []);

  const handleAddToMemo = async (vendorRequest, matchingProduct) => {
    try {
      const res = await API.post("/middleman/add-to-memo", {
        vendorId: vendorRequest.vendorId,
        productName: vendorRequest.productName,
        quantity: vendorRequest.quantity,
        shopProductId: matchingProduct._id,
      });

      // Update product quantity in product list
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

      // Update the vendor request status to 'delivered'
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t._id === vendorRequest._id ? { ...t, status: "delivered" } : t
        )
      );
    } catch (err) {
      console.error("Error adding to memo", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 text-white p-6 min-h-screen">
      <div className="bg-gray-800 rounded-xl p-4 shadow-md">
        <UserDashboard
          todos={todos}
          handleAddToMemo={handleAddToMemo}
          products={products}
        />
      </div>
      <div className="bg-gray-800 rounded-xl p-4 shadow-md">
        <ProductDashboard products={products} />
      </div>
    </div>
  );
};

export default MiddlemanDashboard;
