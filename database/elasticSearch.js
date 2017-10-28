const elasticSearch = require('elasticsearch');

const client = new elasticSearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

module.exports = {
  insertHealth: ({ userHealth, userId }) => {
    return client.index({
      index: 'user_health',
      type: 'user_health',
      body: {
        userId,
        userHealth,
        date: new Date().toISOString(),
      },
    });
  },
  insertAverage : ({ avg, user_id }) => {
    return client.index({
      index: 'health_average',
      type: 'health_average',
      body: {
        avg,
        user_id,
        date: new Date().toISOString(),
      },
    });
  }
};
