const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDb = require('./config/db');

const vendorRoutes = require("./routes/vendorRoutes");


dotenv.config();
const app = express();
// Connect to MongoDB
connectToDb();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/vendor',vendorRoutes);
app.use('/api/shop', require('./routes/shopRoutes'));
app.use('/api/middleman', require('./routes/middlemanRoutes'));

  
app.get('/', (req, res) => {
  res.send('Welcome to SupplySathi API');
});

// Server
app.listen(5000, async () => {
  console.log('Server is running on port 5000');
})