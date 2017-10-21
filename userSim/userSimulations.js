const Axios = require('axios');

module.exports = {
  firstSim: () => {
    setInterval(() => {
      Axios.post('http://localhost:3000/test', {
        adsClicked: 5,
        pinsClicked: 24,
      }).catch((error) => {
        console.log(error);
      });
    }, 10);
  },
};
