const axios = require('axios');
const db = require('../database/dbHelpers.js');

let count = 0;

class User {
  constructor({
    id, interests, pin_click_freq, user_name,
  }) {
    this.clickResults = {
      id,
      total: 0,
      aInteractions: {},
      pClicked: 0,
      pServed: 32,
      aServed: 0,
      totalAdInt: 0,
    };
    this.interests = interests;
    this.pinClickFreq = pin_click_freq;
    this.userName = user_name;


    this.funnelDepth = ({ ad_group, id }) => {
      const probability = Math.random();
      if (probability < this.interests[ad_group] * 0.15) {
        console.log('conversion');
        axios.post('http://localhost:8080/adClicked', { group: ad_group, id: 'conversion' }).catch((error) => {
          console.log('adClicked', error);
        });
      } else if (probability < this.interests[ad_group] * 0.5) {
        console.log('clicked');
        axios.post('http://localhost:8080/adClicked', { group: ad_group, id: 'engagement' }).catch((error) => {
          console.log('adClicked', error);
        });
      } else if (probability < this.interests[ad_group]) {
        console.log('impression');
        axios.post('http://localhost:8080/adClicked', { group: ad_group, id: 'impression' }).catch((error) => {
          console.log('adClicked', error);
        });
      }
    };


    this.userInteractions = (ads) => {
      for (let i = 0; i < 32; i += 1) {
        const probability = Math.random();
        if (probability < this.pinClickFreq) {
          this.clickResults.pClicked += 1;
        }
      }
      this.clickResults.aServed = ads.ads.length;
      ads.ads.forEach((ad) => {
        const probability = Math.random();
        if (probability < this.interests[ad.ad_group]) {
          console.log('count: ', count);
          count += 1;
          this.funnelDepth(ad);
          if (this.clickResults.aInteractions[ad.ad_group]) {
            const prevClicks = this.clickResults.aInteractions[ad.ad_group];
            this.clickResults.aInteractions[ad.ad_group] = prevClicks + 1;
            this.clickResults.totalAdInt += 1;
          } else {
            this.clickResults.aInteractions[ad.ad_group] = 1;
            this.clickResults.totalAdInt += 1;
          }
        }
      });
      const send = () => {
        axios.post('http://localhost:8080/sessionEnd', this.clickResults).catch((error) => {
          console.log(error);
        });
      };
      setTimeout(send, 30);
    };
    this.login = () => axios.get('http://localhost:8080/').catch((error) => {
      console.log(error);
    });
  }
}


const makeActiveUsers = (usersForClass) => {
  const result = [];
  for (const key in usersForClass) {
    result.push(new User(usersForClass[key]));
  }
  console.log(result);
  return result;
};


const makeUsersBehave = (userLimit) => {
  let minUserId = 9875;
  let maxUserId = 9900;
  while (maxUserId <= userLimit + 9875) {
    console.log('MAXUSERIDMAXUSERID', maxUserId);
    let users;
    db.getUsers(minUserId, maxUserId)
      .then((rawUsers) => {
        users = makeActiveUsers(rawUsers);
        users.forEach((user) => {
          user.login()
            .then((ads) => {
              user.userInteractions(ads.data);
            })
            .catch((err) => { console.log(err); });
        });
      });
    minUserId = maxUserId + 1;
    maxUserId += 3;
  }
};


module.exports = {
  runSim: () => {
    setInterval(() => { makeUsersBehave(10000); }, 200);
    // makeUsersBehave(100);
    // makeUsersBehave(100);
    // makeUsersBehave();
    // makeUsersBehave();
  },
};
