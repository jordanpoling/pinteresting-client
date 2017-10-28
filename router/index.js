const express = require('express');
const helpers = require('./helpers');
const bodyParser = require('body-parser');
const dbHelpers = require('../database/dbHelpers.js');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const elastic = require('../database/elasticSearch.js');

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
  });

  App.post('/sessionEnd', (req, res) => {
    const score = helpers.calculateScore(req.body);

    dbHelpers.insertHealth(score);
    elastic.insertHealth(score);

    const avg = dbHelpers.usersAverage(req.body)
      .then((result) => {console.log('USERS AVERAGE =======>>>>>>>>', result)})
      .catch((err) =>{console.log('DB ERROR',err)});

    elastic.insertAverage(avg);

    // console.log('router sessionEnd', req.body);
    const analyticsFormat = {
      userId: 12345,
      aClicks: {
        cat1: 1,
        cat2: 0,
        cat3: 5,
      },
      aServed: 8,
      pClicked: 12,
      pServed: 32,
    };
    // console.log('data', req.body);
    res.status(200)
      .send(analyticsFormat);
  });

  App.listen(8080, () => {
    console.log('the server is listening on 8080');
  });
}

// module.exports = App;
