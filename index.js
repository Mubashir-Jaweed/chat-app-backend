const express = require("express");
const PORT = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => {
  res.send("Chat App with Flutter & Node.js");
});

app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
