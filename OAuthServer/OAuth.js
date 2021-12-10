const express = require('express');
const querystring = require('querystring');
const https = require('https');
const { request } = require('http');

const clientID = '496a5e03e32f6754ccf5538dbd64bdf76bcfdf6a9b6ea950b11056653a57ae23';
const clientSecret = '1e5cc9c46d5b9c46d00b57969ede4f794bcbafa251c0722b8a3492ecd8fbcee2';
const codeRedirect = encodeURI('http://localhost:3000/oauth/token');
const tokenRedirect = encodeURI('http://localhost:3000/oauth/token');

const app = express();
const port = process.env.PORT || 3000;

let authCode;
let refreshFlag;
let accessToken;
let refreshToken;

// Obtain Authorization Code
app.get('/oauth/redirect', (req, res) => {

  res.redirect(`https://api.youneedabudget.com/oauth/authorize?client_id=${clientID}&redirect_uri=${codeRedirect}&response_type=code&scope=read-only`);

});

// Obtain Access Token
app.get('/oauth/token', (req, res) => {
  authCode = req.query.code;
  console.log('rparam', req.query.refresh)
  refreshFlag = req.query.refresh === undefined ? 0 : 1;
  console.log('rFlag', refreshFlag)
  console.log('inhere')
  console.log(`Client ID: ${clientID} \nClient Secret: ${clientSecret} \nAuthorization Code: ${authCode}`);

  let postData;
  if (refreshFlag) {
    console.log('refreshed')
    postData = querystring.stringify({
      'client_id': clientID,
      'client_secret': clientSecret,
      'redirect_uri': tokenRedirect,
      'grant_type': 'refresh_token',
      'refresh_token': authCode
    });
  } else {
    console.log('original')
    postData = querystring.stringify({
      'client_id': clientID,
      'client_secret': clientSecret,
      'redirect_uri': tokenRedirect,
      'grant_type': 'authorization_code',
      'code': authCode
    });
  }


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
      let params = JSON.parse(chunk);
      accessToken = params.access_token;
      refreshToken = params.refresh_token;
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
    res.redirect(`http://localhost:5000?token=${accessToken}&refresh=${refreshToken}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});