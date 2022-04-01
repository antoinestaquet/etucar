const { Pool } = require('pg');

const { db } = require('../config');

const pool = new Pool({
    user: db.user,
    database: db.database,
    password: db.password,
    port: db.port
});

module.exports = {
    async query(text, params) {
        const res = await pool.query(text, params);
        console.log('executed query', { text, rows: res.rowCount});
        return res;
    }
}