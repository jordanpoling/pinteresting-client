const db = require('../database/index.js');
const moment = require('moment');
const fs = require('fs');
const copyFrom = require('pg-copy-streams').from;
const pg = require('pg');
const elastic = require('../database/elasticSearch.js');

const fileForLogging = 'dbHelpers.js';


module.exports = {
  updateUserAverage: ({ average, userId }) => {
    const yesterday = moment().subtract(1, 'days');
    db.none(`
    UPDATE users SET average = ${average}, average_at = now() 
    WHERE users.id = ${userId}
    AND (average IS NULL OR average_at < ${yesterday.format('\'YYYY-MM-DD HH:mm:ss\'')});
    `)
      .catch((err) => { elastic.insertError(err, fileForLogging); });
    return db.any(`SELECT average
      FROM users WHERE id = ${userId}`).catch((err) => { elastic.insertError(err, fileForLogging); });
  },
  insertHealth: ({ engagementScore, userId }) =>
    db.one(`UPDATE users SET score_sum = score_sum+${engagementScore}, session_entries = session_entries + 1
    WHERE id = ${userId}
    RETURNING id AS "userId", score_sum / session_entries AS average
    `)
      .catch((err) => { elastic.insertError(err, fileForLogging); }),
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
      fileStream.on('error', (err) => { elastic.insertError(err, fileForLogging); });
      stream.on('error', (err) => { elastic.insertError(err, fileForLogging); });
      stream.on('end', (err) => { elastic.insertError(err, fileForLogging); });
      fileStream.pipe(stream);
    });
  },
  getUsersForAdRequest: (min, max) => {
    return db.any(`SELECT * FROM users WHERE id >= ${min} AND id <= ${max}`)
      .catch((err) => { elastic.insertError(err, fileForLogging); });
  },
  getUsersForBehavior: (ids) => {
    return db.query(`SELECT * FROM users WHERE id = ANY(ARRAY[${ids}])`)
      .catch(err => elastic.insertError(err, fileForLogging));
  },
  reRollInterests: (id, interests) => {
    // console.log('interests', interests, 'id', id);
    db.one(`UPDATE users SET interests = ${interests} where id = id`)
      .catch((err) =>{elastic.insertError(err, fileForLogging);});
  },
};

