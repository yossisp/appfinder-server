const fs = require('fs');
const path = require('path');
const debug = require('debug')('utils');
const { promisify } = require('util');
const jsonwebtoken = require('jsonwebtoken');
const constants = require('../config/constants.js');

const { HEADERS: { AUTHORIZATION } } = constants;

const readFile = promisify(fs.readFile);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomSleepTime() {
  let sleepTime = constants.MIN_SLEEP_TIME;
  sleepTime += getRandomInt(constants.SLEEP_RANDOM_ADDITION);
  sleepTime *= constants.MILLISECONDS;
  sleepTime += getRandomInt(constants.SECOND_RANDOM_MAX_ADDITION);
  return sleepTime;
}

const getCertificate = async () => ({
  key: await readFile(path.resolve(constants.CERT.certDir, constants.CERT.keyName)),
  cert: await readFile(path.resolve(constants.CERT.certDir, constants.CERT.certName))
});

const getAuthTokenFromHeaders = (headers) => {
  let token = null;
  const tokenWithBearer = headers[AUTHORIZATION];
  if (tokenWithBearer) {
    token = tokenWithBearer.split(' ')[1];
  }
  return token;
};

const verifyJWTtokenAsync = token => new Promise((resolve, reject) => {
  try {
    const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    resolve(decodedToken);
  } catch (err) {
    debug(err);
    reject(err);
  }
});

const isExpiredToken = tokenExpiryTime => tokenExpiryTime < (Date.now() / 1000);

const printEnv = () => {
  debug(`LOGIN_ENDPOINT=${constants.ROUTES.LOGIN_ENDPOINT()}`);
  debug(`constants.AUTH.callbackURL=${constants.AUTH.callbackURL}`);
  debug(`ENV=${process.env.NODE_ENV}`);
  debug(`PORT=${constants.PORT}`);
  debug(`HTTPS = ${process.env.HTTPS}`);
  debug(`hosting service = ${process.env.HOSTING_SERVICE}`);
};

module.exports = {
  getRandomSleepTime,
  sleep,
  getCertificate,
  getAuthTokenFromHeaders,
  verifyJWTtokenAsync,
  isExpiredToken,
  printEnv
};
