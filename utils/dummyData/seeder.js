const fs = require("fs");
require("colors");

const dotenv = require("dotenv");

const Product = require("../../models/productModel");
const dbConnection = require("../../config/database");

dotenv.config({ path: "../../config.env" }); // to read environment variable

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync("./products.json"));

// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);

    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// to run this file => node seeder.js -d
// -i to insert || -d to delete
// process.argv[2]  => means: process.argv[0] node || process.argv[1] seeder.js || process.argv[2] -i or -d
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
