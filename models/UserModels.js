const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    password: String,
    contacts: Array,
    notification: Array,
    gender: {
      type: String,
      
    },
  },
  {
    timeStamps: true,
  }
);

mongoose.model("User", userSchema);
