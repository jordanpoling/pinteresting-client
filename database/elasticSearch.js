const elasticSearch = require('elasticsearch');

const client = new elasticSearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

module.exports = {
  insertHealth: ({ userHealth, userId }) => client.index({
    index: 'user_health',
    type: 'user_health',
    body: {
      userId,
      userHealth,
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
};
