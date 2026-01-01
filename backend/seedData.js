// Sample Data for Products, Users, and Orders
// Use this to populate your MongoDB database

export const productData = [
  {
    name: "Men's Premium Cotton T-Shirt",
    price: 29.99,
    description:
      "Comfortable and breathable cotton t-shirt, perfect for everyday wear",
    images: [
      "https://via.placeholder.com/500?text=mens-tshirt-1",
      "https://via.placeholder.com/500?text=mens-tshirt-2",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Women's Casual Jeans",
    price: 49.99,
    description: "Stylish and comfortable women's denim jeans with perfect fit",
    images: [
      "https://via.placeholder.com/500?text=womens-jeans-1",
      "https://via.placeholder.com/500?text=womens-jeans-2",
    ],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Kids' Colorful Summer Dress",
    price: 24.99,
    description:
      "Bright and cheerful dress for kids, perfect for summer outings",
    images: [
      "https://via.placeholder.com/500?text=kids-dress-1",
      "https://via.placeholder.com/500?text=kids-dress-2",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    bestseller: false,
    date: Date.now(),
  },
  {
    name: "Men's Casual Shirt",
    price: 39.99,
    description:
      "Smart casual shirt for men, versatile for office or casual wear",
    images: [
      "https://via.placeholder.com/500?text=mens-shirt-1",
      "https://via.placeholder.com/500?text=mens-shirt-2",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Women's Winter Jacket",
    price: 89.99,
    description: "Warm and stylish winter jacket with premium insulation",
    images: [
      "https://via.placeholder.com/500?text=womens-jacket-1",
      "https://via.placeholder.com/500?text=womens-jacket-2",
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Kids' Sports Shoes",
    price: 54.99,
    description:
      "Comfortable and durable sports shoes designed for active kids",
    images: [
      "https://via.placeholder.com/500?text=kids-shoes-1",
      "https://via.placeholder.com/500?text=kids-shoes-2",
    ],
    category: "Kids",
    subCategory: "Footwear",
    sizes: ["25", "26", "27", "28", "29", "30"],
    bestseller: false,
    date: Date.now(),
  },
  {
    name: "Men's Slim Fit Trousers",
    price: 59.99,
    description:
      "Classic slim fit trousers for men, perfect for formal or casual occasions",
    images: [
      "https://via.placeholder.com/500?text=mens-trousers-1",
      "https://via.placeholder.com/500?text=mens-trousers-2",
    ],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["28", "30", "32", "34", "36"],
    bestseller: false,
    date: Date.now(),
  },
  {
    name: "Women's Designer Handbag",
    price: 129.99,
    description:
      "Premium leather handbag with elegant design and multiple compartments",
    images: [
      "https://via.placeholder.com/500?text=womens-bag-1",
      "https://via.placeholder.com/500?text=womens-bag-2",
    ],
    category: "Women",
    subCategory: "Accessories",
    sizes: ["One Size"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Kids' Printed T-Shirt",
    price: 19.99,
    description:
      "Fun and colorful printed t-shirt for kids, made from soft cotton",
    images: [
      "https://via.placeholder.com/500?text=kids-tshirt-1",
      "https://via.placeholder.com/500?text=kids-tshirt-2",
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Men's Leather Belt",
    price: 34.99,
    description:
      "Classic leather belt for men, goes with any formal or casual outfit",
    images: [
      "https://via.placeholder.com/500?text=mens-belt-1",
      "https://via.placeholder.com/500?text=mens-belt-2",
    ],
    category: "Men",
    subCategory: "Accessories",
    sizes: ["One Size"],
    bestseller: false,
    date: Date.now(),
  },
];

export const userData = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/laSi", // bcrypt hash of "password123"
    cartData: {
      product1: 2,
      product2: 1,
    },
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/laSi", // bcrypt hash of "password123"
    cartData: {
      product3: 1,
    },
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/laSi", // bcrypt hash of "password123"
    cartData: {},
  },
  {
    name: "Sarah Williams",
    email: "sarah@example.com",
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/laSi", // bcrypt hash of "password123"
    cartData: {
      product4: 3,
      product5: 1,
    },
  },
  {
    name: "Admin User",
    email: "admin@forever.com",
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/laSi", // bcrypt hash of "password123"
    cartData: {},
  },
];

export const orderData = [
  {
    userId: "user1_id_here",
    items: [
      { productId: "product1_id", quantity: 2, price: 29.99 },
      { productId: "product2_id", quantity: 1, price: 49.99 },
    ],
    amount: 109.97,
    address: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipcode: "10001",
      country: "USA",
      phone: "555-0123",
    },
    status: "Order Placed",
    paymentMethod: "Card",
    payment: true,
    date: new Date(),
  },
  {
    userId: "user2_id_here",
    items: [{ productId: "product3_id", quantity: 1, price: 24.99 }],
    amount: 24.99,
    address: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipcode: "90001",
      country: "USA",
      phone: "555-0456",
    },
    status: "Processing",
    paymentMethod: "Card",
    payment: true,
    date: new Date(),
  },
  {
    userId: "user3_id_here",
    items: [{ productId: "product4_id", quantity: 1, price: 39.99 }],
    amount: 39.99,
    address: {
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike@example.com",
      street: "789 Pine Road",
      city: "Chicago",
      state: "IL",
      zipcode: "60601",
      country: "USA",
      phone: "555-0789",
    },
    status: "Shipped",
    paymentMethod: "Card",
    payment: true,
    date: new Date(),
  },
];

// Passwords used in userData (for reference):
// email: john@example.com, password: password123
// email: jane@example.com, password: password123
// email: mike@example.com, password: password123
// email: sarah@example.com, password: password123
// email: admin@forever.com, password: password123
