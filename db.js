const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://shubhjain0884:Apply8083@cluster0.oyaovso.mongodb.net/ecommerce?retryWrites=true&w=majority';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log('Connected to MongoDB');

    const food_items = mongoose.connection.db.collection("food_items");
    const itemData = await food_items.find({}).toArray();
    const foodCategory = mongoose.connection.db.collection("foodCategory");
    const categoryData = await foodCategory.find({}).toArray();

    // console.log(fetched_data);
global.food_items =itemData;
global.foodCategory=categoryData;

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = mongoDB;
