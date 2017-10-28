const Sim = require('./userSimulations.js');
const Express = require('express');

const App = Express();

App.listen('8081', () => {
  console.log('user sim connected');
});

Sim.runSim();
