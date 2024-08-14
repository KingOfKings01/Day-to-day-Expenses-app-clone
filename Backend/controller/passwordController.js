const { User, ForgotPasswordRequest } = require("../relations/Relation");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const form = require("../view/form");

exports.forgotPassword = async (req, res) => {
  const userEmail = req.body.email;

  //Todo: Find the user by email
  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) return res.status(404).json({ message: "User not found" });

    //Todo: Register user's reset password request and set uuid.
    const uuid = uuidv4();
    user.createForgotPasswordRequest({ id: uuid, isActive: true });

    //Todo: Send the email
    const transporter = nodemailer.createTransport({
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL, //* Your email address
        pass: process.env.PASSWORD, //* Your email password
      },
    });

    //Todo: Define the email options
    const mailOptions = {
      to: userEmail, //* Recipient's email address (from the request)
      subject: "Password Reset Request",
      html: `
      <p>Hi ${user.username},</p>
      <p>Please click the <a href="http://localhost:4000/password/reset-password/${uuid}">link</a> to reset your password.</p>`,
    };

    //Todo: Send the email
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    return res.status(500).json({ message: "Error sending email" });
  }
};

exports.resetPassword = async (req, res) => {
  //Todo: Send reset password form
  try {
    const id = req.params.uuid;
    const userRequest = await ForgotPasswordRequest.findOne({ where: { id } });
    if (!userRequest)
      return res.status(401).json({ message: "User request not found" });

    if (!userRequest.isActive)
      return res.send(
        "<center><h1>Password reset request has expired!</h1></center>"
      );
    await userRequest.update({ isActive: false });

    res.status(200).send(form(id));
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePassword = async (req, res) => {
  console.table(req.params);
  console.table(req.body);

  //Todo: Update the user's password
  try {
    const id = req.params.uuid;
    const userRequest = await ForgotPasswordRequest.findOne({ where: { id } });

    console.table(userRequest.userId);
    console.table(userRequest.isActive);

    if (!userRequest)
      return res.status(401).json({ message: "User request not found" });

    if (userRequest.isActive)
        return res.send(
          "<center><h1>Password reset request has expired!</h1></center>"
        );

    const user = await User.findByPk(userRequest.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ password: req.body.newPassword });
    await userRequest.update({ isActive: true });

    res.status(200).send("<center> <h1>Password updated</h1> </center>");
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
