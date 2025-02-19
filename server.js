const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const { db } = require('./firebase'); // Import Firestore instance

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: process.env.SESSION_SECRET || 'doctor_secret', resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');

// Routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/bookings', bookingRoutes);
app.use('/', dashboardRoutes);

// Test Firestore Connection
async function testFirestore() {
  try {
    const { collection, getDocs } = require('firebase/firestore');
    const doctorsRef = collection(db, 'doctors');
    const snapshot = await getDocs(doctorsRef);
    snapshot.forEach(doc => {
      console.log(`Doctor: ${doc.id} =>`, doc.data());
    });
  } catch (error) {
    console.error('Firestore Error:', error);
  }
}

testFirestore();

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
