import React, { useState } from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { assets } from "../assets/assets";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="text-center text-2xl sm:text-3xl pt-8 sm:pt-12 pb-4 border-t dark:border-slate-800">
        <Title text1="CONTACT" text2="US" />
        <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-2 max-w-xl mx-auto px-4">
          We'd love to hear from you. Our team is always ready to help.
        </p>
      </div>

      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* IMAGE */}
        <div className="relative w-full h-[240px] sm:h-[340px] md:h-[420px] lg:h-auto">
          <img
            className="w-full h-full object-cover rounded-2xl shadow-xl"
            src={assets.contact_img}
            alt="Contact us"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
        </div>

        {/* INFO CARDS */}
        <div className="flex flex-col gap-6">
          {/* STORE */}
          <div className="p-6 sm:p-8 rounded-2xl shadow-md border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700">
            <h3 className="font-bold text-xl sm:text-2xl text-green-900 dark:text-green-400 mb-3">
              Our Store
            </h3>
            <p className="text-gray-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <span className="font-semibold">Address:</span>
              <br />
              Chittagong, Bangladesh
            </p>
            <p className="text-gray-700 dark:text-slate-300 text-sm sm:text-base mt-3">
              <span className="font-semibold">Phone:</span> +880 1755-555555
              <br />
              <span className="font-semibold">Email:</span>{" "}
              islammontaherul@gmail.com
            </p>
          </div>

          {/* CAREER */}
          <div className="p-6 sm:p-8 rounded-2xl shadow-md border bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700">
            <h3 className="font-bold text-xl sm:text-2xl text-orange-900 dark:text-orange-400 mb-3">
              Join Our Team
            </h3>
            <p className="text-gray-700 dark:text-slate-300 text-sm sm:text-base mb-4">
              We are always looking for passionate people to join our growing
              team.
            </p>
            <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-7 py-3 rounded-full shadow hover:shadow-lg transition">
              Explore Careers
            </button>
          </div>

          {/* HOURS */}
          <div className="p-6 sm:p-8 rounded-2xl shadow-md border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700">
            <h3 className="font-bold text-xl sm:text-2xl text-blue-900 dark:text-blue-400 mb-3">
              Business Hours
            </h3>
            <div className="text-gray-700 dark:text-slate-300 text-sm sm:text-base space-y-1">
              <p>
                <span className="font-semibold">Mon – Fri:</span> 8:00 AM – 8:00
                PM
              </p>
              <p>
                <span className="font-semibold">Saturday:</span> 9:00 AM – 6:00
                PM
              </p>
              <p>
                <span className="font-semibold">Sunday:</span> 10:00 AM – 4:00
                PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-green-100 to-orange-100 dark:from-green-900/20 dark:to-orange-900/20 rounded-2xl p-6 sm:p-10 border dark:border-slate-700">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-green-900 dark:text-green-400 mb-6">
            Send Us a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="contact-input"
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="contact-input"
              required
            />
            <textarea
              placeholder="Your message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="contact-input h-32 resize-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg shadow hover:shadow-lg transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
