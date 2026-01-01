# E-Commerce Backend Setup Guide

## ✅ Files Created

I've created separate JSON files for your data in the `data/` folder:

1. **`data/admin.json`** - Admin credentials
2. **`data/users.json`** - Sample users for testing
3. **`data/products.json`** - 20 sample products

---

## 🔧 Setup Instructions

### Step 1: Configure Environment Variables

Your `.env` file has been updated with:

```env
PORT=4000
MONGO_URI=mongodb+srv://c233210_db_user:DnuIRy2KkJh4UELd@cluster0.gqjaqeg.mongodb.net/e-commerce
JWT_SECRET=forever_9xA!3@kP$2LmQz_2026

# Admin Credentials
ADMIN_EMAIL=admin@forever.com
ADMIN_PASSWORD=admin123

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

**⚠️ IMPORTANT:** You need to:

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Replace `your_cloudinary_name`, `your_cloudinary_api_key`, `your_cloudinary_secret_key` in `.env`

---

### Step 2: Install Dependencies

```bash
cd d:\design\show preject\forever-main\backend
npm install
```

### Step 3: Start the Backend Server

```bash
npm run server
```

The server will start at: **http://localhost:4000**

---

## 🔐 Login Credentials

### Admin Panel

- **Email:** `admin@forever.com`
- **Password:** `admin123`

### Test Users (for Frontend)

- john@example.com / password123
- jane@example.com / password123
- mike@example.com / password123
- sarah@example.com / password123
- david@example.com / password123

---

## 📝 How to Use

### 1. Test User Registration (Frontend)

```
POST http://localhost:4000/api/user/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Test User Login (Frontend)

```
POST http://localhost:4000/api/user/login
Body: {
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Admin Login (Admin Panel)

```
POST http://localhost:4000/api/user/admin
Body: {
  "email": "admin@forever.com",
  "password": "admin123"
}
```

### 4. Add Products (Admin Panel)

- Log in to admin panel
- Go to "Add Product"
- Upload images and fill details
- Click "Add Product"

### 5. List Products (Frontend/Admin)

```
GET http://localhost:4000/api/product/list
```

---

## 🚀 Running the Full Application

### Terminal 1 - Backend:

```bash
cd d:\design\show preject\forever-main\backend
npm run server
```

### Terminal 2 - Frontend:

```bash
cd d:\design\show preject\forever-main\frontend
npm run dev
```

### Terminal 3 - Admin:

```bash
cd d:\design\show preject\forever-main\admin
npm run dev
```

---

## ✅ Access Points

- **Backend API:** http://localhost:4000
- **Frontend:** http://localhost:5173
- **Admin Panel:** http://localhost:5174

---

## 🔍 Troubleshooting 404 Errors

If you're getting 404 errors:

1. ✅ Make sure backend is running on port 4000
2. ✅ Check MongoDB connection is successful
3. ✅ Verify `.env` file has all required variables
4. ✅ Install Cloudinary credentials (required for adding products)
5. ✅ Make sure you're using correct API endpoints

### Check if Backend is Running:

Visit: http://localhost:4000
You should see: "API working"

---

## 📦 Database Collections

Your MongoDB will have these collections:

- **users** - Customer accounts
- **products** - Product catalog
- **orders** - Customer orders
- **carts** - Shopping cart data

---

## 🎯 Next Steps

1. ✅ Configure Cloudinary credentials
2. ✅ Start all three servers (backend, frontend, admin)
3. ✅ Log in to admin panel
4. ✅ Add some products with real images
5. ✅ Test the frontend shopping experience

---

## ⚠️ Security Notes

- Never commit `.env` file to GitHub
- Change default passwords in production
- Use strong passwords for production
- Keep your MongoDB URI private
