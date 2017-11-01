const name = require('node-random-name');
const loc = require('random-world');
const age = require('random-age');
const csvWriter = require('csv-write-stream');
const fs = require('fs');

const writer = csvWriter();
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
  const result = {
    gender,
    name: name({ gender }),
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
    ratioThreshold: ratioThresholdGenerator(),
    userID: globalId,
    interests: JSON.stringify(interestGenerator()),
    pinClickFreq: pinClickGenerator(),
    userName: genderAndName.name,
    gender: genderAndName.gender,
    location: locationGenerator(),
    age: ageGenerator(),
  };
  globalId += 1;
  return userResult;
};

writer.pipe(fs.createWriteStream('users.csv'));
writer.write(userGenerator());
writer.write(userGenerator());
writer.write(userGenerator());
writer.end();
console.log(userGenerator());
