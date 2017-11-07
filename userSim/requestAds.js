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
    db.getUsersForAdRequest(minUserId, maxUserId)
      .then((rawUsers) => {
        console.log(rawUsers)
        users = helpers.makeActiveUsers(rawUsers);
        users.forEach((user) => {
          user.login();
        });
      })
      .catch((err) => {console.log(err)})
    minUserId = maxUserId + 1;
    maxUserId += 100;
  }
};
// setInterval(() => {makeAdRequestForUsers(1000)}, 3500);
makeAdRequestForUsers(100);
