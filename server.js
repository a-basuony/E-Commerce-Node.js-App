const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const categoryRoutes = require("./routes/categoryRoute");
const subCategoryRoutes = require("./routes/subCategoryRoute");
const ApiError = require("./utils/apiError");
const dbConnection = require("./config/database");
const globalError = require("./middlewares/errorMiddleware");

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
}

// Mount Routes
app.use("/api/v1/categories", categoryRoutes); // localhost:3000/api/v1/categories
app.use("/api/v1/subcategories", subCategoryRoutes); // localhost:3000/api/v1/subcategories

// Middleware to handle requests to non-existent routes by creating and passing an ApiError to the next middleware
// If a route does not match any defined routes, this middleware is triggered
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this  route ${req.originalUrl}`, 400));
});

// Middleware to handle all errors in the application for express
app.use(globalError);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("App running on  port ", PORT);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  // console.log(err);
  console.log(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
