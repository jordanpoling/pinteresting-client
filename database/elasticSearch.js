const elasticSearch = require('elasticsearch');

const client = new elasticSearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

module.exports = {
  insert: ({ userHealth, userId }) => {
    return client.index({
      index: 'myindex',
      type: 'userHealth',
      body: {
        userId,
        userHealth,
        date: new Date().toISOString(),
      },
    });
  },
};
