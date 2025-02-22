const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import User model
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Render login page
router.get("/login", (req, res) => {
    res.render("login", { title: "Login", error: null });
});

// Handle login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', { title: "Login", error: "No user found with this email." });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { title: "Login", error: "Incorrect password." });
        }

        // Store user session
        req.session.user = { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            age: user.age,  
            phone: user.phone 
        };
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.render('login', { title: "Login", error: "An error occurred. Please try again." });
    }
});

// Render register page
router.get("/register", (req, res) => {
    res.render("register", { title: "Register", error: null });
});

// Handle registration
router.post('/register', async (req, res) => {
    const { name, age, phone, email, password } = req.body;

    // Validate input
    if (!name || !age || !phone || !email || !password) {
        return res.render('register', { title: "Register", error: "All fields are required." });
    }

    // Convert age to number
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber <= 0) {
        return res.render('register', { title: "Register", error: "Invalid age." });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.render('register', { title: "Register", error: "Email or phone already registered." });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user with additional fields
        const newUser = new User({ name, age: ageNumber, phone, email, password: hashedPassword });
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.render('register', { title: "Register", error: "An error occurred. Please try again." });
    }
});

module.exports = router;


// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
