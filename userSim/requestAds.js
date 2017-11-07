const axios = require('axios');
const db = require('../database/dbHelpers.js');
const helpers = require('./helpers');
const sqs = require('./sqsHelpers.js');
const User = require('./UserClass.js').class;


const makeAdRequestForUsers = (userLimit) => {
  let minUserId = 9875;
  let maxUserId = 9900;
  while (maxUserId <= userLimit + 9875) {
    let users;
    db.getUsers(minUserId, maxUserId)
      .then((rawUsers) => {
        users = helpers.makeActiveUsers(rawUsers);
        users.forEach((user) => {
          user.login();
        });
      });
    minUserId = maxUserId + 1;
    maxUserId += 100;
  }
};


module.exports = {
  requestAds: () => {
    setInterval(() => {makeAdRequestForUsers(1000)}, 3500);
  },
};
