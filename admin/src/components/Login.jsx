import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../config/adminConfig";
import { toast } from "react-toastify";
import { FiLock, FiMail } from "react-icons/fi";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl text-white font-bold">FF</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Forever Foody Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
          <form onSubmit={onSubmitHandler} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="admin@foreverfoody.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Restricted access · Admin only
          </p>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
