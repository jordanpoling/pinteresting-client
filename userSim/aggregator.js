const sqs = require('./sqsHelpers.js');

const user = {
  userId: 9876,
  ads: [{
    id: 1,
    ad_description: 'The Next iPhone X will be awesome',
    ad_url: 'https://www.apple.com/iphone-x/',
    ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/913201720152AM_635_iphone_x.jpeg',
    ad_group: 'sports',
  },
  {
    userId: 2,
    ad_description: 'The Next Pixel will be cool',
    ad_url: 'https://store.google.com/us/product/pixel_2?hl=en-US',
    ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/1042016101841PM_635_google_pixel.jpeg',
    ad_group: 'fashion',
  },
  {
    userId: 3,
    ad_description: 'The Next Xperia phone will be sick',
    ad_url: 'https://www.sonymobile.com/us/products/phones/xperia-xz1/',
    ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/831201751753PM_635_sony_xperia_xz1_silver.jpeg',
    ad_group: 'travel',
  }],
};

let params = {
  MessageAttributes: {
  },
  MessageBody: JSON.stringify(user),
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
};


setInterval(() =>{sqs.send(params)}, 1000);
user.userId = 9979;
params = {
  MessageAttributes: {
  },
  MessageBody: JSON.stringify(user),
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
};
setInterval(() =>{sqs.send(params)}, 1000);
user.userId = 9977;
params = {
  MessageAttributes: {
  },
  MessageBody: JSON.stringify(user),
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
};
setInterval(() =>{sqs.send(params)}, 1000);
user.userId = 9978;
params = {
  MessageAttributes: {
  },
  MessageBody: JSON.stringify(user),
  QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
};
setInterval(() =>{sqs.send(params)}, 1000);
