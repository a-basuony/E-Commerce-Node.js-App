const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const categoryRoutes = require("./routes/categoryRoute");

const dbConnection = require("./config/database");
dotenv.config({ path: "config.env" });
// Connect with db
dbConnection();

// express app
const app = express();

// middlewares
app.use(express.json()); //  for parsing body application/json => req.body

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Log HTTP requests in development 'dev' mode relevant information about the HTTP requests, such as the request method, request URL, response status, response time, and response headers
  // ex: GET /api/v1/categories 200 155.634 ms - 755
  //   console.log("mode:", process.env.NODE_ENV);
}

// Routes
app.use("/api/v1/categories", categoryRoutes); // localhost:3000/api/v1/categories

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("App running on  port ", PORT);
});
