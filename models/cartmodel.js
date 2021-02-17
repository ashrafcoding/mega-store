const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  name: String,
  price: String,
  img: String,
  amount: {
    type: Number,
    default: 1,
  },
  userId: String,
  productId: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const CartItem = mongoose.model("cart", cartSchema);

exports.getItemsByUser = async function (userId) {
  try {
    const items = await CartItem.find(
      { userId: userId },
      {},
      { sort: { date: 1 } }
    );

    return items;
  } catch (err) {
    console.log(err);
  }
};

exports.getItemsByproductId = async function (productId) {
  try {
    const item = await CartItem.find({ productId });

    return item;
  } catch (err) {
    console.log(err);
  }
};

exports.addNewItem = async function (data) {
  try {
    let item = await new CartItem(data);
    return item.save();
  } catch (err) {
    console.log(err);
  }
};

exports.deleteItem = async function (id) {
  try {
    await CartItem.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
};

exports.updateItem = async function (id, newData) {
  try {
    await CartItem.updateOne({ _id: id }, newData);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteManyItems = async (id)=>{
  await CartItem.deleteMany({userId:id})
  
}
