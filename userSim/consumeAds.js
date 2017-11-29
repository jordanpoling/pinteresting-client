const db = require('../database/dbHelpers.js');
const sqs = require('./sqsHelpers.js');
const User = require('./UserClass.js').Class;
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const elastic = require('../database/elasticSearch.js');

let successful = 0;
const startTime = new Date().getTime();
const fileForLogging = 'consumeAds.js';

if (cluster.isMaster) {
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    cluster.fork();
  });
} else {
  const makeUsersBehave = (sqsMessages) => {
    const usersAdsObject = {};
    const rawUsers = [];
    sqsMessages.forEach((message) => {
      message = JSON.parse(message.Body);
      rawUsers.push(message.userId);
      usersAdsObject[message.userId] = message.ads;
    });
    db.getUsersForBehavior(rawUsers)
      .then((users) => {
        users.forEach((user) => {
          const userClass = new User(user);
          userClass.userInteractions(usersAdsObject[user.id]);
          successful += 1;
          if (successful % 100 === 0) {
            console.log(`${successful} requests successfully received in ${(new Date().getTime() - startTime) / 1000} seconds`);
          }
        });
      })
      .catch((err) => { elastic.insertError(err, fileForLogging); });
  };


  const receiveParams = {
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      'All',
    ],
    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
    VisibilityTimeout: 10,
    WaitTimeSeconds: 10,
  };

  const deleteParams = {
    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
  };


  // sqs.receive(makeUsersBehave, receiveParams, deleteParams);

  setInterval(() => { sqs.receive(makeUsersBehave, receiveParams, deleteParams); }, 1);
}
