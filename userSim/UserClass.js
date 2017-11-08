const helpers = require('./helpers.js');
const sqs = require('./sqsHelpers.js');


module.exports.Class = class User {
  constructor({
    id, interests, pin_click_freq, user_name, ratio_threshold,
  }) {
    this.clickResults = {
      id,
      total: 0,
      aInteractions: {
        crafts: 0,
        design: 0,
        entertainment: 0,
        events: 0,
        fashion: 0,
        food: 0,
        photography: 0,
        products: 0,
        sports: 0,
        travel: 0,
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

    this.funnelDepth = ({ ad_group, id }) => {
      const probability = Math.random();
      const getFunnelResults = () => {
        const params = {
          MessageAttributes: {
          },
          MessageBody: '',
          QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_advertisements',
        };
        if (probability < this.interests[ad_group] * 0.15) {
          params.MessageBody = JSON.stringify({ group: ad_group, type: 'conversion', id });
          console.log('PARAMS',params)
          sqs.send(params);
        } else if (probability < this.interests[ad_group] * 0.5) {
          params.MessageBody = JSON.stringify({ group: ad_group, type: 'engagement', id });
          console.log('PARAMS',params)
          sqs.send(params);
        } else if (probability < this.interests[ad_group]) {
          params.MessageBody = JSON.stringify({ group: ad_group, type: 'impression', id });
          console.log('PARAMS', params)
          sqs.send(params);
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
      this.clickResults.aServed = ads.length;
      ads.forEach((ad) => {
        // console.log(ad);
        const probability = Math.random();
        if (probability < this.interests[ad.ad_group]) {
          this.funnelDepth(ad);
          // if (this.clickResults.aInteractions[ad.ad_group]) {
          //   const prevClicks = this.clickResults.aInteractions[ad.ad_group];
          //   this.clickResults.aInteractions[ad.ad_group] = prevClicks + 1;
          //   this.clickResults.totalAdInt += 1;
          // } else {
          this.clickResults.aInteractions[ad.ad_group] = 1;
          this.clickResults.totalAdInt += 1;
          // }
        }
      });
      const { id } = this.clickResults;
      const { aInteractions } = this.clickResults;
      const score = helpers.calculateScore(this.clickResults);
      // console.log('clickResults', this.clickResults);
      // console.log('adScore',aServed / totalAdInt);
      // console.log('pinScore',pClicked / pServed);
      const user = {
        userId: id,
        engagementScore: score.userHealth,
        adClicks: aInteractions,
      };
      // console.log(user);
      const params = {
        MessageAttributes: {
        },
        MessageBody: JSON.stringify(user),
        QueueUrl: process.env.CLIENT_ANALYSIS,
      };
      sqs.send(params);
    };


    this.login = () => {
      const params = {
        MessageAttributes: {
        },
        MessageBody: JSON.stringify(this.clickResults.id),
        QueueUrl: process.env.CLIENT_REQUEST,
      };
      sqs.send(params);
    };
  }
};
