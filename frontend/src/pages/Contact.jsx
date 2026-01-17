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
    <div>
      <div className="text-center text-3xl pt-10 pb-6 border-t dark:border-slate-800">
        <Title text1={"CONTACT"} text2={"US"} />
        <p className="text-sm text-gray-600 dark:text-slate-300 mt-3">
          We'd love to hear from you!
        </p>
      </div>

      <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-12 mb-28">
        <div className="relative">
          <img
            className="w-full rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
            src={assets.contact_img}
            alt="Contact Us"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
        </div>

        <div className="flex flex-col justify-center gap-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-8 rounded-2xl shadow-lg border-2 border-green-200 dark:border-green-700">
            <p className="font-bold text-2xl text-green-900 dark:text-green-400 mb-4 flex items-center gap-2">
              Our Store
            </p>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
              <span className="font-semibold">Address:</span>
              <br />
              54709 Willms Station
              <br />
              Suite 350, Washington, USA
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">Phone:</span> (415) 555-0132
              <br />
              <span className="font-semibold">Email:</span>{" "}
              support@smartgrocery.com
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-8 rounded-2xl shadow-lg border-2 border-orange-200 dark:border-orange-700">
            <p className="font-bold text-2xl text-orange-900 dark:text-orange-400 mb-4 flex items-center gap-2">
              Join Our Team
            </p>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
              Want to be part of the fresh food revolution? We're always looking
              for passionate people to join our growing team!
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Explore Careers
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-700">
            <p className="font-bold text-2xl text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
              Business Hours
            </p>
            <div className="text-gray-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                <span className="font-semibold">Monday - Friday:</span> 8:00 AM
                - 8:00 PM
              </p>
              <p>
                <span className="font-semibold">Saturday:</span> 9:00 AM - 6:00
                PM
              </p>
              <p>
                <span className="font-semibold">Sunday:</span> 10:00 AM - 4:00
                PM
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-100 to-orange-100 dark:from-green-900/20 dark:to-orange-900/20 rounded-2xl p-10 mb-12 border dark:border-slate-700">
        <h3 className="text-3xl font-bold text-center text-green-900 dark:text-green-400 mb-8">
          Send Us a Message
        </h3>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none transition-colors h-32 resize-none"
              placeholder="How can we help you?"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Send Message
          </button>
        </form>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
