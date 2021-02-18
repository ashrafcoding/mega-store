const cartModel = require("../models/cartmodel");
const productsModel = require("../models/ProductsModel");
const User = require("../models/authmodel");

exports.getWishList = (req, res) => {
    res.render("wishlist")
}