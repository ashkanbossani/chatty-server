const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.status(400).json({ message: "Username already exists" });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ message: "Email already exists" });
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });
    const isPasswordVaild = await bcrypt.compareSync(password, user.password);
    if (!isPasswordVaild)
      return res.json({ msg: "Incorrect username or password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarPicture = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      avatarPicture,
      isProfilePictureSet: true,
    });
    return res.json({
      isSet: userData.isProfilePictureSet,
      image: userData.avatarPicture,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarPicture",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};