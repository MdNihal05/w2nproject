const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    note: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    files: [{ url: { type: String }, name: { type: String } }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
