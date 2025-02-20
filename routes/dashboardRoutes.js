const express = require('express');
const Booking = require('../models/Booking'); // Import Booking model
const Doctor = require('../models/Doctor'); // Import Doctor model
const router = express.Router();

// Dashboard Route
router.get('/dashboard', async (req, res) => {
    // Redirect to login if not authenticated
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user._id; // MongoDB uses _id instead of uid

    try {
        // Fetch bookings for the logged-in user
        const bookings = await Booking.find({ userId }).populate('doctorId');

        const formattedBookings = bookings.map(booking => ({
            doctorName: booking.doctorId.name, // Assuming Doctor model has 'name' field
            doctorSpecialization: booking.doctorId.specialization, // Ensure this field exists
            date: booking.date,
            status: booking.status || 'Pending' // Default to 'Pending' if status is missing
        }));

        res.render('dashboard', { user: req.session.user, bookings: formattedBookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Error loading dashboard.");
    }
});

module.exports = router;
