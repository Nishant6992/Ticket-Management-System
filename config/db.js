const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
  process.exit(0);
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Connection failed:", err.message);
  process.exit(1);
});
