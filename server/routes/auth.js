const router = require("express").Router();
const { User } = require("../models/user");
const joi = require('joi');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

let otpStore = {}; // Temporary store for OTPs (Use Redis or DB in production)

// Send OTP to email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP temporarily
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // Expires in 10 mins

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "OTP sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate OTP
    const storedOtp = otpStore[email];
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }

    // Update password
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    // Remove OTP from store
    delete otpStore[email];

    res.status(200).send({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email Or Password!" });
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email Or Password!" });
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Logged In Successfully" });
    } catch (error) {
        console.error("Error in Login:", error); // Add this
        res.status(500).send({ message: "Internal Server Error!" });
    }
});


const validate = (data)=>{
    const schema = joi.object({
        email: joi.string().required().label("Email"),
        password: joi.string().required().label("Password"),
    });
    return schema.validate(data); 
};

module.exports = router;