const db = require('../database/index.js');

module.exports = {
  insertHealth: ({ userHealth, userId }) => {
    console.log('insertHealth');
    db.none(`INSERT INTO engagement(score, user_id, time) VALUES(${userHealth},${userId},now())`)
      .catch((err) =>{console.log(err)});
  },
};
