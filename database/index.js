const pgp = require('pg-promise')();

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'users',
  user: 'Jordan',
  password: '',
  poolSize: 200,
};

const db = pgp(cn);

module.exports = db;
