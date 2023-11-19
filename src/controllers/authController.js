const User = require("../models/user");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PrivateKey = process.env.TOKEN_KEY;
const Register = async (req, res) => {
  try {
    // Get user input
    const { name, phone_number, email, password, type } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      res.status(400).send("All input is required");
      return;
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      phone_number,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      type,
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, PrivateKey, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};
