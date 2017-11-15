const helpers = require('./helpers.js');
const sqs = require('./sqsHelpers.js');
const interestGenerator = require('./generateUsers');
const db = require('../database/dbHelpers');


module.exports.Class = class User {
  constructor({
    id, interests, pin_click_freq, user_name, ratio_threshold,
  }) {
    this.clickResults = {
      id,
      total: 0,
      aInteractions: {
        9: 0,
        7: 0,
        8: 0,
        6: 0,
        2: 0,
        1: 0,
        10: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      pClicked: 0,
      pServed: 32,
      aServed: 0,
      totalAdInt: 0,
    };
    this.ratioThreshold = ratio_threshold;
    this.interests = interests;
    this.pinClickFreq = pin_click_freq;
    this.userName = user_name;

    this.calculateScore = ({
      userId, pClicked, pServed, aServed, totalAdInt,
    }) => {
      const result = {
        userHealth: parseFloat((pClicked / pServed) + (aServed / totalAdInt)),
        userId,
        date: new Date(),
      };
      return result;
    };

    this.funnelDepth = ({ main_interest_id, id }) => {
      const probability = Math.random();
      const getFunnelResults = () => {
        const params = {
          MessageAttributes: {
          },
          MessageBody: '',
          QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_advertisements',
        };
        if (probability < this.interests[main_interest_id] * 0.15) {
          this.clickResults.aInteractions[main_interest_id] = 1;
          this.clickResults.totalAdInt += 1;
          params.MessageBody = JSON.stringify({ group: main_interest_id, type: 'conversion', id });
          sqs.send(params);
        } else if (probability < this.interests[main_interest_id] * 0.5) {
          this.clickResults.aInteractions[main_interest_id] = 1;
          this.clickResults.totalAdInt += 1;
          params.MessageBody = JSON.stringify({ group: main_interest_id, type: 'engagement', id });
          sqs.send(params);
        } else {
          if (probability < this.interests[main_interest_id]) {
            this.clickResults.aInteractions[main_interest_id] = 1;
            this.clickResults.totalAdInt += 1;
          }
          params.MessageBody = JSON.stringify({ main_interest_id, type: 'impression', id });
          sqs.send(params);
        }
      };
      getFunnelResults();
    };


    this.changeUserInterests = (id) => {
      const chance = Math.random() * 10;
      if (chance > 0.90) {
        const newInterests = interestGenerator();
        db.reRollInterests(id, newInterests);
      }
    };


    this.userInteractions = (ads) => {
      for (let i = 0; i < 32; i += 1) {
        const probability = Math.random();
        if (probability < this.pinClickFreq) {
          this.clickResults.pClicked += 1;
        }
      }
      this.clickResults.aServed = ads.length;
      ads.forEach((ad) => {
        this.funnelDepth(ad);
      });
      const { id } = this.clickResults;
      const { aInteractions } = this.clickResults;
      const score = helpers.calculateScore(this.clickResults);
      const user = {
        userId: id,
        engagementScore: score.userHealth,
        adClicks: aInteractions,
      };
      if (this.clickResults.aServed / this.clickResults.pServed > this.ratioThreshold) {
        // console.log('RATIO THRESHOLD BROKEN');
      }
      const params = {
        MessageAttributes: {
        },
        MessageBody: JSON.stringify(user),
        QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_analysis',
      };
      // this.changeUserInterests(id);
      sqs.send(params);
    };


    this.login = () => {
      const params = {
        MessageAttributes: {
        },
        MessageBody: JSON.stringify({ userId: this.clickResults.id }),
        QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_request',
      };
      sqs.send(params);
    };
  }
};
