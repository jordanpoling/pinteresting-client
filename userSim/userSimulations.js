const axios = require('axios');

const active = 0.7;
const picky = 0.3;
const occa = 0.2;

let count = 0;

const rawUsers = [
  {
    userID: 123,
    interests: {
      technology: 0.5,
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
      technology: 0.3,
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
      technology: 0.7,
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
      aClicks: {},
      pClicked: 0,
      pServed: 32,
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
      for (let i = 0; i < 32; i+=1) {
        const probability = Math.random();
        if (probability < pinClickFreq) {
          this.clickResults.pClicked += 1;
        }
      }
      ads.ads.forEach((ad) => {
        this.clickResults.aClicks = {};
        this.clickResults.aServed = ads.length; 
        console.log('clickResults', this.clickResults.aClicks);
        const probability = Math.random();
        if (probability < this.interests[ad.ad_group]) {
          console.log('count: ', count);
          count+=1;
          this.funnelDepth(ad);
          console.log(ad.ad_group)
          this.clickResults.aClicks[ad.ad_group] !== undefined ? this.clickResults.aClicks[ad.ad_group] ++ : this.clickResults.aClicks[ad.ad_group] = 1;
          // console.log('aClicks', this.clickResults.aClicks)
        }
      });
      axios.post('http://localhost:8080/sessionEnd', this.clickResults).catch((error) => {
        console.log(error);
      });
    };
    this.pinClicks = () => {

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


const makeUsersBehave = (users) => {
  users.forEach((user) => {
    console.log(user.clickResults);
    user.login()
      .then((ads) => {
        user.pinClicks();
        user.userInteractions(ads.data);
      })
      .catch((err) => { console.log(err); });
  });
};


module.exports = {
  runSim: () => {
    const userList = makeActiveUsers(rawUsers);
    makeUsersBehave(userList);
  },
};
