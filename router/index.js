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
    const id = req.body.userId;
    const score = helpers.calculateScore(req.body);
    const user = {
      id,
      score: score.userHealth,
    };
    console.log('USERUSERUSER', user);
    dbHelpers.insertHealth(user)
      .then((result) => {
        console.log('result', result);
        dbHelpers.updateUserAverage(result)
          .then(({ average }) => {
            console.log('RESULT', average, 'CURRENT', score.userHealth, 'DIFF', average - score.userHealth);
            if (average - score.userHealth > 0.2) {
              console.log('CRITICAL SCORE DROP!!!! ==>>>>', average- score.userHealth);
              elastic.insertCritical(score.userHealth, id);
            }
          })
          .catch((err) => { console.log(err); });
      });
    elastic.insertHealth(score);
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
    res.status(200)
      .send(analyticsFormat);
  });

  App.listen(8080, () => {
    console.log('the server is listening on 8080');
  });
}

// module.exports = App;
