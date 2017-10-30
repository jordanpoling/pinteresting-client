const Axios = require('axios');

module.exports = {
  getAds: () => {
    return Axios.get('http://localhost:3001/');
  },
  calculateScore: ({
    userId, pClicked, pServed, aServed, aInteractions,
  }) => {
    console.log('AD INTERACTIONS', aInteractions);
    const result = {
      userHealth: parseFloat((pClicked / pServed) + (aServed + aInteractions)),
      userId,
      date: new Date(),
    };
    return result;
  },
};
