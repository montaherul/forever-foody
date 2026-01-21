import { useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

const ForgotPassword = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState("request"); // request, reset
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if token is in URL
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setResetToken(tokenParam);
      setStep("reset");
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) {
        toast.error("Please enter your email");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/user/forgot-password",
        { email },
      );

      if (response.data.success) {
        toast.success("Reset link sent to your email!");
        // In production, user would click the link in their email
        // For development, show the reset token
        if (response.data.resetToken) {
          setResetToken(response.data.resetToken);
          setStep("reset");
          toast.info("Use the reset form below to set your new password");
        }
        setEmail("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error details:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        toast.error(
          "Password reset feature is not available. Please try again later.",
        );
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!newPassword || !confirmPassword) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/user/reset-password",
        {
          resetToken,
          newPassword,
        },
      );

      if (response.data.success) {
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error details:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        toast.error(
          "Password reset feature is not available. Please try again later.",
        );
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 border dark:border-slate-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-poppins text-gray-900 dark:text-slate-100 mb-2">
              {step === "request" ? "Forgot Password?" : "Reset Your Password"}
            </h1>
            <p className="text-gray-600 dark:text-slate-300 text-sm">
              {step === "request"
                ? "Enter your email to receive a password reset link"
                : "Enter your new password below"}
            </p>
          </div>

          {/* Form */}
          {step === "request" ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-slate-100"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition duration-300"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-slate-100"
                  required
                />
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-slate-100"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition duration-300"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              {/* Back Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("request");
                    setResetToken("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Go Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
