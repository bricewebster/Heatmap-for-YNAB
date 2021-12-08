const express = require('express');
const querystring = require('querystring');
const https = require('https');
const { request } = require('http');

const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const codeRedirect = encodeURI('https://heatmap-for-ynab.herokuapp.com/oauth/token');
const tokenRedirect = encodeURI('https://heatmap-for-ynab.herokuapp.com/oauth/token');

const app = express();
const port = process.env.PORT || 3000;

let authCode;
let accessToken;

// Obtain Authorization Code
app.get('/oauth/redirect', (req, res) => {

  res.redirect(`https://api.youneedabudget.com/oauth/authorize?client_id=${clientID}&redirect_uri=${codeRedirect}&response_type=code`);

});

// Obtain Access Token
app.get('/oauth/token', (req, res) => {
  authCode = req.query.code;
  console.log('inhere')
  console.log(`Client ID: ${clientID} \nClient Secret: ${clientSecret} \nAuthorization Code: ${authCode}`);

  let postData = querystring.stringify({
    'client_id': clientID,
    'client_secret': clientSecret,
    'redirect_uri': tokenRedirect,
    'grant_type': 'authorization_code',
    'code': authCode
  });

  let options = {
    hostname: 'api.youneedabudget.com',
    port: 443,
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  let post_req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      accessToken = JSON.parse(chunk);
      accessToken = accessToken.access_token;
      sendAccessToken();
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  post_req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  post_req.write(postData);
  post_req.end();

  function sendAccessToken () {
    console.log(accessToken)
    res.redirect(`https://heatmapforynab.netlify.app?token=${accessToken}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});