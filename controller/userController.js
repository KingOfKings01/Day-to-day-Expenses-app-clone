// const { User, Order, Downloaded } = require("../relations/Relation");
const User = require("../models/User");
const Order = require("../models/Order");
const Downloaded = require("../models/Downloaded");
const PaymentService = require("../services/paymentService");

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
      // where: {
      email: email,
      // },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    //todo: hook will be called when user is created from encrypting password.
    // const user = await User.create(data);

    // const token = User.generateToken({
    //   id: user.id,
    //   username: user.username,
    // });

    // Create a new user (password encryption is handled in the pre-save hook)
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generate a JWT token
    const token = User.generateToken(user);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne(
      // { where: 
      { email } 
    // }
  );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

      // Compare the password using the instance method
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "User not authorized" });
      }

    // Generate JWT token
    const token = User.generateToken(user);
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

exports.buyPremium = async (req, res) => {
  try {
    // Define the order details
    const amount = 200; // Amount in INR
    const receipt = `order_rcptid_${req.user.id}_${Date.now()}`;

    // Create the Razorpay order using the PaymentService
    const order = await PaymentService.createOrder(amount, "INR", receipt);

    const orderInfo = {
      name: "Day-to-Day",
      description: "Premium Plan",
      image: "",
    };

    // Save the order ID in the user's order history
    //// await req.user.createOrder({ order_id: order.id });

    const newOrder = new Order({
      orderId: order.id,
      userId: req.user._id
    });

    await newOrder.save();

    // Optionally, you can also update the user's order history
    req.user.orders.push(newOrder._id);
    await req.user.save();

    return res.status(200).json({
      order,
      orderInfo,
      user: {
        username: req.user.username,
        email: req.user.email,
        contact: "9999999999",
      },
    });
  } catch (error) {
    console.error("Error in buyPremium controller:", error);
    return res.status(500).json({ message: "Error creating order" });
  }
};

exports.updateOrder = async (req, res) => {
  const { order_id, status } = req.body;
  try {
    const order = await Order.findOne({ order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Update the order's status
    order.status = status; // e.g., "completed" or "failed"
    await order.save();

    if (status === "successful") {

      const user = await User.findById(order.userId);

      if (user) {
        user.isPremium = true; // Set isPremium to true
        await user.save();
      } else {
        return res.status(404).json({ message: "User not found" });
      }

    }
  } catch (err) {
    return res.status(500).json({ message: "Unable to update member status" });
  }
  res.json(req.body);
};

//Todo: leader board
exports.getUsersWithTotalExpenses = async (req, res) => {
  try {
    // const usersWithExpenses = await User.findAll({
    //   attributes: ["username", "totalExpense"],
    // });

     // Fetch users with total expenses
     const usersWithExpenses = await User.find({}, 'username totalExpense').exec();

    //todo: Sort the users by total expenses in descending order
    usersWithExpenses.sort((a, b) => b.totalExpense - a.totalExpense);

    res.status(200).json(usersWithExpenses);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.getDownloadHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    // const downloadHistory = await Downloaded.findAll({
    //   where: { userId: userId },
    //   attributes: ["fileName", "createdAt", "url"],
    // });
    const downloadHistory = await Downloaded.find({ userId: userId }, 'fileName createdAt url').exec();
    
    res.status(200).json(downloadHistory);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
