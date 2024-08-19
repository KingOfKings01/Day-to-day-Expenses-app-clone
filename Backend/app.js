require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/database");

const userRoutes = require("./routes/userRouter");
const expenseRoutes = require("./routes/expenseRouter");
const passwordRoutes = require("./routes/passwordRouter");

const app = express();

app.use(cors());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from "Public" directory
app.use(express.static(path.join(__dirname, 'Public')));

// API Routes
app.use("/user", userRoutes);
app.use("/password", passwordRoutes);
app.use("/expense", expenseRoutes);

// Serve home.html on the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Serve HTML files for GET requests
app.get('*', (req, res) => {
  const requestedUrl = req.url;
  if (requestedUrl.startsWith('/views/')) {
    res.sendFile(path.join(__dirname, requestedUrl));
  } else {
    res.sendFile(path.join(__dirname, 'Public', requestedUrl));
  }
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

