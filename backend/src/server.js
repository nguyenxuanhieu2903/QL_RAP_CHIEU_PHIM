const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/database');

const startServer = async () => {
    try {
        await connectDB();

        app.listen(5001, () => {
    console.log(`Server is running on http://localhost:5001`);
});
    } catch (error) {
        console.error('❌ Failed to start server');
        process.exit(1);
    }
};

startServer();