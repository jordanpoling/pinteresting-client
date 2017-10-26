const express = require('express');

const App = express();

App.get('/', (req, res) => {
  console.log('aggregator get hit');
  res.send({
    ads: [{
      id: 1,
      ad_description: 'The Next iPhone X will be awesome',
      ad_url: 'https://www.apple.com/iphone-x/',
      ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/913201720152AM_635_iphone_x.jpeg',
      ad_group: 'technology',
    },
    {
      id: 2,
      ad_description: 'The Next Pixel will be cool',
      ad_url: 'https://store.google.com/us/product/pixel_2?hl=en-US',
      ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/1042016101841PM_635_google_pixel.jpeg',
      ad_group: 'technology',
    },
    {
      id: 3,
      ad_description: 'The Next Xperia phone will be sick',
      ad_url: 'https://www.sonymobile.com/us/products/phones/xperia-xz1/',
      ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/831201751753PM_635_sony_xperia_xz1_silver.jpeg',
      ad_group: 'technology',
    }],
  });
});

App.listen(3001, () => {
  console.log('the server is listening on 3001');
});

module.exports = App;
