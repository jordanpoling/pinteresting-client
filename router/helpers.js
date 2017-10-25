const Axios = require('axios');

module.exports = {
  getAds: () => {
    return Axios.get('http://localhost:3001/');
  },
};
