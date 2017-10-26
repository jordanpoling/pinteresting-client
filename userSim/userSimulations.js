const axios = require('axios');

const active = 0.7;
const picky = 0.3;
const occa = 0.2;

const rawUsers = [
  {
    id: 123,
    interests: {
      technology: 0.5,
      skateboarding: 0.25,
      supreme: 0.25,
      noodels: 0.50,
    },
    pinClicks: active,
    userName: 'Jordan',
  },
  {
    id: 1234,
    interests: {
      technology: 0.3,
      skateboarding: 0.25,
      supreme: 0.50,
      noodels: 0.25,
    },
    pinClicks: picky,
    userName: 'Tim',
  },
  {
    id: 12345,
    interests: {
      technology: 0.7,
      skateboarding: 0.50,
      supreme: 0.25,
      noodels: 0.25,
    },
    pinClicks: occa,
    userName: 'Devon',
  },
];


class User {
  constructor({ interests, pinClicks, userName }) {
    this.interests = interests;
    this.pinClicks = pinClicks;
    this.userName = userName;
    this.clickResults = {
      pServed: 0,
      pClicked: 0,
    };
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
    this.adClicks = (ads) => {
      this.clickResults = {
        userId: this.id,
        total: 0,
        aServed: ads.length,
        aClicks: {},
      };
      ads.ads.forEach((ad) => {
        const probability = Math.random();
        if (probability < this.interests[ad.ad_group]) {
          this.funnelDepth(ad);
          this.clickResults.aClicks[ad.ad_group] !== undefined ? this.clickResults.aClicks[ad.ad_group] ++ : this.clickResults.aClicks[ad.ad_group] = 1;
          // console.log('aClicks', this.clickResults.aClicks)
        }
      });
      axios.post('http://localhost:8080/sessionEnd', this.clickResults).catch((error) => {
        console.log(error);
      });
    };
    this.pinClicks = () => {
      this.clickResults.pServed = 32;
      this.clickResults.pClicked = 0;
      for (let i = 0; i < 32; i++) {
        const probability = Math.random();
        probability < this.pinClicks ? this.clickResults.pinClicks += 1 : null;
      }
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
    user.login()
      .then((ads) => {
        user.pinClicks();
        user.adClicks(ads.data);
      })
      .catch((err) => { console.log(err); });
  });
};


module.exports = {
  runSim: () => {
    const userList = makeActiveUsers(rawUsers);
    setInterval(() => {makeUsersBehave(userList)}, 15);
  },
};
