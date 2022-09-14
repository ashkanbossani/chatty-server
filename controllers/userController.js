const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = User.findOne({ username });
    if (usernameCheck)
      return res.status(400).json({ message: "Username already exists" });
    const emailCheck = User.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ message: "Email already exists" });
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    delete newUser.password;
    return res.json({ status: true, newUser})
  } catch (ex) {
    next(ex);
  }
};
