const Sim = require('./userSimulations.js');

const Express = require('express');

const App = Express();

App.listen('8080', () => {
  console.log('user sim connected');
});

Sim.firstSim();
