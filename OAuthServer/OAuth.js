const express = require('express');
const querystring = require('querystring');
const https = require('https');
const { request } = require('http');

const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const redirectURI = encodeURI('https://heatmap-for-ynab.herokuapp.com/oauth/token');

const app = express();
const port = process.env.PORT || 3000;

let authCode;
let refreshFlag;
let accessToken;
let refreshToken;

// Obtain Authorization Code
app.get('/oauth/redirect', (req, res) => {
  res.redirect(`https://api.youneedabudget.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=read-only`);
});

// Obtain Access/Refresh Token
app.get('/oauth/token', (req, res) => {
  authCode = req.query.code;
  refreshFlag = req.query.refresh === undefined ? 0 : 1;

  let postData;
  //If the refreshflag is present then its a refresh call otherwise get the auth code.
  if (refreshFlag) {
    postData = querystring.stringify({
      'client_id': clientID,
      'client_secret': clientSecret,
      'redirect_uri': redirectURI,
      'grant_type': 'refresh_token',
      'refresh_token': authCode
    });
  } else {
    postData = querystring.stringify({
      'client_id': clientID,
      'client_secret': clientSecret,
      'redirect_uri': redirectURI,
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
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
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

  //Retrieved everything, now sending access/refresh token to app for use.
  function sendAccessToken () {
    res.redirect(`https://heatmapforynab.netlify.app?token=${accessToken}&refresh=${refreshToken}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});