// import the required modules
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require("connect-flash");
const compression = require("compression")
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");
dotenv.config();

// import the routes
const indexRouter = require("./routes/HomeRoute");
const usersRouter = require("./routes/usersroute");
const productRouter = require("./routes/ProductRoute");
const authRouter = require("./routes/authroute");
const cartRouter = require("./routes/cartroute");
const checkoutRouter = require("./routes/checkoutroute");
const wishListRouter = require ("./routes/wishlistroute")
const { requireAuth, checkUser } = require("./controllers/authmiddleware");

const app = express();

require("./config/mongoose.js")(app);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(compression())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const STORE = new SessionStore({
  uri: process.env.DB_URL,
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  },
  collection: "sessions",
});
// 
app.use(
  session({
    secret: process.env.SECRET_WEB_TOKEN,
    resave: false,
    saveUninitialized: false,
    store: STORE,
  })
);
app.use(flash());
// serving the static folders public & products folders
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/products")));
// middlewares for the routes
app.get("*", checkUser);
app.post("*", checkUser);
app.use("/", indexRouter);
app.use("/", productRouter);
app.use("/users",requireAuth, usersRouter);
app.use("/", authRouter);
app.use("/cart", requireAuth, cartRouter);
app.use("/checkout", requireAuth, checkoutRouter);
app.use("/wishlist", requireAuth, wishListRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
