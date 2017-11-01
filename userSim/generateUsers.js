const name = require('node-random-name');
const loc = require('random-world');
const age = require('random-age');


let globalId = 0;

// const user = {
//   userID: 123,
//   interests: {
//     technology: 0.1,
//     skateboarding: 0.25,
//     supreme: 0.25,
//     noodels: 0.50,
//   },
//   pinClickFreq: occa,
//   userName: 'Jordan',
// };


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


const interestGenerator = () => {
  const interests = {
    food: Math.random(),
    fashion: Math.random(),
    products: Math.random(),
    sports: Math.random(),
    travel: Math.random(),
    events: Math.random(),
    design: Math.random(),
    entertainment: Math.random(),
    'DIY/crafts': Math.random(),
    photography: Math.random(),
  };
  return interests;
};

const userGenerator = () => {
  const genderAndName = genderGenerator()
  const userResult = {
    userID: globalId,
    interests: interestGenerator(),
    pinClickFreq: pinClickGenerator(),
    userName: genderAndName.name,
    gender: genderAndName.gender,
    location: locationGenerator(),
    age: ageGenerator(),
  };
  globalId += 1;
  return userResult;
};


console.log(userGenerator());
