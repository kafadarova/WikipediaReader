const https = require('https');
const querystring = require('querystring');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.render('pages/landing');
});

app.get('/result', (req, res) => {
  const result = req.query.search;

  const options = {
    format: 'json',
    action: 'query',
    generator: 'search',
    gsrlimit: '10',
    pilimit: '10',
    pithumbsize: '500',
    prop: 'extracts|pageimages',
    exintro: '1',
    exsentences: '10',
    exlimit: 'max',
    gsrsearch: result,
  };

  const url = `https://de.wikipedia.org/w/api.php?${querystring.stringify(options)}`;
  // console.log(url);

  const httpRequest = https.request(url, (httpResponse) => {
    httpResponse.setEncoding('utf8');

    let responseData = '';
    httpResponse.on('data', (data) => {
      responseData += data;
    });

    httpResponse.on('end', () => {
      const responseObject = JSON.parse(responseData);
      res.render('pages/result', {
        result,
        response: responseObject,
      });
    });
  });
  httpRequest.end();
});

app.listen(8080);


// https://www.mediawiki.org/wiki/API:Main_page
//
// Fertig ausgefüllt mit Suchanfrage „München“:
// https://de.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrlimit=10&pilimit=10&pithumbsize=500&prop=extracts|pageimages&exintro=1&exsentences=10&exlimit=max&gsrsearch=M%C3%BCnchen
