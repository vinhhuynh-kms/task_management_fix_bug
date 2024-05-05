// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require('./routes/taskRoutes');

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Middleware to attach user info to every view
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log("JWT verification error:", err.message);
        console.error(`JWT verification error: ${err.message}`, err);
        res.locals.user = null;
        next();
      } else {
        console.log("User authenticated successfully:", decodedToken.id);
        res.locals.user = decodedToken.id; // Attach user ID to res.locals
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log("JWT verification error:", err.message);
        res.status(401).send('You are not authenticated');
      } else {
        console.log("User authenticated successfully:", decodedToken.id);
        req.userId = decodedToken.id; // Attach user ID to request object
        next();
      }
    });
  } else {
    console.log("No token found, redirecting to login.");
    res.redirect('/auth/login');
  }
};

// Authentication Routes
app.use(authRoutes);

// Task Management Routes
app.use(taskRoutes);

// Root path response
app.get("/", (req, res) => {
  res.render("index");
});

// Dashboard route
app.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard");
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});