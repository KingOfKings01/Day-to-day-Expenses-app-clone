const { User } = require("../models/Relation");
const jwt = require("jsonwebtoken");
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

// Get a User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

  // Proceed with the decoded information
  res.status(200).json({ username: decoded.username });
};
