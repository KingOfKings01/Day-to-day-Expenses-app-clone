const { User, Order, Expense } = require("../models/Relation");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");

const sequelize = require("sequelize");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const decoded = User.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user object to request
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new User
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const data = {
      username,
      email,
      password,
    };

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    } else {
      const user = await User.create(data);

      const token = User.generateToken({
        id: user.id,
        username: user.username,
      });
      res.status(200).json({ token });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const token = User.generateToken({ id: user.id, username: user.username });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Protected route example using verifyToken middleware
exports.protectedRoute = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ username: req.user.username, isPremium: req.user.isPremium });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Buy Premium (order creation)
exports.buyPremium = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.razorpay_key_id,
      key_secret: process.env.razorpay_key_secret,
    });

    const options = {
      amount: 500 * 100, // Amount in Paise (e.g., 500 INR)
      currency: "INR",
      receipt: `order_rcptid_${req.user.id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    await req.user.createOrder({ order_id: order.id });

    return res
      .status(200)
      .json({
        order,
        user: { username: req.user.username, email: req.user.email },
      });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order" });
  }
};

exports.updateOrder = async (req, res) => {
  const { order_id, status } = req.body;
  try {
    const order = await Order.findOne({ where: { order_id } });

    if (order) {
      // Update the order's status
      order.status = status; // e.g., "completed" or "failed"
      await order.save();

      if (status === "successful") {
        const user = await order.getUser(); // Get the user associated with the order
        user.isPremium = true; // Set isPremium to true
        await user.save();
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.json(req.body);
};

// leader board
exports.getUsersWithTotalExpenses = async (req, res) => {
  try {
    const usersWithExpenses = await User.findAll({
      attributes: [
        'username',
        'totalExpense',  
      ],
    });

    res.status(200).json(usersWithExpenses);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
