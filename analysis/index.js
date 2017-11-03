const express = require('express');
const helpers = require('../router/helpers');
const dbHelpers = require('../database/dbHelpers.js');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const elastic = require('../database/elasticSearch.js');
const AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');

const counter = 0;
if (cluster.isMaster) {
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    cluster.fork();
  });
} else {
  console.log('worker initialized');

  AWS.config.loadFromPath('../AWSConfig.json');

  const work = (message) => {
    console.log(message.MessageId);
    const body = JSON.parse(message.Body);
    const { score } = body;
    const { id } = body;
    console.log('score, id', score, id);
    const user = {
      id,
      score,
    };
    dbHelpers.insertHealth(user)
      .then((result) => {
        console.log('result',result);
        return dbHelpers.updateUserAverage(result);
      })
      .then(({ average }) => {
        console.log('average', average);
        if (average - score > 0.2) {
          elastic.insertCritical(score.userHealth, id);
          //  add a job to casey's queue
        }
      })
      .catch((err) => { console.log(err); });
    elastic.insertHealth(score);
  };

  const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-2.amazonaws.com/861910894388/analyticsIn',
    waitTimeSeconds: 0,
    handleMessage: (message, done) => {
      work(message);
      done();
    },
    sqs: new AWS.SQS(),

  });

  app.on('error', (err) => {
    console.log(err.message);
  });

  app.start();
}
