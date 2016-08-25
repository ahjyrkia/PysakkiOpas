if (!process.env.NODE_ENV) {
  require("dotenv").config();
}
const express = require("express");
const app = express();

const port = process.env.PORT || 3333;

app.use(express.static(__dirname + "/dist"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("*", (req, res) => {
  res.render("index", {
    env: {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.API_URL,
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`App listening on port ${port}`);
  }
});
