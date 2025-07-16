import User from "../Model/usermodel.js";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import nodemailer from "nodemailer";

// ✅ 1. Signup Controller with 6-digit code
const pendingUsers = {};

export const signupcontroller = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // If already pending, overwrite it (or reject if you want)
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = Date.now() + 10 * 60 * 1000;

    pendingUsers[email] = {
      firstname,
      lastname,
      email,
      password: hashedPassword,
      verificationCode,
      codeExpiresAt,
    };

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "muhamedahamed251@gmail.com",
        pass: "sgyc wwxi ptvx iyhf"
      }
    });

    const mailOptions = {
      from: "muhamedahamed251@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: `
        <h3>Hello ${firstname},</h3>
        <p>Your verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>This code is valid for 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Verification code sent to email." });

  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


// ✅ 2. Email verification via 6-digit code
export const verifyCodeController = async (req, res) => {
  try {
    const { email, code } = req.body;
    const userData = pendingUsers[email];

    if (!userData) {
      return res.status(400).json({ message: "No signup found for this email." });
    }

    if (userData.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    if (Date.now() > userData.codeExpiresAt) {
      return res.status(400).json({ message: "Verification code expired." });
    }

    // Create actual user in DB
    await User.create({
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password,
      verified: true
    });

    // Clean up temporary data
    delete pendingUsers[email];

    return res.status(200).json({ message: "Email verified. Account created!" });

  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ message: "Verification failed." });
  }
};


// ✅ 3. Login Controller
export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const loginuser = await User.findOne({ email });
    if (!loginuser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!loginuser.verified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, loginuser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password not matched." });
    }

    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed." });
  }
};
