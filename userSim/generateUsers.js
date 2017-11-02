const faker = require('faker');
const loc = require('random-world');
const age = require('random-age');
const csvWriter = require('csv-write-stream');
const fs = require('fs');
const dbHelpers = require('../database/dbHelpers.js');

const writer = csvWriter({ sendHeaders: false });
let globalId = 0;


const pinClickGenerator = () => {
  const active = 0.5;
  const picky = 0.35;
  const occa = 0.3;
  const typeArray = [active, picky, occa];
  return typeArray[Math.floor(Math.random()*typeArray.length)];
};


const genderGenerator = () => {
  const chance = Math.random();
  const gender = chance > 0.5 ? 'male' : 'female';
  const name = faker.name.findName();
  const result = {
    gender,
    name,
  };
  return result;
};

const ageGenerator = () => {
  const chance = Math.random();
  let type;
  chance < 1 ? type = 'adult' : null;
  chance < 0.5 ? type = 'teen' : null;
  chance < 0.10 ? type = 'senior' : null;
  return age({ type });
};


const locationGenerator = () => loc.city();


const ratioThresholdGenerator = () => {
  let ratio = Math.round(Math.random() * 250) / 1000;
  ratio < 0.04 ? ratio *= 4 : null;
  return ratio;
};


const interestGenerator = () => {
  const chance = () => Math.round(Math.random() * 100) / 100;
  const interests = {
    food: chance(),
    fashion: chance(),
    products: chance(),
    sports: chance(),
    travel: chance(),
    events: chance(),
    design: chance(),
    entertainment: chance(),
    'DIY/crafts': chance(),
    photography: chance(),
  };
  return interests;
};


const userGenerator = () => {
  const genderAndName = genderGenerator();
  const userResult = {
    ratio_threshold: ratioThresholdGenerator(),
    // id: globalId,
    interests: JSON.stringify(interestGenerator()),
    pin_click_freq: pinClickGenerator(),
    user_name: genderAndName.name,
    gender: genderAndName.gender,
    location: locationGenerator(),
    age: ageGenerator(),
  };
  return userResult;
};


const runGenerator = (numberOfUsers) => {
  writer.pipe(fs.createWriteStream('users.csv'));
  while (globalId < numberOfUsers) {
    const user = userGenerator();
    writer.write(user);
    globalId += 1;
  }
};


runGenerator(500000);

writer.end();

dbHelpers.bulkInsertUsers('users.csv');

console.log('USER BATCH COMPLETE');
