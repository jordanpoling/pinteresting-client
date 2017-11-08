const db = require('../database/dbHelpers.js');
const sqs = require('./sqsHelpers.js');
const User = require('./UserClass.js').Class;


const makeUsersBehave = (sqsMessages) => {
  const usersAdsObject = {};
  const rawUsers = [];
  sqsMessages.forEach((message) => {
    // console.log(message.Body.user)
    message = JSON.parse(message.Body);
    rawUsers.push(message.userId);
    usersAdsObject[message.userId] = message.ads;
  });

  console.log(rawUsers);

  db.getUsersForBehavior(rawUsers)
    .then((users) => {
      // console.log(users)
      users.forEach((user) => {
        const userClass = new User(user);
        userClass.userInteractions(usersAdsObject[user.id]);
      });
    })
    .catch((err) => {console.log(err)});
};

const receiveParams = {
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    'All',
  ],
  QueueUrl: process.env.CLIENT_RESPONSE,
  VisibilityTimeout: 10,
  WaitTimeSeconds: 10,
};

const deleteParams = {
  QueueUrl: process.env.CLIENT_RESPONSE,
};


// sqs.receive(makeUsersBehave, receiveParams, deleteParams)

setInterval(() =>{sqs.receive(makeUsersBehave, receiveParams, deleteParams)}, 50);

