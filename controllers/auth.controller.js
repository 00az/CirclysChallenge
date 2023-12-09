const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
require('dotenv').config()

exports.signin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Validate user ID
    if (!userId) {
      return res.status(400).send({ code: 40002, msg: "Missing user ID" });
    }

    // Validate password
    if (!password) {
      return res.status(400).send({ code: 40002, msg: "Missing password" });
    }

    // Find user
    const user = await User.findOne({ userId });

    // Check if user exists
    if (!user) {
      return res.status(400).send({ code: 40002, msg: "User ID doesn't exist" });
    }

    // Compare password
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    // Check password validity
    if (!isCorrectPassword) {
      return res.status(401).send({ code: 40003, msg: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.userId }, config.secret, { expiresIn: process.env.JWT_EXPIRY });

    // Return successful response
    return res.status(200).send({
      code: 200,
      msg: "Successfully authenticated",
      name: user.name,
      email: user.email,
      accessToken: token,
    });
  } catch (error) {
    return res.status(400).send({ code: 40000, msg: "Service exception, please contact admin" });
  }
};