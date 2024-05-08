const mongoose = require("mongoose");


mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://Mubashir:35697008@cluster0.121vi.mongodb.net/?retryWrites=true&w=majority",

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
      }
    );

    console.log(`mongodb connect Successfully on ${conn.connection.host}`);
  } catch (err) {
    console.log(`db error ${err}`);
    process.exit();
  }
};

module.exports = connectDB;
