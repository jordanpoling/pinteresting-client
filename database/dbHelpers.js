const db = require('../database/index.js');
const moment = require('moment');
const fs = require('fs');
const copyFrom = require('pg-copy-streams').from;
const pg = require('pg');


module.exports = {
  updateUserAverage: ({ average, userId }) => {
    const yesterday = moment().subtract(1, 'days');
    db.none(`
    UPDATE users SET average = ${average}, average_at = now() 
    WHERE users.id = ${userId}
    AND (average IS NULL OR average_at < ${yesterday.format('\'YYYY-MM-DD HH:mm:ss\'')});
    `)
      .catch((err) => { console.log('UUA1st',err); });
    return db.any(`SELECT average
      FROM users WHERE id = ${userId}`).catch((err) => { console.log('UUA2nd', err); });
  },
  insertHealth: ({ engagementScore, userId }) =>
    db.one(`UPDATE users SET score_sum = score_sum+${engagementScore}, session_entries = session_entries + 1
    WHERE id = ${userId}
    RETURNING id AS "userId", score_sum / session_entries AS average
    `)
      .catch((err) => { console.log('line 39 db helpers', err); }),  
  bulkInsertUsers: (file) => {
    const client = new pg.Client({
      host: 'localhost',
      port: 5432,
      database: 'users',
      user: 'Jordan',
      password: '',
      poolSize: 100,
    });
    client.connect((error, client, done) => {
      const stream = client.query(copyFrom('COPY users (ratio_threshold,interests,pin_click_freq,user_name,gender,location,age) FROM STDIN WITH csv'));
      const fileStream = fs.createReadStream(file);
      fileStream.on('error', (err) => { console.log(err); });
      stream.on('error', (err) => { console.log(err); });
      stream.on('end', (err) => { console.log(err); });
      fileStream.pipe(stream);
    });
  },
  getUsersForAdRequest: (min, max) => {
    return db.any(`SELECT * FROM users WHERE id >= ${min} AND id <= ${max}`)
      .catch((err) => { console.log(err); });
  },
  getUsersForBehavior: (ids) => {
    return db.query(`SELECT * FROM users WHERE id = ANY(ARRAY[${ids}])`)
      .catch(err => console.log(err));
  },
  reRollInterests: (id, interests) => {
    // console.log('interests', interests, 'id', id);
    db.one(`UPDATE users SET interests = ${interests} where id = id`)
      .catch((err) =>{console.log(err)});
  },
};

