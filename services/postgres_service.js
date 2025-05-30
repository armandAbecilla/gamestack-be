const config = require('../config/config');
const { Pool } = require('pg');

const db = new Pool({
  host: config.PG.host,
  port: config.PG.port,
  user: config.PG.user,
  password: config.PG.password,
  database: config.PG.database,
  ssl: { rejectUnauthorized: false }, // Required for Supabase
});

const query = {
  async executeQuery(sql, params = []) {
    try {
      const { rows } = await db.query(sql, params);
      return rows;
    } catch (e) {
      console.error(e);
      throw new Error(e || 'Error fetching data');
    }
  },

  async findFirst(sql, params = []) {
    try {
      const { rows } = await db.query(sql, params);
      return rows[0] || null;
    } catch (e) {
      console.error(e);
      throw new Error(e || 'Error fetching data');
    }
  },
};

module.exports = query;
