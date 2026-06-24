const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const Product  = require('./models/Product');

dotenv.config();

const products = [
  // Phones
  { name: "iPhone 15 Pro", price: 999.99, oldPrice: 1199.99, category: "Phones", rating: 5, stock: 20, badge: "New", isFeatured: true, isDeal: true, description: "Apple iPhone 15 Pro with A17 Pro chip, titanium design, 48MP camera system.", image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop" },
  { name: "Samsung Galaxy S24", price: 849.99, oldPrice: 999.99, category: "Phones", rating: 4, stock: 18, badge: "Hot", isFeatured: true, isDeal: false, description: "Samsung Galaxy S24 with Snapdragon 8 Gen 3, 200MP camera, and AI features.", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop" },
  { name: "Google Pixel 8", price: 699.99, oldPrice: 799.99, category: "Phones", rating: 4, stock: 14, badge: "", isFeatured: false, isDeal: false, description: "Google Pixel 8 with Tensor G3 chip and best-in-class photography.", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop" },
  // Laptops
  { name: "MacBook Pro 16\"", price: 2499.99, oldPrice: 2999.99, category: "Laptops", rating: 5, stock: 8, badge: "New", isFeatured: true, isDeal: true, description: "Apple MacBook Pro 16-inch with M3 Max chip and 18-hour battery.", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop" },
  { name: "Dell XPS 15", price: 1799.99, oldPrice: 2099.99, category: "Laptops", rating: 4, stock: 12, badge: "", isFeatured: true, isDeal: false, description: "Dell XPS 15 with Intel Core i9, 32GB RAM, NVIDIA RTX 4070.", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop" },
  { name: "ASUS ROG Zephyrus", price: 1599.99, oldPrice: 1899.99, category: "Laptops", rating: 4, stock: 6, badge: "Gaming", isFeatured: false, isDeal: false, description: "ASUS ROG Zephyrus G14 gaming laptop with AMD Ryzen 9 and RTX 4060.", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop" },
  // Tablets
  { name: "iPad Pro 12.9\"", price: 1099.99, oldPrice: 1299.99, category: "Tablets", rating: 5, stock: 10, badge: "New", isFeatured: true, isDeal: true, description: "Apple iPad Pro with M2 chip and Liquid Retina XDR display.", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop" },
  { name: "Samsung Galaxy Tab S9", price: 799.99, oldPrice: 949.99, category: "Tablets", rating: 4, stock: 9, badge: "", isFeatured: false, isDeal: false, description: "Samsung Galaxy Tab S9 Ultra with 14.6-inch Dynamic AMOLED.", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop" },
  // Cameras
  { name: "Sony A7R V", price: 3499.99, oldPrice: 3999.99, category: "Cameras", rating: 5, stock: 5, badge: "Pro", isFeatured: false, isDeal: false, description: "Sony Alpha 7R V with 61MP sensor and AI-powered autofocus.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop" },
  { name: "Canon EOS R5", price: 2999.99, oldPrice: 3499.99, category: "Cameras", rating: 5, stock: 4, badge: "Pro", isFeatured: false, isDeal: false, description: "Canon EOS R5 with 45MP sensor and 8K RAW video.", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop" },
  // Watches
  { name: "Apple Watch Ultra 2", price: 799.99, oldPrice: 999.99, category: "Watches", rating: 5, stock: 11, badge: "New", isFeatured: true, isDeal: false, description: "Apple Watch Ultra 2 with titanium case and precision GPS.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
  { name: "Samsung Galaxy Watch 6", price: 349.99, oldPrice: 429.99, category: "Watches", rating: 4, stock: 16, badge: "", isFeatured: false, isDeal: false, description: "Samsung Galaxy Watch 6 Classic with rotating bezel.", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop" },
  // Headphones
  { name: "Sony WH-1000XM5", price: 349.99, oldPrice: 449.99, category: "Headphones", rating: 5, stock: 25, badge: "Best Seller", isFeatured: true, isDeal: true, description: "Sony WH-1000XM5 with industry-leading noise cancellation.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
  { name: "Apple AirPods Pro 2", price: 249.99, oldPrice: 299.99, category: "Headphones", rating: 5, stock: 30, badge: "", isFeatured: true, isDeal: false, description: "AirPods Pro 2nd gen with Adaptive Audio and USB-C.", image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop" },
  // Drones
  { name: "DJI Mini 4 Pro", price: 759.99, oldPrice: 899.99, category: "Drones", rating: 5, stock: 7, badge: "New", isFeatured: true, isDeal: true, description: "DJI Mini 4 Pro with 4K/60fps video and 34-min flight time.", image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop" },
  // Accessories
  { name: "Logitech MX Master 3S", price: 99.99, oldPrice: 119.99, category: "Accessories", rating: 5, stock: 35, badge: "Best Seller", isFeatured: false, isDeal: false, description: "Logitech MX Master 3S wireless mouse with 8K DPI sensor.", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop" },
  { name: "Anker 140W Charger", price: 49.99, oldPrice: 69.99, category: "Accessories", rating: 4, stock: 50, badge: "", isFeatured: false, isDeal: false, description: "Anker 140W USB-C GaN charger for all devices.", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop" },
  // Home Electronics
  { name: "LG C3 OLED 65\"", price: 1799.99, oldPrice: 2299.99, category: "Home Electronics", rating: 5, stock: 6, badge: "Hot", isFeatured: true, isDeal: true, description: "LG C3 OLED evo 65-inch TV with Dolby Vision IQ.", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop" },
  { name: "Sonos Era 300", price: 449.99, oldPrice: 549.99, category: "Home Electronics", rating: 4, stock: 9, badge: "", isFeatured: false, isDeal: false, description: "Sonos Era 300 spatial audio speaker with Dolby Atmos.", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop" },
  { name: "Google Nest Hub Max", price: 229.99, oldPrice: 299.99, category: "Home Electronics", rating: 4, stock: 14, badge: "", isFeatured: false, isDeal: false, description: "Google Nest Hub Max smart display with 10-inch screen.", image: "https://images.unsplash.com/photo-1512446816042-444d641267d4?w=400&h=400&fit=crop" },
  // Beauty Tech
  { name: "Dyson Supersonic Hair Dryer", price: 429.99, oldPrice: 499.99, category: "Beauty Tech", rating: 5, stock: 18, badge: "Best Seller", isFeatured: true, isDeal: true, description: "Dyson Supersonic hair dryer with intelligent heat control.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop" },
  { name: "Dyson Airwrap Complete", price: 599.99, oldPrice: 699.99, category: "Beauty Tech", rating: 5, stock: 10, badge: "Hot", isFeatured: true, isDeal: false, description: "Dyson Airwrap with Coanda airflow for curls and smooth styles.", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop" },
  { name: "Braun IPL Silk Expert Pro 5", price: 349.99, oldPrice: 449.99, category: "Beauty Tech", rating: 4, stock: 14, badge: "New", isFeatured: false, isDeal: false, description: "Braun IPL with SensoAdapt skin sensor for permanent hair removal.", image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop" },
  { name: "Theragun Pro 5th Gen", price: 399.99, oldPrice: 499.99, category: "Beauty Tech", rating: 5, stock: 15, badge: "", isFeatured: false, isDeal: false, description: "Theragun Pro percussion massager with OLED screen and 150-min battery.", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop" },
  { name: "Oral-B iO Series 9", price: 199.99, oldPrice: 269.99, category: "Beauty Tech", rating: 5, stock: 25, badge: "", isFeatured: false, isDeal: false, description: "Oral-B iO Series 9 electric toothbrush with AI pressure sensor.", image: "https://images.unsplash.com/photo-1559590741-b789a68d9cb0?w=400&h=400&fit=crop" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    await Product.deleteMany({});
    console.log('🗑️  Old products deleted');

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();