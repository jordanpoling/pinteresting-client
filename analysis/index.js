const express = require('express');
const helpers = require('../router/helpers');
const dbHelpers = require('../database/dbHelpers.js');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const elastic = require('../database/elasticSearch.js');
const AWS = require('aws-sdk');

const counter = 0;
// if (cluster.isMaster) {
//   for (let i = 0; i < cpuCount; i += 1) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker) => {
//     cluster.fork();
//   });
// } else {
console.log('worker initialized');

AWS.config.loadFromPath('../AWSConfig.json');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const params = {
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    'All',
  ],
  QueueUrl: 'https://sqs.us-east-2.amazonaws.com/861910894388/analyticsIn',
  VisibilityTimeout: 10,
  WaitTimeSeconds: 10,
};

const work = (messages) => {
  // console.log('MESSAGEMESSAGEMESSAGE',message);
  messages.forEach(function(element) {
    const body = JSON.parse(element.Body);
    const { score } = body;
    const { id } = body;
    // console.log('score, id', score, id);
    const user = {
      id,
      score,
    };
    dbHelpers.insertHealth(user)
      .then(result =>
        // console.log('result', result);
        dbHelpers.updateUserAverage(result),)
      .then(({ average }) => {
        // console.log('average', average);
        if (average - score > 0.2) {
          elastic.insertCritical(score.userHealth, id);
          //  add a job to casey's queue
        }
      })
      .catch((err) => { console.log(err) });
    elastic.insertHealth(score);
  });
  
};

const processMessages = () => {
  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('Receive Error', err);
    } if (data.Messages) {
      console.log('MESSAGESMESSAGESMESSAGES', data.Messages);
      work(data.Messages);
      messagesToDelete = []
      data.Messages.forEach((message)=>{
        messagesToDelete.push({Id: message.MessageId, ReceiptHandle: message.ReceiptHandle});
      });
      console.log('MESSAGES TO DELETE MESSAGES TO DELETE', messagesToDelete)
      const deleteParams = {
        QueueUrl: 'https://sqs.us-east-2.amazonaws.com/861910894388/analyticsIn',
        Entries: messagesToDelete,
      };

      //  generate an array of ids and receipts to pass to delete batch
      sqs.deleteMessageBatch(deleteParams, (err, data) => {
        if (err) {
          console.log('Delete Error', err);
        } else {
          console.log('MESSAGE DELETED MESSAGE DELETED MESSAGE DELETED', data);
        }
      });
    }
  });
};
setInterval(processMessages, 10);
// }
