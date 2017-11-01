const axios = require('axios');

const active = 0.5;
const picky = 0.35;
const occa = 0.3;

let count = 0;

const rawUsers = [
  {
    userID: 123,
    interests: {
      technology: 0.7,
      skateboarding: 0.25,
      supreme: 0.25,
      noodels: 0.50,
    },
    pinClickFreq: active,
    userName: 'Jordan',
  },
  {
    userID: 1234,
    interests: {
      technology: 0.4,
      skateboarding: 0.25,
      supreme: 0.50,
      noodels: 0.25,
    },
    pinClickFreq: picky,
    userName: 'Tim',
  },
  {
    userID: 12345,
    interests: {
      technology: 0.2,
      skateboarding: 0.50,
      supreme: 0.25,
      noodels: 0.25,
    },
    pinClickFreq: occa,
    userName: 'Devon',
  },
];


class User {
  constructor({
    userID, interests, pinClickFreq, userName,
  }) {
    this.clickResults = {
      userId: userID,
      total: 0,
      aInteractions: {},
      pClicked: 0,
      pServed: 32,
      aServed: 0,
      totalAdInt: 0,
    };
    this.interests = interests;
    this.pinClickFreq = pinClickFreq;
    this.userName = userName;


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
        if (probability < pinClickFreq) {
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
      axios.post('http://localhost:8080/sessionEnd', this.clickResults).catch((error) => {
        console.log(error);
      });
    };
    this.login = () => axios.get('http://localhost:8080/').catch((error) => {
      console.log(error);
    });
  }
}


const makeActiveUsers = (usersForClass) => {
  const result = [];
  usersForClass.forEach((user) => {
    result.push(new User(user));
  });
  return result;
};


const makeUsersBehave = () => {
  const users = makeActiveUsers(rawUsers);
  users.forEach((user) => {
    user.login()
      .then((ads) => {
        user.userInteractions(ads.data);
      })
      .catch((err) => { console.log(err); });
  });
};


module.exports = {
  runSim: () => {
    // makeUsersBehave(userList);
    setInterval(() => { makeUsersBehave(); }, 20);
    // makeUsersBehave();
    // makeUsersBehave();
    // makeUsersBehave();
    // makeUsersBehave();
  },
};
