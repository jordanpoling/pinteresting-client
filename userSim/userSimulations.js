const axios = require('axios');
const db = require('../database/dbHelpers.js');
const helpers = require('../router/helpers');
const AWS = require('aws-sdk');

let count = 0;

AWS.config.loadFromPath('../AWSConfig.json');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });


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


    const send = (params) => {
      sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data.MessageId);
        }
      });
    };


    this.funnelDepth = ({ ad_group, id }) => {
      const probability = Math.random();
      const getFunnelResults = () => {
        let params = {
          MessageAttributes: {
          },
          MessageBody: '',
          QueueUrl: 'https://sqs.us-east-2.amazonaws.com/861910894388/toDatabase',
        };
        if (probability < this.interests[ad_group] * 0.15) {
          console.log('conversion');
          params.MessageBody = JSON.stringify({ group: ad_group, id: 'conversion' });
          send(params);
          // axios.post('http://localhost:8080/adClicked', { group: ad_group, id: 'conversion' }).catch((error) => {
          //   console.log('adClicked', error);
          // });
        } else if (probability < this.interests[ad_group] * 0.5) {
          params.MessageBody = JSON.stringify({ group: ad_group, id: 'engagement' });
          send(params);
          console.log('clicked');
          // axios.post('http://localhost:8080/adClicked', { group: ad_group, id: 'engagement' }).catch((error) => {
          //   console.log('adClicked', error);
          // });
        } else if (probability < this.interests[ad_group]) {
          console.log('impression');
          params.MessageBody = JSON.stringify({ group: ad_group, id: 'impression' });
          send(params);
          axios.post('http://localhost:8080/adClicked', { group: ad_group, id: 'impression' }).catch((error) => {
            console.log('adClicked', error);
          });
        }
      };
      getFunnelResults();
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

      //  this is where the sqs send will go
      const { id } = this.clickResults;
      const score = helpers.calculateScore(this.clickResults);
      const user = {
        id,
        score: score.userHealth,
      };
      const params = {
        MessageAttributes: {
        },
        MessageBody: JSON.stringify(user),
        QueueUrl: 'https://sqs.us-east-2.amazonaws.com/861910894388/analyticsIn',
      };
  
      sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data.MessageId);
        }
      });
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
  // console.log(result);
  return result;
};


const makeUsersBehave = (userLimit) => {
  let minUserId = 9875;
  let maxUserId = 9900;
  while (maxUserId <= userLimit + 9875) {
    // console.log('MAXUSERIDMAXUSERID', maxUserId);
    let users;
    const behavior = () => {
      db.getUsers(minUserId, maxUserId)
        .then((rawUsers) => {
          users = makeActiveUsers(rawUsers);
          users.forEach((user) => {
            user.login()
              .then((ads) => {
                ads ? user.userInteractions(ads.data) : null;
              })
              .catch((err) => { console.log(err); });
          });
        });
    };
    behavior();
    minUserId = maxUserId + 1;
    maxUserId += 3;
  }
};


module.exports = {
  runSim: () => {
    setInterval(() => { makeUsersBehave(10000); }, 1);
  },
};
