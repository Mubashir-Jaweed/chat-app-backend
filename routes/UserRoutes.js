const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "HelloWorld");
};

router.post("/signup", async (req, res) => {
  try {
    const { name, phone, password ,gender } = req.body;

    if (!name || !phone || !password) {
      return res.status(404).json("Not Found");
    }

    const user = await User.findOne({ phone });

    if (user) {
      return res.status(409).json("Phone Number Already Taken");
    }

    const hashpassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(5));

    await new User({
      name,
      phone,
      password: hashpassword,
      gender: gender,
    }).save();

    return res.status(200).json("Account Created Successfully");
  } catch (error) {
    return res.status(404).json({ error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(404).json("Not Found");
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json("Not Found");
    }
    const decodePassword = await bcrypt.compare(password, user.password);

    if (decodePassword) {
      return res
        .status(200)
        .json({ id: user.id, token: generateToken(user.id) });
    }

    return res.status(400).json("Authorization Failed");
  } catch (error) {
    return res.status(404).json({ error });
  }
});


module.exports = router;
