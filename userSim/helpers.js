const User = require('./UserClass.js').Class;

module.exports = {
  makeActiveUsers: (usersForClass) => {
    const result = [];
    for (const key in usersForClass) {
      result.push(new User(usersForClass[key]));
    }
    return result;
  },
  getAds: () => {
    return Axios.get('http://localhost:3001/');
  },
  calculateScore: ({
    userId, pClicked, pServed, aServed, totalAdInt,
  }) => {
    const result = {
      userHealth: parseFloat((pClicked / pServed) + (aServed / totalAdInt)),
      userId,
      date: new Date(),
    };
    return result;
  },
};
