const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require('./Routes/UserRoutes');
app.use('/api/users', userRoutes);

// Database connection
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => console.log("Database connected"))
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1);
    });

// Server
const port = process.env.PORT || 7001;
app.listen(port, () => console.log(`Server running on port ${port}`));