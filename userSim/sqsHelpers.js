const AWS = require('aws-sdk');

// AWS.config.loadFromPath('../AWSConfig.json');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

module.exports = {
  send: (params) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data.MessageId);
      }
    });
  },
  receive: (callback, receiveParams, deleteParams) => {
    sqs.receiveMessage(receiveParams, (err, data) => {
      if (err) {
        console.log('Receive Error', err);
      } if (data.Messages) {
        // console.log(data)
        callback(data.Messages);
        deleteParams.Entries = [];
        data.Messages.forEach((message) => {
          deleteParams.Entries.push({
            Id: message.MessageId, ReceiptHandle: message.ReceiptHandle,
          });
        });
        sqs.deleteMessageBatch(deleteParams, (err, data) => {
          if (err) {
            console.log('Delete Error', err);
          } else {
            console.log('MESSAGE DELETED MESSAGE DELETED MESSAGE DELETED', data);
          }
        });
      }
    });
  },
};
