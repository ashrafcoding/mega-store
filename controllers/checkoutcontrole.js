const Order = require("../models/ordermodel");
const cartModel = require("../models/cartmodel");
const User = require("../models/authmodel");
const { startSession } = require("../models/authmodel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckout = (req, res, next) => {
  res.render("checkout", { items: req.session.items });
};

const DOMAIN = "http://localhost:3000";
exports.postCheckout = async (req, res) => {
  const items = req.session.items;
  var item = items[0];
  let sum = 0;
  items.forEach((item) => {
    sum += item.amount * parseInt(item.price.slice(1));
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [`${DOMAIN}/${item.img}`],
          },
          unit_amount: (sum + 5) * 100,
        },
        quantity: item.amount,
      },
    ],
    mode: "payment",
    success_url: `${DOMAIN}/checkout/success`,
    cancel_url: `${DOMAIN}/checkout/cancel`,
  });
  res.json({ id: session.id });

  console.log(session.id);

  let order = await Order.addNewOrder({
    userId: req.session.user._id,
    cart: req.session.items,
    address: req.session.user.address,
    name: req.session.user.name,
    paymentId: session.id,

    orderPrice: sum + 5,
  });
};

exports.getCheckoutSuccess = async (req, res) => {
  cartModel.deleteManyItems(req.session.user._id);
  req.session.items = [];
  req.session.itemsCount = 0;
  res.render("success", { itemsCount: req.session.itemsCount });
};

exports.getCheckoutCancel = (req, res) => {
  res.render("cancel");
};

exports.postCheckoutUpdate = async (req, res, next) => {
  const { firstName, secondName, address, city, phone } = req.body;
  try {
    await User.updateOne(
      { _id: req.session.user._id },
      { firstName, secondName, address, city, phone }
    );
    res.redirect("/checkout");
  } catch (err) {
    next(err);
  }
};
