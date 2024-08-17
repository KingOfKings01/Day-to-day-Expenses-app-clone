require("dotenv").config(); // Load environment variables
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/database"); // Assuming you have a Sequelize instance configured

const userRoutes = require("./routes/userRouter");
const expenseRoutes = require("./routes/expenseRouter");
const passwordRoutes = require("./routes/passwordRouter");

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*', // Allow all origins if not specified
  methods: process.env.CORS_METHODS || "GET,POST,PUT,DELETE",
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(",") || ["Content-Type", "Authorization"],
  optionsSuccessStatus: parseInt(process.env.CORS_SUCCESS_STATUS) || 204
};
app.use(cors(corsOptions));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "Public" directory
app.use(express.static(path.join(__dirname, 'Public')));

// API Routes
app.use("/user", userRoutes);
app.use("/password", passwordRoutes);
app.use("/expense", expenseRoutes);

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/views/home.html'));
});

app.get("/auth/forgotPassword", (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/views/auth/forgotPassword.html'));
});

app.get("/auth/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/views/auth/login.html'));
});

app.get("/auth/singeln", (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/views/auth/singeln.html'));
});

// Handle 404 (not found) errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'Public/views/404.html')); // Create a 404.html in your views directory for a custom 404 page
});

// Database Sync
async function initializeDatabase() {
  await sequelize.sync({ force: false });
}
initializeDatabase();

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
