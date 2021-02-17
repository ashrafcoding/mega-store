const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const { NotExtended } = require("http-errors");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter a user name"],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    minlength: 6,
    unique: true,
    lowercase: true,
    validate: [isEmail, `please enter a valid email`],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    minlength: [6, "minimum password length 6 character"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  firstName: String,
  secondName: String,
  address: String,
  city: String,
  phone: String,
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

//static method to login user

userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);

      if (auth) {
        return user;
      }
      throw Error("incorrect password");
    }
    throw Error("incorrect email");
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
