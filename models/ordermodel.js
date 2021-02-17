const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId:{
        type:String,
        required: true
    },
    cart:{
        type:[],
        required: true
    },
    name:{
        type:String,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    },
    orderPrice:{
        type:String,
        required:true
    },
    
    address:{
        type:String,
        required:true
    }
})

const Order = mongoose.model("order", orderSchema);


exports.addNewOrder = async function (data) {
  try {
    let item = await new Order (data);
    return item.save();
  } catch (err) {
    console.log(err);
  }
};

exports.getOrdersByUser = async function (userId) {
    try {
      let orders = await Order.find(
        {userId}
      );
  
      return orders;
    } catch (err) {
      console.log(err);
    }
  };
  

//module.exports.Order = mongoose.model("order", orderSchema);

