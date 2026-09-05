const dotenv = require('dotenv');

dotenv.config();

const env = {
    port: Number(process.env.PORT) || 5000,

    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        port: Number(process.env.DB_PORT) || 1433,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
};

module.exports = env;