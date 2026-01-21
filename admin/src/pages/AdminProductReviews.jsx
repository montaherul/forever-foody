import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const AdminProductReviews = () => {
  const { id } = useParams(); // productId

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/${id}`);
      setProduct(res.data.product || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/admin/reviews/product/${id}`,
        { headers: { token: adminToken } },
      );
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Delete this review permanently?")) return;

    try {
      await axios.delete(`${backendUrl}/api/admin/reviews/${reviewId}`, {
        headers: { token: adminToken },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading reviews...</div>;
  }

  return (
    <div className="p-6">
      <Link to="/admin/products" className="text-emerald-600 text-sm">
        ← Back to products
      </Link>

      {product && (
        <h1 className="text-2xl font-bold mt-3 mb-6">
          Reviews — {product.name}
        </h1>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r._id}
            className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-5 flex justify-between gap-4"
          >
            <div>
              <p className="font-semibold">{r.userName}</p>
              <p className="text-yellow-400 text-sm">
                {"★".repeat(r.rating)}
                <span className="text-gray-300">
                  {"★".repeat(5 - r.rating)}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {r.comment}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => deleteReview(r._id)}
              className="h-8 px-3 rounded bg-red-600 text-white text-xs hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-center text-gray-500">No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProductReviews;
