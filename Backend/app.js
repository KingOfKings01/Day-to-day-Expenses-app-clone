const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const userRoutes = require("./routes/userRouter");
const expenseRoutes = require("./routes/expenseRouter");
const passwordRoutes = require("./routes/passwordRouter");

const app = express();

const corsOptions = {
  origin: "http://127.0.0.1:5500", //todo: Allow only this origin
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"], //* Allow only specific headers
  optionsSuccessStatus: 200, //* Some legacy browsers choke on 204
};

app.use(cors());
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