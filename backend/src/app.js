const express = require('express');
const cors = require('cors');

const app = express();
app.use((req, res, next) => {
    console.log('>>> [GLOBAL LOG] Request URL:', req.method, req.url);
    next();
});
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const routes = require('./routes');
app.use('/api', routes);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
    });
});

module.exports = app;