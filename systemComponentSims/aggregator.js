///////////////////////////////////////////////////////
////// THIS IS A SIM OF THE AGGREGATOR COMPONENT///////
///////////////////////////////////////////////////////
const sqs = require('./sqsHelpers.js');

const user = {
  userId: 1,
  ads: [{
    id: 1,
    ad_description: 'The Next iPhone X will be awesome',
    ad_url: 'https://www.apple.com/iphone-x/',
    ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/913201720152AM_635_iphone_x.jpeg',
    ad_group: 1,
  },
  {
    id: 2,
    ad_description: 'The Next Pixel will be cool',
    ad_url: 'https://store.google.com/us/product/pixel_2?hl=en-US',
    ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/1042016101841PM_635_google_pixel.jpeg',
    ad_group: 3,
  },
  {
    id: 3,
    ad_description: 'The Next Xperia phone will be sick',
    ad_url: 'https://www.sonymobile.com/us/products/phones/xperia-xz1/',
    ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/831201751753PM_635_sony_xperia_xz1_silver.jpeg',
    ad_group: 5,
  }, {
    id: 1,
    ad_description: 'The Next iPhone X will be awesome',
    ad_url: 'https://www.apple.com/iphone-x/',
    ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/913201720152AM_635_iphone_x.jpeg',
    ad_group: 1,
  },
  {
    id: 2,
    ad_description: 'The Next Pixel will be cool',
    ad_url: 'https://store.google.com/us/product/pixel_2?hl=en-US',
    ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/1042016101841PM_635_google_pixel.jpeg',
    ad_group: 3,
  },
  {
    id: 3,
    ad_description: 'The Next Xperia phone will be sick',
    ad_url: 'https://www.sonymobile.com/us/products/phones/xperia-xz1/',
    ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/831201751753PM_635_sony_xperia_xz1_silver.jpeg',
    ad_group: 5,
  }],
};

let params = {
  MessageAttributes: {
  },
  MessageBody: JSON.stringify(user),
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
};

let counter = 0;

sqs.send(params);
// setInterval(() =>{sqs.send(params)}, 10);
user.userId = 2;
params = {
  MessageAttributes: {
  },
  MessageBody: JSON.stringify(user),
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
};
// sqs.send(params)
setInterval(() => {
  counter += 1;
  console.log(counter);
  sqs.send(params);
}, 10);
user.userId = 3;
params = {
  MessageAttributes: {
  },
  MessageBody: JSON.stringify(user),
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
};
// sqs.send(params)
setInterval(() => {
  counter += 1;
  console.log(counter);
  sqs.send(params);
}, 10);
user.userId = 4;
params = {
  MessageAttributes: {
  },
  MessageBody: JSON.stringify(user),
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
};
// sqs.send(params)
setInterval(() => {
  counter += 1;
  console.log(counter);
  sqs.send(params);
}, 10);
