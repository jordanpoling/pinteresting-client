const dbHelpers = require('../database/dbHelpers.js');
const elastic = require('../database/elasticSearch.js');
const sqs = require('../userSim/sqsHelpers.js');

const fileForLogging = 'analysis.js';
let successful = 0;
const startTime = new Date().getTime();

const work = (messages) => {
  messages.forEach((element) => {
    const body = JSON.parse(element.Body);
    const { engagementScore, userId, adClicks } = body;
    const user = {
      userId,
      engagementScore,
      adClicks,
      scoreDropped: false,
    };
    let longAverage;
    dbHelpers.insertHealth(user)
      .then((result) => {
        //  after inserting the user's health, update their average
        longAverage = result.average;
        return dbHelpers.updateUserAverage(result);
      })
      .then((average) => {
        if (!!((average[0].average * 10) - (longAverage * 10)) / 10 > 0.20) {
          // if their average engagement had dropped > 20% report to ElasticSearch and alert analysis
          user.scoreDropped = true;
          elastic.insertCritical(engagementScore, userId)
            .catch((err) => { elastic.insertError(err, fileForLogging); });
        }
        elastic.insertHealth(engagementScore, userId)
          .catch((err) => { elastic.insertError(err, fileForLogging);; });
        const params = {
          MessageAttributes: {
          },
          MessageBody: JSON.stringify(user),
          QueueUrl: 'sqs.us-west-1.amazonaws.com/854541618844/analytics_client',
        };
        successful += 1;
        sqs.send(params);
        if (successful % 100 === 0) {
          console.log(`${successful} requests successfully received in ${(new Date().getTime() - startTime) / 1000} seconds`);
        }
      })
      .catch((err) => { elastic.insertError(err, fileForLogging);; });
  });
};

const receiveParams = {
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    'All',
  ],
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_analysis',
  VisibilityTimeout: 10,
  WaitTimeSeconds: 10,
};

const deleteParams = {
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_analysis',
  Entries: [],
};


module.exports = {
  runOnce: (check) => {
    if (check === JSON.stringify({ once: true })) {
      console.log('SIM RUNNING');
      sqs.receive(work, receiveParams, deleteParams);
    }
  },
  runSim: (check) => {
    if (check === JSON.stringify({ start: true })) {
      console.log('SIM RUNNING');
      setInterval(() => { sqs.receive(work, receiveParams, deleteParams); }, 10);
    }
  },
};
