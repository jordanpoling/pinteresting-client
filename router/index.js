const express = require('express');

const helpers = require('./helpers');

const bodyParser = require('body-parser');

const App = express();

App.use(bodyParser.json());

App.get('/', (req, res) => {
  helpers.getAds()
    .then((response) => {
      // console.log(response.data);
      res.status(200);
      res.send(response.data);
    })
    .catch((err) => {
      // console.log(err);
    });
});

App.post('/adclicked', (req, res) => {
  res.status(200)
    .send();
});

App.post('/sessionEnd', (req, res) => {
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

module.exports = App;
