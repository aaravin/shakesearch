const express = require('express');
const path = require('path');
const Shakesearch = require('./shakesearch.js');

const shakesearch = new Shakesearch('./completeworks.txt');
shakesearch.preprocess();

const app = express();

app.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, './static/index.html'));
});

app.get('/search', function(req, res) {
  const searchTerm = req.query.q;
  if (searchTerm.length <= 2) {
    res.status(400).send('Search string too short');
  } else {
    const output = shakesearch.search(req.query.q);
    res.send(output);
  }
});

app.use(express.static('./static'));

app.all('*', function(req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 3001);