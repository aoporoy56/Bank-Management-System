const express = require('express');
require("dotenv").config();

const app = express();
const port = 4000;
const cors = require('cors');
const connection = require('./DB/ConDB');
const CustomerRouter = require('./Router/CustomerRoute');
const AdminRouter = require('./Router/AdminRoute');

// CORS options - Allow all origins, methods, and headers
const corsOptions = {
  origin: '*', // Allow requests from all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // Allow all common headers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connection();

// Routes
app.use("/customer", CustomerRouter);
app.use("/admin", AdminRouter);

// Preflight request handler (for OPTIONS)
app.options('*', cors(corsOptions)); // Handle preflight for all routes

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
