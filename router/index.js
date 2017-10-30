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
    const userId = req.body.userId;
    let avg;
    // dbHelpers.usersAverage(req.body).then((result)=>{avg = result});
    dbHelpers.usersAverage(req.body).then((result) => {
      avg = result[0].avg;
      const user = {
        avg,
        userId,
      };
      console.log('USERUSER', user)
      dbHelpers.updateUserAverage(user).catch((err)=>{console.log(err)});
    }).catch((err)=>{console.log(err)});

    const score = helpers.calculateScore(req.body);
    // console.log('USERUSERUSER', user);
    dbHelpers.insertHealth(score);
    elastic.insertHealth(score);
    //  insert if average is null or if averade is over a day old
    //    else check average to stored average
    //    if it has dropped by 15%
    //      write to elastic warning and emit score to casey

    // elastic.insertAverage(avg);


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
