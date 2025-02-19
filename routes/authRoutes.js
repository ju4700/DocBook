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

router.get('/login', (req, res) => res.render('login'));

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
        res.render('login', { error: errorMessage });
    }
});

router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        res.redirect('/login');
    } catch (error) {
        let errorMessage = "Signup failed: ";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage += "This email is already registered.";
        } else {
            errorMessage += error.message;
        }
        res.render('signup', { error: errorMessage });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
