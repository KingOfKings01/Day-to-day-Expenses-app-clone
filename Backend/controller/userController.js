const { User, Order } = require("../models/Relation");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");

// import { Op } from 'sequelize';

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

// Protected route example using verifyToken
exports.protectedRoute = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  const decoded = User.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  // Check if the user is premium
  const user = await User.findByPk(decoded.id);

  // Proceed with the decoded information
  res.status(200).json({ username: decoded.username, isPremium: user.isPremium  });
};


// todo: order creation
exports.buyPremium = async (req, res) => {
  const key_id = process.env.razorpay_key_id
  const key_secret = process.env.razorpay_key_secret
  const dependencies ={
    key_id,
    key_secret
  }
  const razorpay = new Razorpay(dependencies);
  const token = req.headers.authorization.split(" ")[1];
  const decoded = User.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  
  try {
    const user = await User.findByPk(decoded.id);
  
    const options = {
      amount: 50000, // Amount in paise (e.g., 500 INR)
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    const userData = {
      username: user.username,
      email: user.email,
      key_id,
    };
    
    const order = await razorpay.orders.create(options);
    
    // console.log("object2");
    //todo: store the order
    const got = await user.createOrder({order_id: order.id})
    console.log(user?.createOrder);
    console.table(got);


    res.json({ order, user: userData });
  } catch (error) {
    res.status(500).send("Error creating order");
  }
};

exports.updateOrder = async (req, res) => {
  const { order_id, status } = req.body;
 try{
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
