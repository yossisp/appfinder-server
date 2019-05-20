const debug = require('debug')('server:authController');
const httpStatusCodes = require('http-status-codes');
const { OAuth2Client } = require('google-auth-library');
const jsonwebtoken = require('jsonwebtoken');
const constants = require('../../../config/constants.js');

const createGoogleOAuthClient = () => new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET
);

const addUserToRequest = (tokenPayload, request) => {
  const { sub: googleId, picture, given_name: givenName, email } = tokenPayload;
  request.user = {
    googleId,
    givenName,
    picture,
    email
  };
};

const verifyLoginDetails = async (request, response, next) => {
  debug('from verifyLoginDetails');
  debug(`req.originalUrl=${request.originalUrl}`);
  debug(`req.body=${request.body}`);
  const { token } = request.body;
  debug(token);

  try {
    const client = createGoogleOAuthClient();
    const tokenData = await client.verifyIdTokenAsync({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { payload } = tokenData;
    addUserToRequest(payload, request);
    next();
  } catch (err) {
    debug(err);
    response.status(httpStatusCodes.UNAUTHORIZED).send();
  }
};

const generateJWTtoken = (request) => {
  const { googleId, givenName, picture, email } = request.user;
  const JWToptions = {
    expiresIn: constants.AUTH.expiresIn,
    issuer: constants.AUTH.issuer
  };

  const JWTpayload = {
    googleId,
    givenName,
    picture,
    email
  };

  const JWTtoken = jsonwebtoken.sign(JWTpayload,
    process.env.JWT_SECRET,
    JWToptions);

  debug(JWTtoken);

  delete request.user;

  return JWTtoken;
};

const sendToken = (request, response) => {
  try {
    const token = generateJWTtoken(request);
    response.status(httpStatusCodes.OK).send({ token });
  } catch (err) {
    debug(err);
    response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};

module.exports = {
  verifyLoginDetails,
  sendToken
};
