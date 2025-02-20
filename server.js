const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const { db } = require("./firebase"); 
const { collection, getDocs } = require("firebase/firestore"); 

dotenv.config({ path: "./secure.env" });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "doctor_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/", authRoutes);
app.use("/doctors", doctorRoutes);
app.use("/bookings", bookingRoutes);
app.use("/", dashboardRoutes);

app.get("/", (req, res) => {
  res.render("index", { title: "Home", user: req.session.user || null }); 
});


async function testFirestore() {
  try {
    console.log("Testing Firestore connection...");
    const doctorsRef = collection(db, "doctors");
    const snapshot = await getDocs(doctorsRef);

    if (snapshot.empty) {
      console.log("No doctors found in Firestore.");
    } else {
      snapshot.forEach((doc) => {
        console.log(`Doctor: ${doc.id} =>`, doc.data());
      });
    }
  } catch (error) {
    console.error("Firestore Error:", error.message);
  }
}

testFirestore();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
