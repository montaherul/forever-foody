import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const VISIBLE = 3;

const ReviewsSlider = () => {
  const { backendUrl } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(VISIBLE);
  const trackRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/review/recent`);
        setReviews(res.data.reviews || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchReviews();
  }, [backendUrl]);

  // ✅ Auto slide
  useEffect(() => {
    if (reviews.length <= VISIBLE) return;

    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [reviews]);

  // ✅ Seamless infinite reset
  useEffect(() => {
    if (!trackRef.current || reviews.length <= VISIBLE) return;

    const total = reviews.length;

    if (index === total + VISIBLE) {
      setTimeout(() => {
        trackRef.current.style.transition = "none";
        setIndex(VISIBLE);
      }, 700);
    }
  }, [index, reviews]);

  // Re-enable animation after silent jump
  useEffect(() => {
    if (trackRef.current) {
      requestAnimationFrame(() => {
        trackRef.current.style.transition = "transform 0.7s ease-in-out";
      });
    }
  }, [index]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="h-32 bg-gradient-to-r from-green-100 to-emerald-50 dark:from-slate-700 dark:to-slate-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-gray-500 dark:text-slate-400">No reviews yet</p>
      </div>
    );
  }

  // 👇 clones for infinite effect
  const extended = [
    ...reviews.slice(-VISIBLE),
    ...reviews,
    ...reviews.slice(0, VISIBLE),
  ];

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex"
        style={{
          transform: `translateX(-${index * (100 / VISIBLE)}%)`,
        }}
      >
        {extended.map((review, idx) => {
          const ratingNumber = Number(review.rating) || 5;

          return (
            <div key={idx} className="w-1/3 flex-shrink-0 px-2">
              <div className="bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 rounded-lg border-2 border-green-100 dark:border-slate-600 p-4 hover:shadow-xl transition-shadow duration-300 h-48 flex flex-col">
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide mb-2">
                  ⭐ Review
                </p>

                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2 italic leading-snug line-clamp-3 flex-1">
                  &quot;{review.comment}&quot;
                </h3>

                <div className="space-y-2 mt-auto pt-3 border-t border-green-200 dark:border-slate-600">
                  <p className="text-xs text-gray-700 dark:text-slate-300 font-medium truncate">
                    {review.userName}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xs">
                      {"★".repeat(ratingNumber)}
                      {"☆".repeat(5 - ratingNumber)}
                    </span>
                    <span className="text-gray-500 dark:text-slate-400 text-xs">
                      ({ratingNumber}/5)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewsSlider;
