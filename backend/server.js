const mongoose = require("mongoose");
const app = require("./app");

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
