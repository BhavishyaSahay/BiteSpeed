const express = require("express");
const dotenv = require("dotenv");
const contactRoute = require("./routes/Routes");

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.json("hello world");
});

app.use("/api", contactRoute);
const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
