const https = require('https');
const querystring = require('querystring');
const express = require('express');
const PORT = 8080;

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// Serve static files
app.use('/public', express.static('public'));

// GET request to the homepage
app.get('/', (req, res) => {
  res.render('pages/landing');
});

// Handle GET request
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


  const httpRequest = https.request(url, (httpResponse) => {
    httpResponse.setEncoding('utf8');

    let responseData = '';
    httpResponse.on('data', (data) => {
      responseData += data;
    });

    httpResponse.on('end', () => {
      const responseObject = JSON.parse(responseData);
      res.render('pages/result', {
        response: responseObject,
      });
    });
  });
  httpRequest.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
