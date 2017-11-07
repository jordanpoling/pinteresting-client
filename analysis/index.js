const express = require('express');
const helpers = require('../router/helpers');
const dbHelpers = require('../database/dbHelpers.js');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const elastic = require('../database/elasticSearch.js');
const AWS = require('aws-sdk');
const sqs = require('./sqsHelpers.js');


// if (cluster.isMaster) {
//   for (let i = 0; i < cpuCount; i += 1) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker) => {
//     cluster.fork();
//   });
// } else {
console.log('worker initialized');


const work = (messages) => {
  messages.forEach((element) => {
    const body = JSON.parse(element.Body);
    const { score } = body;
    const { id } = body;
    const { adInteractions } = body;
    const user = {
      id,
      score,
      adClicks,
      scoreDropped: false,
    };
    dbHelpers.insertHealth(user)
      .then(result =>
        dbHelpers.updateUserAverage(result))
      .then(({ average }) => {
        if (average - score > 0.2) {
          user.scoreDropped = true;
          elastic.insertCritical(score.userHealth, id);
          //  add a job to casey's queue
        }
      })
      .catch((err) => {console.log(err)});
    elastic.insertHealth(score);
  });
};

const receiveParams = {
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    'All',
  ],
  QueueUrl: 'https://sqs.us-east-2.amazonaws.com/861910894388/analyticsIn',
  VisibilityTimeout: 10,
  WaitTimeSeconds: 10,
};

const deleteParams = {
  QueueUrl: 'https://sqs.us-east-2.amazonaws.com/861910894388/analyticsIn',
  Entries: messagesToDelete,
};

setInterval(sqs.receive(work,receiveParams,deleteParams), 20);
// }
