const db = require('../database/dbHelpers.js');
const helpers = require('./helpers');
const sqs = require('./sqsHelpers.js');
const User = require('./UserClass.js').Class;

//  request 10 messages
//    iterate through messages
//      get user and turn into class
//        call userInteraction on that users ads
//  [{id: 12354, ads: [{1},{2},{3}]}, {id: 12354, ads: [{1},{2},{3}]}]
// const messages = [{ id: 9875, ads: [ad, ad, ad] }, { id: 9876, ads: [ad, ad, ad] }, { id: 9877, ads: [ad, ad, ad] }];

const makeUsersBehave = (sqsMessages) => {
  const usersAdsObject = {};
  const rawUsers = [];
  // console.log(sqsMessages)
  sqsMessages.forEach((message) => {
    message = JSON.parse(message.Body);
    console.log('userId', message.userId);
    rawUsers.push(message.userId);
    // console.log(rawUsers);
    usersAdsObject[message.userId] = message.ads;
  });
  console.log('rawUsers',rawUsers);
  db.getUsersForBehavior(rawUsers)
    .then((users) => {
      // console.log('USERS',users)
      users.forEach((user) => {
        const userClass = new User(user);
        console.log('user ID', user.id);
        console.log('user Ads', usersAdsObject[user.id]);
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
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
  VisibilityTimeout: 10,
  WaitTimeSeconds: 10,
};

const deleteParams = {
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
  Entries: [],
};

sqs.receive(makeUsersBehave, receiveParams, deleteParams);

