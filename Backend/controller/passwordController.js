const { User } = require("../models/Relation");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.forgotPassword = async (req, res) => {
    const userEmail = req.body.email;

    // Find the user by email
    let user;
    try {
        user = await User.findOne({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ message: "User not found" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }

    // Generate token
    const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET, // Secret key from your environment variables
        { expiresIn: '1h' } // Token expiration time
    );

    // Send the email
    try {
        const transporter = nodemailer.createTransport({
            secure: true,
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.EMAIL, // Your email address
                pass: process.env.PASSWORD, // Your email password
            },
        });

        // Define the email options
        const mailOptions = {
            to: userEmail, // Recipient's email address (from the request)
            subject: "Password Reset Request",
            html: `<p>Please click the <a href="http://localhost:4000/password/reset-password/${token}">link</a> to reset your password. The link will expire in 1 hour.</p>`,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", nodemailer.getTestMessageUrl(info)); // For testing with Ethereal

        return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        return res.status(500).json({ message: "Error sending email" });
    }
};

exports.resetPassword = async (req, res) => {
  const token = req.params.token;
  const newPassword = req.body.newPassword;

  // Verify the token
  let decoded;
  try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
  }

  const userEmail = decoded.email;

  // Find the user and update the password
  try {
      const user = await User.findOne({ where: { email: userEmail } });
      if (!user) return res.status(404).json({ message: "User not found" });

      user.password = newPassword; //* No need to hash, it will be handled by the beforeUpdate hook
      await user.save();

      return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
  }
};
