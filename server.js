const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

const ticketRoutes = require("./routes/ticket");
app.use("/tickets", ticketRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// {
//     "name": "Nishant",
//     "email": "nishant@example.com",
//     "password": "123456"
//   }
  