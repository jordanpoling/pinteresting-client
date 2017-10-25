const chai = require('chai');

const chaiHttp = require('chai-http');

const router = require('./index.js');

const describe = chai.describe();
const it = chai.it();

chai.use(chaiHttp);

// routes
const ads = [{
  id: 1,
  ad_description: 'The Next iPhone X will be awesome',
  ad_url: 'https://www.apple.com/iphone-x/',
  ad_img_url: 'http://drop.ndtv.com/TECH/product_database/images/913201720152AM_635_iphone_x.jpeg',
  ad_group: 'Technology'
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
        res.should.have.status(200);
        res.body.should.equal(ads);
        done();
      });
  });
});

// should have "/adClicked" that accepts requests to update funnel depth in advertisements component
describe('/adClicked', () => {

  it('should respond with success on update of advertisements DB', (done) => {
    chai.request(router)
      .get('/adClicked')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.equal({ success: true });
        done();
      });
  });
});

// should have "/sessionEnd" which submits end of session statistics to analytics
describe('/sessionEnd', () => {
  const pData = {
    userId: 12345,
    adClicks: { cat1: 1, cat2: 0, cat3: 5 },
    engagementScore: 0.68,
    scoreDropped: false,
    success: true,
  };
  it('should respond with success and proper JSON format on submission to analytics', (done) => {
    chai.request(router)
      .post('/sessionEnd')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.equal(pData);
        done();
      });
  });
});
/* should receive 200 status on success */
/* should pass properly formatted JSON to process data */
describe('/adClicked', () => {
  it('should pass properly formatted JSON to process data ', (done) => {
    chai.request(router)
      .get('/adClicked')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.equal({ success: true });
        done();
      });
  });
});
