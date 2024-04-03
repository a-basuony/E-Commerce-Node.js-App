const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const categoryRoutes = require("./routes/categoryRoute");
const ApiError = require("./utils/apiError");
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
}

// Mount Routes
app.use("/api/v1/categories", categoryRoutes); // localhost:3000/api/v1/categories

// handles requests to non-existent routes
// if the route is not found
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this  route ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware
// handles all errors in the application
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // where the error and details
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("App running on  port ", PORT);
});
