const express = require('express');
const helpers = require('./helpers');
const bodyParser = require('body-parser');
const dbHelpers = require('../database/dbHelpers.js');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const elastic = require('../database/elasticSearch.js');
const AWS = require('aws-sdk');


AWS.config.loadFromPath('../AWSConfig.json');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });


if (cluster.isMaster) {
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    cluster.fork();
  });
} else {
  const App = express();


  App.use(bodyParser.json());


  App.get('/', (req, res) => {
    console.log('router /');
    helpers.getAds()
      .then((response) => {
        res.status(200);
        res.send(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });


  App.post('/adclicked', (req, res) => {
    console.log('router adClicked');
    res.status(200)
      .send();
    //  post job to queue for tim
  });


  App.post('/sessionEnd', (req, res) => {
    let count = 1;
    const { id } = req.body;
    const score = helpers.calculateScore(req.body);
    const user = {
      id,
      score: score.userHealth,
    };
    let params = {
      // MessageGroupId: 'analysis',
      MessageAttributes: {
        // user: {
        //   DataType: "String",
        //   StringValue: JSON.stringify(user),
        // },
      },
      MessageBody: JSON.stringify(user),
      QueueUrl: 'https://sqs.us-east-2.amazonaws.com/861910894388/analyticsIn',
    };

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data.MessageId);
      }
    });
    count += 1;
  });

  
  App.listen(8080, () => {
    console.log('the server is listening on 8080');
  });
}

// module.exports = App;
