const User = require("../models/authmodel");
const Orders = require("../models/ordermodel");
const validator = require("validator")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const ProductsModel = require("../models/ProductsModel");

const validation = (data) => {
  let errors = {}
  if (
    data.firstName.length < 3 ||
    data.secondName.length < 3 ||
    data.address.length < 3 ||
    validator.isEmail(data.email) == false||
    data.city.length < 3 ||
    data.phone.length < 5
  ) {
    errors = { message: "please enter a valid data" };
    return errors;
  }
  
};



exports.getUsers = (req, res) => {
  let orders = Orders.getOrdersByUser(req.session.user._id).then((orders) => {
    res.render("users", { orders });
  });
};

exports.getAdmin = (req, res) => {
  let orders = Orders.getOrdersByUser(req.session.user._id).then((orders) => {
    res.render("admin", { orders });
  });
};

exports.postUserUpdate = async (req, res) => {
  let errors = validation(req.body)
  if (errors) {
    let orders = Orders.getOrdersByUser(req.session.user._id).then((orders) => {
      res.render("users", { orders, errors });
    });
  } else {
    const { firstName, secondName, address, city, phone } = req.body;
    
      await User.updateOne(
        { _id: req.session.user._id },
        { firstName, secondName, address, city, phone },
        
        
      );
      console.log(req.body)
      res.redirect("/");
     
  }
};


exports.postChangePassword = async(req,res)=>{
  let errors = {}
  if (req.body.newPassword != req.body.confirmPassword) {
    errors = {message: "password does not match"}
    let orders = Orders.getOrdersByUser(req.session.user._id).then((orders) => {
      res.render("users", { orders, errors });
    });
  }else if(await bcrypt.compare(req.body.oldPassword, req.session.user.password)){
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(req.body.newPassword, salt);
    await User.updateOne(
      {_id: req.session.user._id},
      {password}
    )
    
      res.status(201).redirect('/')
  }
}

exports.postAdd = async (req, res, next)=>{
  try{
    const {name, price, description, category} = req.body
    const {img} = req.file.filename
    ProductsModel.addProduct({name, price, description, category, img})
    res.redirect('/users/admin')
    
  }catch(err){next(err)}


}
