const express = require('express');
const multer = require('multer');
const { db } = require('../firebase');
const { collection, addDoc } = require('firebase/firestore');
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
        // Add booking to Firestore
        await addDoc(collection(db, "bookings"), {
            doctorId,
            userId,
            date,
            file: req.file.filename
        });

        // Redirect user to bookings page or show success message
        res.redirect('/bookings');
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).send("There was an error while booking your appointment. Please try again later.");
    }
});

module.exports = router;
