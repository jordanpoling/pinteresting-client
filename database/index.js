const pgp = require('pg-promise');

const address = 'pg://admin:guest@localhost:5432/users';

const client = pgp(address);
client.connect();

