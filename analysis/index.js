const express = require('express');
const helpers = require('../userSim/helpers');
const dbHelpers = require('../database/dbHelpers.js');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const elastic = require('../database/elasticSearch.js');
const AWS = require('aws-sdk');
const sqs = require('../userSim/sqsHelpers.js');
const winston = require('winston');

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: './sim.log' }),
  ],
});


// if (cluster.isMaster) {
//   for (let i = 0; i < cpuCount; i += 1) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker) => {
//     cluster.fork();
//   });
// } else {
console.log('worker initialized');

let counter = 0;
const work = (messages) => {
  messages.forEach((element) => {
    const body = JSON.parse(element.Body);
    const { engagementScore } = body;
    const { userId } = body;
    const { adClicks } = body;
    const user = {
      userId,
      engagementScore,
      adClicks,
      scoreDropped: false,
    };
    let longAverage;
    console.log(user);
    dbHelpers.insertHealth(user)
      .then((result) => {
        console.log(result);
        longAverage = result.average;
        return dbHelpers.updateUserAverage(result); })
      .then((average) => {
        if (!!((average[0].average * 10) - (longAverage * 10)) / 10 > 0.05) {
          user.scoreDropped = true;
          elastic.insertCritical(engagementScore, userId)
            .catch((err) => { console.log(err); });
        }
        elastic.insertHealth(engagementScore)
          .catch((err) => { console.log(err); });
        const params = {
          MessageAttributes: {
          },
          MessageBody: JSON.stringify(user),
          QueueUrl: process.env.ANALYTICS_CLIENT,
        };
        sqs.send(params);
      })
      .catch((err) => { console.log(err); });
    logger.log(counter);
    counter += 1;
  });
};

const receiveParams = {
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    'All',
  ],
  QueueUrl: process.env.CLIENT_ANALYSIS,
  VisibilityTimeout: 10,
  WaitTimeSeconds: 10,
};

const deleteParams = {
  QueueUrl: process.env.CLIENT_ANALYSIS,
  Entries: [],
};


// sqs.receive(work,receiveParams,deleteParams);
setInterval(() => { sqs.receive(work, receiveParams, deleteParams); }, 10);
// }
