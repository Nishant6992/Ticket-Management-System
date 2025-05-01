const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "agent", "admin"], default: "user" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
