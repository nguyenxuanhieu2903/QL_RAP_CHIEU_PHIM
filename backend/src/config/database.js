const sql = require('mssql');
const env = require('./env');

const dbConfig = {
    user: env.db.user,
    password: env.db.password,
    server: env.db.server,
    database: env.db.database,
    port: env.db.port,

    options: {
        encrypt: false,
        trustServerCertificate: true,
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

let pool;

const connectDB = async () => {
    try {
        pool = await sql.connect(dbConfig);

        console.log('✅ SQL Server connected successfully');

        return pool;
    } catch (error) {
        console.error('❌ SQL Server connection failed');
        console.error(error.message);

        throw error;
    }
};

const getPool = () => {
    if (!pool) {
        throw new Error('Database connection has not been initialized');
    }

    return pool;
};

module.exports = {
    sql,
    connectDB,
    getPool,
};