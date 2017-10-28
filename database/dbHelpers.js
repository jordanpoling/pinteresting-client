const db = require('../database/index.js');
const moment = require('moment');

module.exports = {
  insertHealth: ({ userHealth, userId }) => {
    console.log('insertHealth');
    db.none(`INSERT INTO engagement(score, user_id, time) VALUES(${userHealth},${userId},now())`)
      .catch((err) =>{console.log(err)});
  },
  usersAverage: ({ userId }) => {
    console.log(userId)
    const now = moment();
    console.log('DATESDATESDATESDATES NOWNOWNOWNOW', now.format('YYYY-MM-DD HH:mm:ss'));
    const yesterday = moment().subtract(1, 'days');
    return db.query(`SELECT AVG(score), user_id
    FROM engagement
    where user_id = ${userId} AND time >= ${yesterday.format(`'YYYY-MM-DD HH:mm:ss'`)} AND time < ${now.format(`'YYYY-MM-DD HH:mm:ss'`)}
    GROUP BY user_id`);
  },
};
