import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const ReviewPage = () => {
  const { deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [productQuality, setProductQuality] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const res = await API.get(`/vendor/delivery/${deliveryId}`);
        setDelivery(res.data.delivery);
        setMessage("");
      } catch (err) {
        setMessage('❌ Failed to load delivery details.');
        console.error("Error fetching delivery:", err);
      }
    };
    if (deliveryId) fetchDelivery();
  }, [deliveryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || comment.trim().length < 10 || !productQuality) {
      setMessage('⭐ Please provide a rating, product quality assessment, and at least 10 characters in the comment.');
      return;
    }

    try {
      // Submit review to vendor review endpoint
      await API.post('/vendor/review', {
        productId: delivery?.productId,
        rating,
        comment,
        productQuality,
      });

      // Update delivery status to 'reached'
      await API.patch(`/vendor/delivery/${deliveryId}`, { status: 'reached' });

      setMessage('✅ Review submitted and delivery marked as reached!');
      setRating(0);
      setComment("");
      setProductQuality("");

      setTimeout(() => navigate('/vendor'), 1500);
    } catch (err) {
      console.error("Error submitting review:", err);
      setMessage('❌ Failed to submit review or update delivery status.');
    }
  };

  if (!delivery) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        {message ? <p className="text-red-500 mb-4">{message}</p> : 'Loading delivery details...'}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Submit a Review for Delivery</h2>

      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Product Quality Assessment:</label>
        <select
          value={productQuality}
          onChange={(e) => setProductQuality(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required
        >
          <option value="">Select Quality</option>
          <option value="excellent">Excellent - Perfect condition</option>
          <option value="good">Good - Minor issues</option>
          <option value="fair">Fair - Some issues</option>
          <option value="poor">Poor - Significant problems</option>
        </select>

        <label className="block mb-2 font-medium">Rating (1-5):</label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
          className="border rounded w-full p-2 mb-4"
          required
        >
          <option value="">Select Rating</option>
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val} Star{val > 1 ? 's' : ''}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Detailed Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please provide detailed feedback about the delivery, product quality, and overall experience..."
          className="border rounded w-full p-2 mb-4"
          rows={4}
          required
          minLength={10}
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewPage;
