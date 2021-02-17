const { promiseImpl } = require("ejs");
const cartModel = require("../models/cartmodel");
const productsModel = require("../models/ProductsModel");
const jwt = require("jsonwebtoken");
const User = require("../models/authmodel");


exports.getCart = (req, res) => {
  cartModel.getItemsByUser(req.session.user._id).then((items) => {
    let itemsCount = 0
    itemsCount = items.length;
    req.session.itemsCount = itemsCount;
    req.session.items = items
    
    //res.locals.itemsCount = itemsCount

    res.render("cart", { items,itemsCount });
  });
};

exports.cartPost = async function (req, res, next) {
  try {
    let item = await cartModel.getItemsByproductId(req.body.productId);
    if (item.length > 0) {
      console.log(item);

      cartModel.updateItem(item[0]._id, { amount: item[0].amount + 1 });
      res.render("cart");
    } else {
      let newItem = await cartModel.addNewItem({
        name: req.body.name,
        price: req.body.price,
        img: req.body.img,
        amount: 1,
        productId: req.body.productId,
        userId: req.body.userId,
        date: Date.now(),
      });
      console.log(req.body.userId);
      res.redirect("/cart");
    }
  } catch (err) {
    next(err);
  }
};

exports.postDelete = (req, res) => {
  cartModel.deleteItem(req.body.cartId);
  res.redirect("/cart");
};

exports.updateCart = (req, res) => {
  cartModel.updateItem(req.body.cartId[1], { amount: req.body.amount });
  console.log(req.body.cartId);
  //console.log(req.body.amount);
  res.redirect("/cart");
};

