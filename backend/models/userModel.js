import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },

    // Professional Profile Fields
    jobTitle: { type: String, default: "" },
    company: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },

    // Contact Information
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    deliveryStreet: { type: String, default: "" },
    deliveryCity: { type: String, default: "" },
    deliveryState: { type: String, default: "" },
    deliveryZipcode: { type: String, default: "" },
    deliveryCountry: { type: String, default: "" },
    deliveryAltLabel: { type: String, default: "" },
    deliveryAltStreet: { type: String, default: "" },
    deliveryAltCity: { type: String, default: "" },
    deliveryAltState: { type: String, default: "" },
    deliveryAltZipcode: { type: String, default: "" },
    deliveryAltCountry: { type: String, default: "" },
    website: { type: String, default: "" },

    // Professional Links
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    twitter: { type: String, default: "" },

    // Profile Stats
    totalOrders: { type: Number, default: 0 },
    accountVerified: { type: Boolean, default: false },
    verificationDate: { type: Date, default: null },
    lastUpdated: { type: Date, default: Date.now },

    // Password Reset
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },

    // Cart Data
    cartData: { type: Object, default: {} },

    // Wishlist & Comparison
    wishlist: { type: [String], default: [] },
    compareList: { type: [String], default: [] },
  },
  { minimize: false, timestamps: true },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
