import React, { useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to home if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Sign Up") {
        // Firebase Sign Up
        const firebaseUser = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Get Firebase token
        const firebaseToken = await firebaseUser.user.getIdToken();

        // Register in backend
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Account created successfully!");
          setTimeout(() => navigate("/"), 1500); // Delay to allow profile to load
        } else {
          toast.error(response.data.message);
          // Delete Firebase user if backend registration fails
          await signOut(auth);
        }
      } else {
        // Firebase Sign In
        await signInWithEmailAndPassword(auth, email, password);

        // Login in backend
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Welcome back!");
          setTimeout(() => navigate("/"), 1500); // Delay to allow profile to load
        } else {
          toast.error(response.data.message);
          await signOut(auth);
        }
      }
    } catch (error) {
      console.log(error);
      let errorMessage = error.message;

      // Firebase error handling
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already registered. Please login instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      }

      toast.error(errorMessage);
      setLoading(false);
    }
  };

  // Google Sign In/Sign Up Handler
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Try to register/login with backend
      const response = await axios.post(backendUrl + "/api/user/register", {
        name: user.displayName || "Google User",
        email: user.email,
        password: user.uid, // Use Firebase UID as password
        profileImage: user.photoURL || "", // Add Google profile picture
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(`Welcome, ${user.displayName}!`);
        setTimeout(() => navigate("/"), 1500); // Delay to allow profile to load
      } else if (response.data.message.includes("already exists")) {
        // User already exists, just login
        const loginResponse = await axios.post(backendUrl + "/api/user/login", {
          email: user.email,
          password: user.uid,
        });

        if (loginResponse.data.success) {
          setToken(loginResponse.data.token);
          localStorage.setItem("token", loginResponse.data.token);
          toast.success(`Welcome back, ${user.displayName}!`);
          setTimeout(() => navigate("/"), 1500); // Delay to allow profile to load
        }
      } else {
        toast.error(response.data.message);
        await signOut(auth);
      }
    } catch (error) {
      console.log(error);
      let errorMessage = error.message;

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Google sign in cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Pop-up was blocked. Please allow popups and try again.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Google sign in is not enabled.";
      }

      toast.error(errorMessage);
    }
    setLoading(false);
  };

  // GitHub Sign In/Sign Up Handler
  const handleGitHubAuth = async () => {
    setLoading(true);
    try {
      const githubProvider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      // Try to register/login with backend
      const response = await axios.post(backendUrl + "/api/user/register", {
        name: user.displayName || "GitHub User",
        email: user.email || `${user.uid}@github.com`,
        password: user.uid, // Use Firebase UID as password
        profileImage: user.photoURL || "", // Add GitHub profile picture
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(`Welcome, ${user.displayName}!`);
        setTimeout(() => navigate("/"), 1500); // Delay to allow profile to load
      } else if (response.data.message.includes("already exists")) {
        // User already exists, just login
        const loginResponse = await axios.post(backendUrl + "/api/user/login", {
          email: user.email || `${user.uid}@github.com`,
          password: user.uid,
        });

        if (loginResponse.data.success) {
          setToken(loginResponse.data.token);
          localStorage.setItem("token", loginResponse.data.token);
          toast.success(`Welcome back, ${user.displayName}!`);
          setTimeout(() => navigate("/"), 1500); // Delay to allow profile to load
        }
      } else {
        toast.error(response.data.message);
        await signOut(auth);
      }
    } catch (error) {
      console.log(error);
      let errorMessage = error.message;

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "GitHub sign in cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Pop-up was blocked. Please allow popups and try again.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "GitHub sign in is not enabled.";
      }

      toast.error(errorMessage);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 border dark:border-slate-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-poppins text-gray-900 dark:text-slate-100 mb-2">
              {currentState === "Login" ? "Welcome Back" : "Join Smart Grocery"}
            </h1>
            <p className="text-gray-600 dark:text-slate-300 text-sm">
              {currentState === "Login"
                ? "Sign in to your account"
                : "Create your account to start shopping"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {/* Name Field - Sign Up Only */}
            {currentState === "Sign Up" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  Full Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900 transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                placeholder={
                  currentState === "Login"
                    ? "Enter your password"
                    : "Min 6 characters"
                }
                required
              />
            </div>

            {/* Forgot Password - Login Only */}
            {currentState === "Login" && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6 transform hover:scale-105 duration-200 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : currentState === "Login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>

            <button
              type="button"
              onClick={handleGitHubAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.184.092-.923.35-1.544.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.722c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.413 20 10c0-5.523-4.477-10-10-10z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with GitHub
            </button>
          </div>

          {/* Toggle Auth State */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              {currentState === "Login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setCurrentState(
                    currentState === "Login" ? "Sign Up" : "Login"
                  );
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className="text-green-600 hover:text-green-700 font-bold transition-colors"
              >
                {currentState === "Login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-gray-600 text-xs mt-6">
          By {currentState === "Login" ? "signing in" : "signing up"}, you agree
          to our{" "}
          <button type="button" className="text-green-600 hover:underline">
            Terms & Conditions
          </button>{" "}
          and{" "}
          <button type="button" className="text-green-600 hover:underline">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
