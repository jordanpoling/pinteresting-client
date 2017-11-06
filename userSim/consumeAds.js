const axios = require('axios');
const db = require('../database/dbHelpers.js');
const helpers = require('./helpers');
const sqs = require('./sqsHelpers.js');
const User = require('./User').class;

//  request 10 messages
//    iterate through messages
//      get user and turn into class
//        call userInteraction on that users ads
//  [{id: 12354, ads: [{1},{2},{3}]}, {id: 12354, ads: [{1},{2},{3}]}]
const messages = [{ id: 9875, ads: [ad,ad,ad] },{ id: 9876, ads: [ad,ad,ad] },{ id: 9877, ads: [ad,ad,ad] }];

const makeUsersBehave = (messages) => {
  //  iterate over messages
  let usersAdsObject = {};
  let rawUsers = [];
  messages.forEach((message) => {
    rawUsers.push(message.id);
    usersAdsObject[message.id] = ads;
  });
  db.getUsersForBehavior(rawUsers)
    .then((users) => {
      users.forEach((user) => {
        
      });
    });
  console.log(rawUsers);

  // messages.forEach((message) => {

  // });
  //    for each message, call user interactions for the ads sent for user
};

makeUsersBehave(messages);
