const express = require("express");
require("dotenv").config();
const connectDb = require("./utils/db");
const billRoutes = require("./routes/billRoutes");
const cors = require("cors");

const app = express();
connectDb();

app.use(cors({
  origin: 'https://w2nproject.vercel.app',
  // origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api/bills", billRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
