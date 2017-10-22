const express = require('express');

// const BodyParser = require('body-parser');

const App = express();

// App.use(BodyParser);

App.get('/', (req, res) => {
  console.log(req);
  res.send();
});

App.post('/test', (req, res) => {
  console.log('post');
  //  send list of clicked ads to tims component
});

App.listen(3000, () => {
  console.log('the server is running!');
});
