import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ReviewsSlider = () => {
  const { backendUrl } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/review/recent`);
        if (
          res.data.success &&
          res.data.reviews &&
          Array.isArray(res.data.reviews)
        ) {
          // Filter reviews to ensure they have required fields
          const validReviews = res.data.reviews.filter(
            (review) => review.comment && review.rating
          );
          setReviews(validReviews);
          console.log("Reviews loaded:", validReviews);
        } else {
          console.log("No reviews or invalid response:", res.data);
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [backendUrl]);

  // Auto-slide effect
  useEffect(() => {
    if (reviews.length === 0) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 5000); // Changed to 5 seconds for better readability

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [reviews.length]);

  // Handle manual navigation
  const goToSlide = (i) => {
    setIndex(i);
    // Reset timer when user clicks
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
  };

 if (loading) {
   return (
     <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 h-32 flex items-center justify-center">
       <p className="text-slate-400">Loading customer reviews...</p>
     </div>
   );
 }

 if (!reviews.length) {
   return (
     <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
       <p className="text-slate-400 text-center">
         No customer reviews yet. Be the first to review!
       </p>
     </div>
   );
 }


  const review = reviews[index];
  const ratingNumber = Number(review.rating) || 5;return (
    <div
      className="bg-gradient-to-br from-green-50 via-white to-green-50 
                  dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 
                  rounded-2xl p-8 shadow-2xl border border-green-100 dark:border-slate-700 
                  overflow-hidden backdrop-blur-xl"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Review Content */}
        <div className="flex-1">
          <p className="text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide mb-3">
            ⭐ Customer Stories
          </p>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-5 italic leading-relaxed">
            “{review.comment}”
          </h3>

          {/* Reviewer Info */}
          <div className="space-y-2">
            <p className="text-gray-800 dark:text-slate-200 font-semibold text-lg">
              {review.userName || "Anonymous Customer"}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">
                {"★".repeat(ratingNumber)}
                {"☆".repeat(5 - ratingNumber)}
              </span>
              <span className="text-gray-500 dark:text-slate-400 text-sm">
                ({ratingNumber}/5)
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 md:flex-col">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            {index + 1} / {reviews.length}
          </span>

          <div className="flex md:flex-col gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? "bg-green-500 h-3 w-8 md:w-3 md:h-8 shadow-lg shadow-green-500/30"
                    : "bg-gray-300 dark:bg-slate-600 h-2 w-6 md:w-2 md:h-6 hover:bg-gray-400 dark:hover:bg-slate-500"
                }`}
                title={`Review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-5 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          key={index}
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
          style={{ animation: "shrink 5s linear forwards" }}
        />
      </div>

      <style>{`
      @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
    `}</style>
    </div>
  );

};

export default ReviewsSlider;
