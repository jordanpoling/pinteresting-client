const elasticSearch = require('elasticsearch');

const client = new elasticSearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

module.exports = {
  insertHealth: (engagementScore, userId) => client.index({
    index: 'user_health',
    type: 'user_health',
    body: {
      userId,
      engagementScore,
      date: new Date().toISOString(),
    },
  }),
  insertAverage: (avg, userId) => client.index({
    index: 'health_average',
    type: 'health_average',
    body: {
      avg,
      userId,
      date: new Date().toISOString(),
    },
  }),
  insertCritical: (avg, userId) => client.index({
    index: 'critical_health',
    type: 'critical_health',
    body: {
      avg,
      userId,
      date: new Date().toISOString(),
    },
  }),
  insertError: (error, file) => client.index({
    index: 'error',
    type: 'error',
    body: {
      error,
      file,
      date: new Date().toISOString(),
    },
  }),
};
