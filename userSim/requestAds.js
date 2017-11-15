const db = require('../database/dbHelpers.js');
const helpers = require('./helpers');

const startTime = new Date().getTime();
let successful = 0;

const makeAdRequestForUsers = () => {
  const userLimit = 100000;
  let minUserId = 1;
  let maxUserId = 100;
  while (maxUserId <= userLimit) {
    // console.log('something');
    let users;
    db.getUsersForAdRequest(minUserId, maxUserId)
      .then((rawUsers) => {
        users = helpers.makeActiveUsers(rawUsers);
        users.forEach((user) => {
          // console.log('in loop');
          // console.log(user)
          successful += 1;
          if (successful % 1000 === 0) {
            console.log(`${successful} requests successfully received in ${(new Date().getTime() - startTime) / 1000} seconds`);
          }
          user.login();
        });
      })
      .catch((err) => { console.log(err); });
    minUserId = maxUserId + 1;
    maxUserId += 100;
  }
};
  // makeAdRequestForUsers(1);

makeAdRequestForUsers();
// setTimeout(() => { clearInterval(interval); }, 100000);

