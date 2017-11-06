module.exports.Class = class User {
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
      const getFunnelResults = () => {
        const params = {
          MessageAttributes: {
          },
          MessageBody: '',
          QueueUrl: 'https://sqs.us-east-2.amazonaws.com/861910894388/toDatabase',
        };
        if (probability < this.interests[ad_group] * 0.15) {
          params.MessageBody = JSON.stringify({ group: ad_group, id: 'conversion' });
          sqs.send(params);
        } else if (probability < this.interests[ad_group] * 0.5) {
          params.MessageBody = JSON.stringify({ group: ad_group, id: 'engagement' });
          sqs.send(params);
        } else if (probability < this.interests[ad_group]) {
          params.MessageBody = JSON.stringify({ group: ad_group, id: 'impression' });
          sqs.send(params);
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
      sqs.send(params);
    };


    this.login = () => {
      const params = {
        MessageAttributes: {
        },
        MessageBody: '',
        QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_request',
      };
      sqs.send(params);
    };
  }
};
