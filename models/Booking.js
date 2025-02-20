const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Booking", BookingSchema);
