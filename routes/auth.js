const express = require('express');
const User = require('../models/UserLogin');
const Application = require('../models/Application');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Sign-up
router.post("/signup", async (req, res) => {
    console.log("Signup request body:", req.body);
    const { 
        email, 
        password, 
        name, 
        phone, 
        residenceType, 
        monthlyIncome, 
        previousLoan, 
        maritalStatus, 
        dependencies, 
        city, 
        state 
    } = req.body;

    try {
        // Validate required fields
        if (!email || !password) {
            console.log("Validation failed: Email or password missing");
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Validation failed: Invalid email format");
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 6) {
            console.log("Validation failed: Password too short");
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        console.log("Checking for existing user with email:", email);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists with email:", email);
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        console.log("Creating new user...");
        const newUser = new User({ email, password });
        await newUser.save();

        console.log("Creating new application...");
        const monthlyIncomeNum = monthlyIncome ? Number(monthlyIncome) : 0;
        const dependenciesNum = dependencies ? Number(dependencies) : 0;

        if (isNaN(monthlyIncomeNum) || isNaN(dependenciesNum)) {
            console.log("Validation failed: Invalid monthlyIncome or dependencies");
            return res.status(400).json({ success: false, message: "monthlyIncome and dependencies must be valid numbers" });
        }

        const newApplication = new Application({
            userId: newUser._id,
            name,
            phone,
            residenceType,
            monthlyIncome: monthlyIncomeNum,
            previousLoan,
            maritalStatus,
            dependencies: dependenciesNum,
            city,
            state
        });
        await newApplication.save();

        console.log("Generating JWT token...");
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
            userId: newUser._id
        });
    } catch (err) {
        console.error("Error in /signup route:", err);
        res.status(500).json({ success: false, message: "Server error!", error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login attempt for email:", email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({ success: false, message: "User not found!" });
        }

        console.log("Comparing passwords for user:", email);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);
        if (!isMatch) {
            console.log("Returning invalid credentials response");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        console.log("Generating token for user:", user._id);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
        console.log("Sending successful login response");
        res.json({ token, userId: user._id });
    } catch (error) {
        console.error("Error in /login route:", error);
        res.status(500).json({ success: false, message: "Server error!" });
    }
});

module.exports = router;