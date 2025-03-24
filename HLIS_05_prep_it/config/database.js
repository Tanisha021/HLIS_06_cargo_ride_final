const sql = require('mysql2');
let credentials = {}
require('dotenv').config();
credentials = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: process.env.DB_DATE_STRINGS
};

const database = sql.createPool(credentials).promise();
// Test database connection
database.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed: ", err);
        return;
    }
    console.log("✅ Database Connected Successfully!");
    connection.release(); // Release connection back to pool
});

module.exports = database;