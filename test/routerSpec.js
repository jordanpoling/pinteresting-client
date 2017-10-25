const chai = require('chai');

const chaiHttp = require('chai-http');

const router = require('../router/index.js');

const should = chai.should();

chai.use(chaiHttp);

const ads = [{
  id: 1,
  ad_description: 'The Next iPhone X will be awesome',
  ad_url: 'https://www.apple.com/iphone-x/',
  ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/913201720152AM_635_iphone_x.jpeg',
  ad_group: 'Technology',
},
{
  id: 2,
  ad_description: 'The Next Pixel will be cool',
  ad_url: 'https://store.google.com/us/product/pixel_2?hl=en-US',
  ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/1042016101841PM_635_google_pixel.jpeg',
  ad_group: 'Technology',
},
{
  id: 3,
  ad_description: 'The Next Xperia phone will be sick',
  ad_url: 'https://www.sonymobile.com/us/products/phones/xperia-xz1/',
  ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/831201751753PM_635_sony_xperia_xz1_silver.jpeg',
  ad_group: 'Technology',
}];


describe('/', () => {
  it('should respond with ads for user', (done) => {
    chai.request(router)
      .get('/')
      .end((err, res) => {
        const result = JSON.stringify(res.body.ads);
        res.status.should.equal(200);
        result.should.equal(JSON.stringify(ads));
        done();
      });
  });
});


describe('/adClicked', () => {
  it('should respond with success on update of advertisements DB', (done) => {
    chai.request(router)
      .post('/adClicked')
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
  });
});

describe('/sessionEnd', () => {
  const pData = JSON.stringify({
    userId: 12345,
    aClicks: {
      cat1: 1,
      cat2: 0,
      cat3: 5,
    },
    aServed: 8,
    pClicked: 12,
    pServed: 32,
  });
  it('should respond with success and proper JSON format on submission to analytics', (done) => {
    chai.request(router)
      .post('/sessionEnd')
      .end((err, res) => {
        const result = JSON.stringify(res.body);
        res.should.have.status(200);
        result.should.equal(pData);
        done();
      });
  });
});
