const User = require("../models/User");

// Create a new User
exports.createUser = async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    const user = await User.create(data);

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    await user.destroy(); //* "User.destroy()" to delete the User
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
