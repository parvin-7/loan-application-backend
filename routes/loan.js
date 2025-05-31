const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/UserLogin'); // Import User model
const auth = require('../middleware/auth');

router.get("/application/:userId", auth, async (req, res) => {
    try {
        const application = await Application.findOne({ userId: req.params.userId });
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Fetch the user's email from the userlogins collection
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add email to the application data
        const applicationData = {
            ...application.toObject(),
            email: user.email,
        };

        res.json(applicationData);
    } catch (error) {
        console.error("Error in /application/:userId route:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Other routes (e.g., /apply)
router.post("/apply", auth, async (req, res) => {
    try {
        const existingApplication = await Application.findOne({ userId: req.user.id });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already submitted an application" });
        }
        
        const newApplication = new Application({
            userId: req.user.id,
            ...req.body
        });
        await newApplication.save();
        res.status(201).json({ message: "Loan application submitted!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;