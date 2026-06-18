const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://mongodb:27017/employeedb")
  .then(() => {
    console.log("Mongo Connected");

    app.listen(5000, () => {
      console.log("Server Started");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Add this route so your test passes
app.get("/", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// You already have this one
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;

