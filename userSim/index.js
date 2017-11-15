const Sim = require('../analysis/index');
const Express = require('express');
const bodyParser = require('body-parser');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;

let App = Express();

App.use(bodyParser.json());


if (cluster.isMaster) {
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    cluster.fork();
  });
} else {
  Sim.runSim(JSON.stringify({ start: true }));
  App.get('/start', (req, res, err) => {
    console.log('start hit', req.body);
    if (JSON.stringify(req.body) === JSON.stringify({ start: true })) {
      Sim.runSim(JSON.stringify({ start: true }));
    }
  });

  App.get('/once', (req, res, err) => {
    console.log('once hit', req.body);
    if (JSON.stringify(req.body) === JSON.stringify({ once: true })) {
      Sim.runOnce(JSON.stringify(req.body));
    }
  });

  App.get('/stop', (req, res, err) => {
    if (JSON.stringify(req.body) === JSON.stringify({ stop: true })) {
      App = Express();
    }
  });

  App.listen('8081', () => {
    console.log('user sim connected');
  });
}

