const db = require('../database/index.js');

module.exports = {
  insertHealth: ({userHealth, userId, date}) => {
    console.log('insertHealth');
    db.none(`INSERT INTO engagement(score, user_id, time) VALUES(${userHealth},${userId},now())`)
      .catch((err) =>{console.log(err)});
  },
};
