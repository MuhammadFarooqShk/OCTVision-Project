const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const authMiddleware = require("../Middlewares/authMiddleware");

// Route to get the current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // `req.user` contains the user information set by the authMiddleware
    res.status(200).send({ message: "Current user fetched successfully", user: req.user });
  } catch (error) {
    res.status(500).send({ message: "Error fetching current user", error });
  }
});
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(409).send({ message: "User Already Exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({ ...req.body, password: hashPassword });
        await newUser.save();

        res.status(201).send({ message: "User Created Successfully" });
    } catch (error) {
        console.error("User Registration Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
