const express = require('express');

const helpers = require('./helpers');

const bodyParser = require('body-parser');

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
  console.log('router sessionEnd');
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
