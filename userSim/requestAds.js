const db = require('../database/dbHelpers.js');
const helpers = require('./helpers');
const elastic = require('../database/elasticSearch.js');

const fileForLogging = 'requestAds.js';
const startTime = new Date().getTime();
let successful = 0;

const makeAdRequestForUsers = () => {
  const userLimit = 100000;
  let minUserId = 1;
  let maxUserId = 100;
  while (maxUserId <= userLimit) {
    let users;
    db.getUsersForAdRequest(minUserId, maxUserId)
      .then((rawUsers) => {
        users = helpers.makeActiveUsers(rawUsers);
        users.forEach((user) => {
          successful += 1;
          if (successful % 1000 === 0) {
            console.log(`${successful} requests successfully received in ${(new Date().getTime() - startTime) / 1000} seconds`);
          }
          user.login();
        });
      })
      .catch((err) => { elastic.insertError(err, fileForLogging); });
    minUserId = maxUserId + 1;
    maxUserId += 100;
  }
};

makeAdRequestForUsers();
// setTimeout(() => { clearInterval(interval); }, 100000);

