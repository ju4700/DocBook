const express = require('express');
const Doctor = require('../models/Doctor'); // Import the Doctor model
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch all doctors from MongoDB
        const doctors = await Doctor.find();

        if (!doctors.length) {
            return res.render('doctors', { doctors: [], message: "No doctors available at the moment." });
        }

        res.render('doctors', { doctors });
    } catch (error) {
        console.error("MongoDB Error:", error);
        res.status(500).send("Error fetching doctors.");
    }
});

module.exports = router;
