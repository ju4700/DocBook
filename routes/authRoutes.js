const express = require('express');
const { auth } = require('../firebase');
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        req.session.user = userCredential.user;
        res.redirect('/dashboard');
    } catch (error) {
        let errorMessage = "Login failed: ";
        if (error.code === 'auth/user-not-found') {
            errorMessage += "No user found with this email.";
        } else if (error.code === 'auth/wrong-password') {
            errorMessage += "Incorrect password.";
        } else {
            errorMessage += error.message;
        }
        res.render('login', { title: "Login", error: errorMessage }); // ✅ FIXED
    }
});

// Render register page
router.get("/register", (req, res) => {
    res.render("register", { title: "Register", error: null });
});

// Handle registration
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        res.redirect('/login');
    } catch (error) {
        let errorMessage = "Registration failed: ";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage += "This email is already registered.";
        } else {
            errorMessage += error.message;
        }
        res.render('register', { title: "Register", error: errorMessage }); // ✅ FIXED
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
