const { User, Order, Downloaded } = require("../relations/Relation");
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
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      //todo: hook will be called when user is created from encrypting password.
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
    await req.user.createOrder({ order_id: order.id });

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
  console.log();
  console.log();
  console.log();
  console.log();
  console.log("Request to update order");
  console.log();
  console.log();
  console.log();
  console.log();
  const { order_id, status } = req.body;
  try {
    const order = await Order.findOne({ where: { order_id } });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
      // Update the order's status
      order.status = status; // e.g., "completed" or "failed"
      await order.save();

      if (status === "successful") {
        const user = await order.getUser(); // Get the user associated with the order
        user.isPremium = true; // Set isPremium to true
        await user.save();
      }
    
  } catch (err) {
    return res.status(500).json({ message: "Unable to update member status" });
  }
  res.json(req.body);
};

//Todo: leader board
exports.getUsersWithTotalExpenses = async (req, res) => {
  try {
    const usersWithExpenses = await User.findAll({
      attributes: ["username", "totalExpense"],
    });

    //todo: Sort the users by total expenses in descending order
    usersWithExpenses.sort((a, b) => b.totalExpense - a.totalExpense);

    res.status(200).json(usersWithExpenses);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.getDownloadHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const downloadHistory = await Downloaded.findAll({
      where: { userId: userId },
      attributes: ["fileName", "createdAt", "url"],
    });
    res.status(200).json(downloadHistory);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
