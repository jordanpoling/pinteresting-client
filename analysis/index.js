const express = require('express');
const helpers = require('./helpers');
const dbHelpers = require('../database/dbHelpers.js');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const elastic = require('../database/elasticSearch.js');
const AWS = require('aws-sdk');


dbHelpers.insertHealth(user)
  .then(result => dbHelpers.updateUserAverage(result))
  .then(({ average }) => {
    if (average - score.userHealth > 0.2) {
    // elastic.insertCritical(score.userHealth, id);
    //  add a job to casey's queue
    }
  })
  .catch((err) => { console.log(err); });
// elastic.insertHealth(score);


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
