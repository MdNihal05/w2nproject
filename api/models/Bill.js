const mongoose = require("mongoose");

const billSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    note: { type: String },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    files: [{ type: String }],
    filePublicIds: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
