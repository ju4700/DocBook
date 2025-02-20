const express = require('express');
const multer = require('multer');
const Booking = require('../models/Booking.js'); // Import the Booking model
const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/new/:doctorId', upload.single('report'), async (req, res) => {
    const { doctorId } = req.params;
    const { userId, date } = req.body;

    // Ensure all required data is provided
    if (!userId || !date || !req.file) {
        return res.status(400).send("Please provide all required information (userId, date, and file).");
    }

    try {
        // Create new booking in MongoDB
        const newBooking = new Booking({
            doctorId,
            userId,
            date,
            file: req.file.filename
        });

        await newBooking.save();

        // Redirect user to bookings page or show success message
        res.redirect('/bookings');
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).send("There was an error while booking your appointment. Please try again later.");
    }
});

module.exports = router;
