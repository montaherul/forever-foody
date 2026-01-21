import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center my-12 px-4">
      <div
        className="bg-gradient-to-r from-green-600 to-green-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 
                      text-white py-16 px-6 rounded-2xl shadow-2xl border border-green-500/30 dark:border-slate-700"
      >
        <p className="text-3xl md:text-4xl font-poppins font-bold">
          Get Fresh Deals Delivered!
        </p>

        <p className="text-green-100 dark:text-slate-400 mt-3 text-lg">
          Subscribe now & get 20% off your first order + exclusive weekly offers
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-8 
                     bg-white dark:bg-slate-900 border border-white/20 dark:border-slate-700 
                     rounded-2xl overflow-hidden shadow-lg"
        >
          <input
            className="w-full sm:flex-1 outline-none px-6 py-4 
                       text-gray-700 dark:text-slate-100 
                       bg-transparent placeholder-gray-400 dark:placeholder-slate-500"
            type="email"
            placeholder="Enter your email address"
            required
          />

          <button
            className="bg-orange-500 hover:bg-orange-600 
                       dark:bg-green-600 dark:hover:bg-green-700 
                       text-white font-bold text-sm px-8 py-4 transition-colors"
            type="submit"
          >
            SUBSCRIBE
          </button>
        </form>

        <p className="text-sm text-green-100 dark:text-slate-500 mt-2">
          ✅ No spam, just fresh deals and grocery tips!
        </p>
      </div>
    </div>
  );
};

export default NewsletterBox;
