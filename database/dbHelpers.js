const db = require('../database/index.js');
const moment = require('moment');

//  CONSOLIDATE THESE TO A SINGLE QUERY

module.exports = {
  updateUserAverage: ({ average, id }) => {
    const yesterday = moment().subtract(1, 'days');
    console.log('inputs==>>>>>>>>>>>>>>>>>>', id, average);
    db.none(`
    UPDATE users SET average = ${average}, average_at = now() 
    WHERE users.id = ${id}
    AND (average IS NULL OR average_at < ${yesterday.format('\'YYYY-MM-DD HH:mm:ss\'')})
    RETURNING score_sum / session_entries AS average;
    `).then((result) => { console.log('success', result); })
      .catch((err) => { console.log(err); });
    return db.one(`SELECT score_sum / session_entries AS average
      FROM users WHERE id = ${id}`).catch((err) => { console.log(err)});
  },
  insertHealth: ({ score, id }) => {
    console.log('SCORE', score, 'ID', id);
    return db.one(`UPDATE users SET score_sum = score_sum+${score}, session_entries = session_entries + 1
    WHERE id = ${id}
    RETURNING id, score_sum / session_entries AS average
    `)
      .catch((err) => { console.log('line 39 db helpers', err); });
  },
};

