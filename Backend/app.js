require("dotenv").config(); // Load environment variables
const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
const helmet = require("helmet")

const userRoutes = require("./routes/userRouter");
const expenseRoutes = require("./routes/expenseRouter");
const passwordRoutes = require("./routes/passwordRouter");

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Allow only this origin
  methods: process.env.CORS_METHODS, // Allow only specific methods
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS.split(","), // Allow only specific headers
  optionsSuccessStatus: parseInt(process.env.CORS_SUCCESS_STATUS), // Some legacy browsers choke on 204
};

app.use(helmet())
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true })); //* Allow to get newPassword from local password reset form. 
app.use(express.json());

const port = process.env.PORT || 4000;

app.use("/user", userRoutes);
app.use("/password", passwordRoutes);
app.use("/expense", expenseRoutes);

async function initializeDatabase() {
  await sequelize.sync({ force: false });
}

initializeDatabase();

//Todo: Start the server
app.listen(port, () => {
  console.log("Server is running on port", port);
});