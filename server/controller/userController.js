const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbconfig");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const { sendMail } = require("../config/mailer");

dotenv.config();

// Register User
async function register(req, res) {
  const { username, first_name, last_name, email, password } = req.body;

  if (!username || !first_name || !last_name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all required fields",
    });
  }

  if (password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Password must be at least 8 characters",
    });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username,userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "User already existed",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, first_name, last_name, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
}

// Login User
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "please provide all required information" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username,userid,password FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "invalid credential" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "invalid credential" });
    }

    const { username, userid } = user[0];
    const token = jwt.sign({ username, userid }, process.env.JWTSECRET, {
      expiresIn: "1d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "user login successfully", token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "something went wrong, try again later" });
  }
}

// Check Authenticated User
function checkuser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  return res
    .status(StatusCodes.OK)
    .json({ message: "valid user", username, userid });
}

// Forgot Password
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email is required" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    await dbConnection.query(
      "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
      [email, token, expiresAt]
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendMail({
      to: email,
      subject: "Reset Your Password",
      html: `<p>You requested a password reset.</p>
             <p><a href="${resetLink}">Click here to reset your password</a></p>`,
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error(err.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
}

// Reset Password
async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing token or password" });
  }

  try {
    const [entry] = await dbConnection.query(
      "SELECT * FROM password_resets WHERE token = ?",
      [token]
    );

    if (entry.length === 0 || new Date(entry[0].expires_at) < new Date()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbConnection.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      entry[0].email,
    ]);
    await dbConnection.query("DELETE FROM password_resets WHERE token = ?", [
      token,
    ]);

    return res
      .status(StatusCodes.OK)
      .json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Could not reset password" });
  }
}

module.exports = {
  register,
  checkuser,
  login,
  forgotPassword,
  resetPassword,
};
