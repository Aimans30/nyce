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
    name: "Silver Frost Bow",
    description: "Make a statement with this stunning silver frost bow. Perfect for any occasion, this bow is sure to turn heads.",
    price: 100,
    image: "https://i.imghippo.com/files/FHL3080vYQ.jpg",
    category: "Bow"
  },
  {
    name: "Classic Black Bow",
    description: "A classic black bow for any occasion. Perfect for adding a touch of elegance to your outfit.",
    price: 100,
    image: "https://i.imghippo.com/files/DsCo4135ZM.jpg",
    category: "Bow"
  },
  {
    name: "Peachy Dreams Bow",
    description: "Sweet as sunrise,our peach satin bow adds a soft silk touch to any hairstyle",
    price: 100,
    image: "https://i.imghippo.com/files/HKvz3078g.jpg",
    category: "Bow"
  },
  {
    name: "Twilight Romance Bow",
    description: "This satin statement piece in dreamy lilac adds the perfect touch of dusk inspired elegance to any look.",
    price: 100,
    image: "https://i.imghippo.com/files/JD2976t.jpg",
    category: "Bow"
  },
  {
    name: "Holy Trinity Combo",
    description: "Silk scrunchies in three dreamy neutrals for those effortlessly put together moments. Avalaible in Gold,Dusty Rose and Butter Cream",
    price: 150,
    image: "https://i.imghippo.com/files/bwzm4184d.jpg",
    category: "Scrunchie"
  },
  {
    name: "Champagne Dreams Scrunchie",
    description: "These golden scrunchies will give you quiet luxury for your haircare and your updo's new best friend",
    price: 50,
    image: "https://i.imghippo.com/files/xJu5479ZA.jpg",
    category: "Scrunchie"
  },
  {
    name: "Muave Mistress Scrunchie",
    description: "Best paired with light and soft coloured outfits",
    price: 50,
    image: "https://i.imghippo.com/files/ougX6028qyU.jpg",
    category: "Scrunchie"
  },
  {
    name: "Sage Green Scrunchie",
    description: "Perfect for both casual days and dressy moments",
    price: 50,
    image: "https://i.imghippo.com/files/bO3135ZVE.jpg",
    category: "Scrunchie"
  },
  {
    name: "Sunset Sorbet Bracelet",
    description: "With tones of purple,buttercream and hot pink, it makes it the perfect choice for something creative and quirky",
    price: 125,
    image: "https://i.imghippo.com/files/SVt2492EGc.jpg",
    category: "Bracelet"
  },
  {
    name: "Moonlight Aura and Noir Glow Bracelet",
    description: "Glows of moonlight and darkness of noir, elegantly designed for your special ocassions",
    price: 220,
    image: "https://i.imghippo.com/files/Ns1424QBI.jpg",
    category: "Bracelet"
  },
];

// Add a function to validate image URLs before seeding
const validateImageUrl = async (url) => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error(`Failed to validate image URL: ${url}`);
    return false;
  }
};

const seedDB = async () => {
  try {
    console.log('Validating image URLs...');
    for (const product of sampleProducts) {
      const isValid = await validateImageUrl(product.image);
      if (!isValid) {
        console.warn(`Invalid image URL for ${product.name}: ${product.image}`);
        // Set a fallback image URL if the original is invalid
        product.image = "https://via.placeholder.com/300x300?text=Product+Image";
      }
    }

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

// Function to add new products without deleting existing ones
const addNewProducts = async () => {
  try {
    console.log('Starting to add products...');
    
    // Get existing product names
    const existingProducts = await Product.find({}, 'name');
    const existingNames = new Set(existingProducts.map(p => p.name));
    
    // Filter out products that already exist
    const newProducts = sampleProducts.filter(product => !existingNames.has(product.name));
    
    if (newProducts.length === 0) {
      console.log('No new products to add.');
      mongoose.connection.close();
      return;
    }

    // Insert only new products
    const insertedProducts = await Product.insertMany(newProducts);
    console.log(`Successfully added ${insertedProducts.length} new products`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding products:', error);
    mongoose.connection.close();
  }
};

// Run the function
addNewProducts(); 