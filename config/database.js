const mongoose = require("mongoose");

const dbConnection = () => {
  // connect with db
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log("connected to database successfully!", conn.connection.name);
    })
    .catch((err) => console.log("Database Error", err));
};

module.exports = dbConnection;
