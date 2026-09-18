const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors()); // Permits cross-origin requests from Vite client
app.use(express.json()); // Parses incoming JSON payloads

// Routes
app.use('/api/notes', noteRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));