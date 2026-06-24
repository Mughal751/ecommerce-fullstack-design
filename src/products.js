export const allProducts = [
  // Phones
  { id: "6a31ab5187619a9f467faae2", _id: "6a31ab5187619a9f467faae2", name: "iPhone 15 Pro", price: 999.99, oldPrice: 1199.99, category: "Phones", rating: 5, stock: 20, badge: "New", description: "Apple iPhone 15 Pro with A17 Pro chip, titanium design, 48MP camera system, and USB-C connectivity.", image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faae3", _id: "6a31ab5187619a9f467faae3", name: "Samsung Galaxy S24", price: 849.99, oldPrice: 999.99, category: "Phones", rating: 4, stock: 18, badge: "Hot", description: "Samsung Galaxy S24 with Snapdragon 8 Gen 3, 200MP camera, and AI-powered features.", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faae4", _id: "6a31ab5187619a9f467faae4", name: "Google Pixel 8", price: 699.99, oldPrice: 799.99, category: "Phones", rating: 4, stock: 14, badge: "", description: "Google Pixel 8 with Tensor G3 chip, best-in-class computational photography and 7 years of updates.", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop" },

  // Laptops
  { id: "6a31ab5187619a9f467faae5", _id: "6a31ab5187619a9f467faae5", name: "MacBook Pro 16\"", price: 2499.99, oldPrice: 2999.99, category: "Laptops", rating: 5, stock: 8, badge: "New", description: "Apple MacBook Pro 16-inch with M3 Max chip, 18-hour battery, Liquid Retina XDR display.", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faae6", _id: "6a31ab5187619a9f467faae6", name: "Dell XPS 15", price: 1799.99, oldPrice: 2099.99, category: "Laptops", rating: 4, stock: 12, badge: "", description: "Dell XPS 15 with Intel Core i9, 32GB RAM, NVIDIA RTX 4070, stunning OLED display.", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faae7", _id: "6a31ab5187619a9f467faae7", name: "ASUS ROG Zephyrus", price: 1599.99, oldPrice: 1899.99, category: "Laptops", rating: 4, stock: 6, badge: "Gaming", description: "ASUS ROG Zephyrus G14 gaming laptop with AMD Ryzen 9, RTX 4060, and 165Hz display.", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop" },

  // Tablets
  { id: "6a31ab5187619a9f467faae8", _id: "6a31ab5187619a9f467faae8", name: "iPad Pro 12.9\"", price: 1099.99, oldPrice: 1299.99, category: "Tablets", rating: 5, stock: 10, badge: "New", description: "Apple iPad Pro with M2 chip, Liquid Retina XDR display, and Thunderbolt connectivity.", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faae9", _id: "6a31ab5187619a9f467faae9", name: "Samsung Galaxy Tab S9", price: 799.99, oldPrice: 949.99, category: "Tablets", rating: 4, stock: 9, badge: "", description: "Samsung Galaxy Tab S9 Ultra with 14.6-inch Dynamic AMOLED, S Pen included.", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop" },

  // Cameras
  { id: "6a31ab5187619a9f467faaea", _id: "6a31ab5187619a9f467faaea", name: "Sony A7R V", price: 3499.99, oldPrice: 3999.99, category: "Cameras", rating: 5, stock: 5, badge: "Pro", description: "Sony Alpha 7R V with 61MP full-frame sensor, AI-powered autofocus, and 8K video.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faaeb", _id: "6a31ab5187619a9f467faaeb", name: "Canon EOS R5", price: 2999.99, oldPrice: 3499.99, category: "Cameras", rating: 5, stock: 4, badge: "Pro", description: "Canon EOS R5 with 45MP full-frame sensor, 8K RAW video, and Dual Pixel CMOS AF.", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop" },

  // Watches
  { id: "6a31ab5187619a9f467faaec", _id: "6a31ab5187619a9f467faaec", name: "Apple Watch Ultra 2", price: 799.99, oldPrice: 999.99, category: "Watches", rating: 5, stock: 11, badge: "New", description: "Apple Watch Ultra 2 with titanium case, precision dual-frequency GPS, and 60-hour battery.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faaed", _id: "6a31ab5187619a9f467faaed", name: "Samsung Galaxy Watch 6", price: 349.99, oldPrice: 429.99, category: "Watches", rating: 4, stock: 16, badge: "", description: "Samsung Galaxy Watch 6 Classic with rotating bezel, advanced health sensors, and sleep coaching.", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop" },

  // Headphones
  { id: "6a31ab5187619a9f467faaee", _id: "6a31ab5187619a9f467faaee", name: "Sony WH-1000XM5", price: 349.99, oldPrice: 449.99, category: "Headphones", rating: 5, stock: 25, badge: "Best Seller", description: "Sony WH-1000XM5 with industry-leading noise cancellation, 30-hour battery, and Multipoint connection.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faaef", _id: "6a31ab5187619a9f467faaef", name: "Apple AirPods Pro 2", price: 249.99, oldPrice: 299.99, category: "Headphones", rating: 5, stock: 30, badge: "", description: "Apple AirPods Pro 2nd gen with Adaptive Audio, Personalized Spatial Audio, and USB-C charging.", image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop" },

  // Drones
  { id: "6a31ab5187619a9f467faaf0", _id: "6a31ab5187619a9f467faaf0", name: "DJI Mini 4 Pro", price: 759.99, oldPrice: 899.99, category: "Drones", rating: 5, stock: 7, badge: "New", description: "DJI Mini 4 Pro with 4K/60fps video, omnidirectional obstacle sensing, and 34-minute flight time.", image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop" },

  // Accessories
  { id: "6a31ab5187619a9f467faaf1", _id: "6a31ab5187619a9f467faaf1", name: "Logitech MX Master 3S", price: 99.99, oldPrice: 119.99, category: "Accessories", rating: 5, stock: 35, badge: "Best Seller", description: "Logitech MX Master 3S wireless mouse with 8K DPI sensor, MagSpeed scroll wheel, and USB-C charging.", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faaf2", _id: "6a31ab5187619a9f467faaf2", name: "Anker 140W Charger", price: 49.99, oldPrice: 69.99, category: "Accessories", rating: 4, stock: 50, badge: "", description: "Anker 140W USB-C GaN charger — charges MacBook Pro, iPad, and phone simultaneously.", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop" },

  // Home Electronics
  { id: "6a31ab5187619a9f467faaf3", _id: "6a31ab5187619a9f467faaf3", name: "LG C3 OLED 65\"", price: 1799.99, oldPrice: 2299.99, category: "Home Electronics", rating: 5, stock: 6, badge: "Hot", description: "LG C3 OLED evo 65-inch TV with α9 AI Processor Gen6, Dolby Vision IQ, and NVIDIA G-Sync.", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faaf4", _id: "6a31ab5187619a9f467faaf4", name: "Sonos Era 300", price: 449.99, oldPrice: 549.99, category: "Home Electronics", rating: 4, stock: 9, badge: "", description: "Sonos Era 300 spatial audio speaker with Dolby Atmos, six-driver design, and room-filling sound.", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faaf5", _id: "6a31ab5187619a9f467faaf5", name: "Google Nest Hub Max", price: 229.99, oldPrice: 299.99, category: "Home Electronics", rating: 4, stock: 14, badge: "", description: "Google Nest Hub Max smart display with 10-inch screen, built-in camera, Google Assistant, and Nest Cam.", image: "https://images.unsplash.com/photo-1512446816042-444d641267d4?w=400&h=400&fit=crop" },

  // Beauty Tech
  { id: "6a31ab5187619a9f467faaf6", _id: "6a31ab5187619a9f467faaf6", name: "Dyson Supersonic Hair Dryer", price: 429.99, oldPrice: 499.99, category: "Beauty Tech", rating: 5, stock: 18, badge: "Best Seller", description: "Dyson Supersonic hair dryer with intelligent heat control, 3 speed settings, 4 heat settings, and magnetic attachments.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faaf7", _id: "6a31ab5187619a9f467faaf7", name: "Dyson Airwrap Complete", price: 599.99, oldPrice: 699.99, category: "Beauty Tech", rating: 5, stock: 10, badge: "Hot", description: "Dyson Airwrap Complete multi-styler with Coanda airflow technology — curls, waves, smooths and dries simultaneously.", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faaf8", _id: "6a31ab5187619a9f467faaf8", name: "Braun IPL Silk Expert Pro 5", price: 349.99, oldPrice: 449.99, category: "Beauty Tech", rating: 4, stock: 14, badge: "New", description: "Braun IPL Silk Expert Pro 5 with SensoAdapt skin tone sensor, 400,000 flashes, and permanent visible hair removal.", image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop" },
  { id: "6a31ab5187619a9f467faaf9", _id: "6a31ab5187619a9f467faaf9", name: "Theragun Pro 5th Gen", price: 399.99, oldPrice: 499.99, category: "Beauty Tech", rating: 5, stock: 15, badge: "", description: "Theragun Pro 5th gen percussion therapy device with 16mm amplitude, OLED screen, 5 built-in speeds, and 150-min battery.", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop" },
  // { id: "6a31ab5187619a9f467faafa", _id: "6a31ab5187619a9f467faafa", name: "Oral-B iO Series 9", price: 199.99, oldPrice: 269.99, category: "Beauty Tech", rating: 5, stock: 25, badge: "", description: "Oral-B iO Series 9 with AI-powered pressure sensor, 7 cleaning modes, smart display, and 3-week battery life.", image: "https://images.unsplash.com/photo-1559590741-b789a68d9cb0?w=400&h=400&fit=crop" },
];

export const dealProducts = [
  { id: "6a31ab5187619a9f467faae5", discount: 17 },
  { id: "6a31ab5187619a9f467faaee", discount: 22 },
  { id: "6a31ab5187619a9f467faae8", discount: 15 },
  { id: "6a31ab5187619a9f467faaf7", discount: 14 },
  { id: "6a31ab5187619a9f467faaf3", discount: 22 },
  { id: "6a31ab5187619a9f467faae2", discount: 17 },
  { id: "6a31ab5187619a9f467faaf0", discount: 16 },
  { id: "6a31ab5187619a9f467faaf6", discount: 26 },
];

export const categories = [
  { name: 'All',              icon: 'ti-layout-grid'    },
  { name: 'Phones',           icon: 'ti-device-mobile'  },
  { name: 'Laptops',          icon: 'ti-device-laptop'  },
  { name: 'Tablets',          icon: 'ti-device-tablet'  },
  { name: 'Cameras',          icon: 'ti-camera'         },
  { name: 'Watches',          icon: 'ti-clock'          },
  { name: 'Headphones',       icon: 'ti-headphones'     },
  { name: 'Drones',           icon: 'ti-drone'          },
  { name: 'Accessories',      icon: 'ti-plug'           },
  { name: 'Home Electronics', icon: 'ti-home'           },
  { name: 'Beauty Tech',      icon: 'ti-sparkles'       },
];