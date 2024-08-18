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
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://checkout.razorpay.com/"],
      frameSrc: ["'self'", "https://api.razorpay.com/"],
      // other directives if needed
    },
  })
);





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
app.use((req, res)=>{
  res.sendfile(path.join(__dirname, `Public/${req.url}`))
})

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
