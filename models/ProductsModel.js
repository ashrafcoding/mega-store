const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  price: String,
  description: String,
  category: String,
  img: String,
});

const Product = mongoose.model("product", productSchema);

exports.getAllProducts = async function () {
  try {
    let products = Product.find();
    return products;
  } catch (err) {
    console.log(err);
  }
};

exports.getProductsById = async function (id) {
  try {
    let product = await Product.findById(id);
    return product;
  } catch (err) {
    console.log(err);
  }
};

exports.getProductsByCategory = async (category)=> {
  try {
    let products = await Product.find({category});
    return products;
  } catch (err) {
    console.log(err);
  }
}

exports.addProduct = async function({}){
  try{
    let product = await Product.create({})
    console.log("product created in database")

  }catch(err){console.log(err)}
}