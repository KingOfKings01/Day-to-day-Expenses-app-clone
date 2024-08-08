const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");

const userRoutes = require("./routes/userRouter");
const expenseRoutes = require("./routes/expenseRouter");

const app = express();

const corsOptions = {
  origin: "http://127.0.0.1:5500", //todo: Allow only this origin
  methods: "GET,POST,DELETE", //todo: Allow only GET and POST requests
  allowedHeaders: ["Content-Type", "Authorization"], //? Allow only specific headers
  optionsSuccessStatus: 200, //? Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);

async function initializeDatabase() {
  await sequelize.sync({ force: false });
}

initializeDatabase();

//Todo: Start the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
