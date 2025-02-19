const express = require('express');
const { db } = require('../firebase');
const { collection, getDocs } = require('firebase/firestore');
const router = express.Router();

// Dashboard Route
router.get('/dashboard', async (req, res) => {
    // Redirect to login if not authenticated
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.uid;

    // Fetch bookings for the logged-in user
    const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
    let bookings = [];

    bookingsSnapshot.forEach(doc => {
        const booking = doc.data();
        if (booking.userId === userId) {
            bookings.push({
                doctorName: booking.doctorName,    // Make sure this field exists in Firestore
                doctorSpecialization: booking.doctorSpecialization,    // Ensure this field exists
                date: booking.date,
                status: booking.status || 'Pending'  // Default to 'Pending' if status is missing
            });
        }
    });

    res.render('dashboard', { user: req.session.user, bookings });
});

module.exports = router;
