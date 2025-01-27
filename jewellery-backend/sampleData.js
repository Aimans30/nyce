const mongoose = require('mongoose');
const Product = require('./models/Product');
const Review = require('./models/Review');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const sampleProducts = [
  {
    name: "Crystal Drop Earrings",
    description: "Elegant crystal drop earrings with sterling silver hooks",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1635767798638-3665c302e27c?auto=format&fit=crop&q=80",
    category: "Earrings"
  },
  {
    name: "Pearl Hair Clip Set",
    description: "Set of 3 beautiful pearl-embellished hair clips",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1589731379771-7aea43db4646?auto=format&fit=crop&q=80",
    category: "Hair Accessories"
  },
  {
    name: "Butterfly Hair Band",
    description: "Delicate butterfly design headband with crystals",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1625893165290-cc52b8ca54f9?auto=format&fit=crop&q=80",
    category: "Hair Accessories"
  },
  {
    name: "Pearl Necklace Set",
    description: "Classic pearl necklace with matching earrings",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80",
    category: "Sets"
  },
  {
    name: "Crystal Hair Pins",
    description: "Set of 6 crystal-embellished hair pins",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80",
    category: "Hair Accessories"
  },
  {
    name: "Floral Hair Scrunchies",
    description: "Pack of 3 floral print silk scrunchies",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80",
    category: "Hair Accessories"
  }
];

const seedDB = async () => {
  try {
    await Product.deleteMany({});
    await Review.deleteMany({});
    const products = await Product.insertMany(sampleProducts);
    const sampleReviews = [
      {
        productId: products[0]._id,
        userName: "Priya S.",
        rating: 5,
        comment: "The crystal drop earrings are absolutely gorgeous! They're lightweight and perfect for both casual and formal wear. Highly recommend!",
        createdAt: new Date()
      },
      {
        productId: products[1]._id,
        userName: "Sarah M.",
        rating: 5,
        comment: "Beautiful hair accessories! The pearl clips are absolutely stunning and perfect for special occasions. The quality is amazing and the designs are so elegant.",
        createdAt: new Date()
      },
      {
        productId: products[2]._id,
        userName: "Emily R.",
        rating: 5,
        comment: "Love my new butterfly hair band! It's exactly what I was looking for. The crystals catch the light beautifully and it's so comfortable to wear.",
        createdAt: new Date()
      },
      {
        productId: products[3]._id,
        userName: "Aisha R.",
        rating: 5,
        comment: "Ordered the pearl necklace set and I'm in love! The quality is exceptional and it came in such beautiful packaging. Perfect for my wedding!",
        createdAt: new Date()
      },
      {
        productId: products[4]._id,
        userName: "Mira P.",
        rating: 5,
        comment: "These hair pins are a game changer! The crystal details are so pretty and they hold my hair perfectly. Worth every penny!",
        createdAt: new Date()
      },
      {
        productId: products[5]._id,
        userName: "Jessica K.",
        rating: 4,
        comment: "Great customer service and fast shipping. The scrunchies are lovely and made with high-quality silk. Will definitely order more!",
        createdAt: new Date()
      }
    ];
    await Review.insertMany(sampleReviews);
    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDB(); 