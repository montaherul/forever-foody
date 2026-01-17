import React from "react";

const Title = ({ text1, text2 }) => {
  // Destructure the props here
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-gray-600 dark:text-slate-300 font-poppins text-xl">
        {text1}{" "}
        <span className="text-green-700 dark:text-green-400 font-bold">
          {text2}
        </span>
      </p>
      <p className="w-8 sm:w-12 h-[2px] sm:h-[3px] bg-green-600 dark:bg-green-500 rounded-full"></p>
    </div>
  );
};

export default Title;
