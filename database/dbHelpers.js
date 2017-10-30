const db = require('../database/index.js');
const moment = require('moment');

//  CONSOLIDATE THESE TO A SINGLE QUERY

module.exports = {
  insertHealth: ({ userHealth, userId }) => {
    console.log('insertHealth');
    db.none(`INSERT INTO engagement(score, user_id, time) VALUES(${userHealth},${userId},now())`)
      .catch((err) =>{console.log(err)});
  },
  usersAverage: ({ userId }) => {
    const now = moment();
    const yesterday = moment().subtract(1, 'days');
    //  set average to variable
    return db.query(`SELECT AVG(score), user_id
    FROM engagement, users
    where user_id = ${userId} AND time >= ${yesterday.format(`'YYYY-MM-DD HH:mm:ss'`)} AND time < ${now.format(`'YYYY-MM-DD HH:mm:ss'`)}
    GROUP BY user_id`).catch((err)=>{console.log(err)});
  },
  updateUserAverage: ({ userId, avg }) => { 
    const yesterday = moment().subtract(1, 'days');
    console.log('inputs', userId, avg);
    return db.none(`
    UPDATE users SET average_score = ${avg}, score_time = now() 
    WHERE users.id = ${userId}
    AND (average_score IS NULL OR score_time < ${yesterday.format(`'YYYY-MM-DD HH:mm:ss'`)})
    RETURNING average_score;
    `)
      .catch((err) =>{console.log(err)});
  },
  queryUsersAverage: (userId) => {
    return db.query(`SELECT average_score FROM users WHERE id = ${userId}`)
      .catch((err) =>{console.log(err)});
  },
};
