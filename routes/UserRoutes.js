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
    const { name, phone, password } = req.body;

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

router.get("/users", async (req, res) => {
  let { name, phone, gender } = req.query;

  let users = await User.find({});

  if (!users) {
    return res.status("400").json("Users Not Found");
  }

  if (name && name !== "") {
    users = users.filter((user) =>
      user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    );
  }

  if (phone && phone !== "") {
    users = users.filter((user) =>
      user.phone.toLocaleLowerCase().includes(phone.toLocaleLowerCase())
    );
  }

  gender = gender?.toLocaleLowerCase();
  if (gender && gender !== "") {
    users = users.filter(
      (user) => user.gender.toLocaleLowerCase() === gender.toLocaleLowerCase()
    );
  }

  return res.json(users);
});

module.exports = router;
