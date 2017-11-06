const express = require('express');
const helpers = require('./helpers');
const bodyParser = require('body-parser');
const dbHelpers = require('../database/dbHelpers.js');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const elastic = require('../database/elasticSearch.js');
const AWS = require('aws-sdk');


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
    // console.log('router /');
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
    // console.log('router adClicked');
    res.status(200)
      .send();
    //  post job to queue for tim
  });


  App.listen(8080, () => {
    console.log('the server is listening on 8080');
  });
}

// module.exports = App;
