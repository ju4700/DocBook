const express = require('express');
const Booking = require('../models/Booking'); // Import Booking model
const router = express.Router();

// Dashboard Route
router.get('/dashboard', async (req, res) => {
    // Redirect to login if not authenticated
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id; // Use 'id' from session

    try {
        // Fetch bookings for the logged-in user & populate doctor details
        const bookings = await Booking.find({ userId }).populate('doctorId');

        const formattedBookings = bookings.map(booking => ({
            doctorName: booking.doctorId?.name || "Unknown", // Handle missing doctor data
            doctorSpecialization: booking.doctorId?.specialization || "Not specified",
            date: booking.date,
            status: booking.status || 'Pending'
        }));

        res.render('dashboard', { user: req.session.user, bookings: formattedBookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Error loading dashboard.");
    }
});

module.exports = router;
