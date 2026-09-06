const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// ========================
// Global Middleware
// ========================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));

// ========================
// Health Check
// ========================

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
    });
});

// ========================
// Global Error Handler
// ========================

app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;