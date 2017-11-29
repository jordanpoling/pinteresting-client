const AWS = require('aws-sdk');
const elastic = require('../database/elasticSearch.js');

const fileForLogging = 'sqsHelpers.js';

AWS.config.loadFromPath('../AWSConfig.json');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

module.exports = {
  send: (params) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        elastic.insertError(err, fileForLogging);
      }
    });
  },
  receive: (callback, receiveParams, deleteParams) => {
    sqs.receiveMessage(receiveParams, (err, data) => {
      if (err) {
        elastic.insertError(err, fileForLogging);
      } if (data.Messages) {
        callback(data.Messages);
        deleteParams.Entries = [];
        data.Messages.forEach((message) => {
          deleteParams.Entries.push({
            Id: message.MessageId, ReceiptHandle: message.ReceiptHandle,
          });
        });
        sqs.deleteMessageBatch(deleteParams, (err, data) => {
          if (err) {
            elastic.insertError(err, fileForLogging);
          }
        });
      }
    });
  },
};
