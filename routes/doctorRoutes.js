const express = require('express');
const { db } = require('../firebase');
const { collection, getDocs } = require('firebase/firestore');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const doctorsRef = collection(db, "doctors");
        const snapshot = await getDocs(doctorsRef);

        if (snapshot.empty) {
            return res.render('doctors', { doctors: [], message: "No doctors available at the moment." });
        }

        let doctors = [];
        snapshot.forEach(doc => {
            doctors.push({ id: doc.id, ...doc.data() });
        });

        res.render('doctors', { doctors });
    } catch (error) {
        console.error("Firestore Error:", error);
        res.status(500).send("Error fetching doctors.");
    }
});

module.exports = router;
