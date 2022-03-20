const { cp } = require('fs');
const { Pool } = require('pg');

const config = require('./config');

const pool = new Pool({
    user: config.user,
    database: config.database,
    password: config.password,
    port: config.port
});

module.exports = {
    async query(text, params) {
        const res = await pool.query(text, params);
        console.log('executed query', { text, rows: res.rowCount});
        return res;
    }
}