const debug = require('debug')('middleware');
const httpStatusCodes = require('http-status-codes');
const unless = require('express-unless');
const constants = require('../../../config/constants.js');
const {
  getAuthTokenFromHeaders,
  verifyJWTtokenAsync,
  isExpiredToken
} = require('../../utils.js');

const {
  HEADERS: {
    AccessControlAllowOrigin,
    AccessControlRequestHeaders,
    AUTHORIZATION,
    AccessControlAllowHeaders,
    AccessControlAllowHeadersValue,
    AccessControlAllowMethods,
    AccessControlAllowMethodsValue,
    ContentType
  }
} = constants;

const setAllowedOrigin = (response, origin) => {
  if (constants.ALLOWED_ORIGINS.indexOf(origin) > -1) {
    debug(`${AccessControlAllowOrigin} set to ${origin}`);
    response.setHeader(AccessControlAllowOrigin, origin);
  }
};

const handleAccessControlAllowHeaders = (request, response) => {
  debug(`req.get(${AccessControlRequestHeaders})=${request.get(AccessControlRequestHeaders)}`);
  const { headers } = request;
  const accessControlRequestHeaders = headers[AccessControlRequestHeaders];
  if (accessControlRequestHeaders && accessControlRequestHeaders.indexOf(AUTHORIZATION) > -1) {
    debug(`inside ${AUTHORIZATION}`);
    response.setHeader(AccessControlAllowHeaders, AccessControlAllowHeadersValue);
  }
};

const allowCORS = (req, res, next) => {
  debug(`req.headers.origin = ${req.headers.origin}`);
  setAllowedOrigin(res, req.headers.origin);
  res.setHeader(AccessControlAllowMethods, AccessControlAllowMethodsValue);
  res.setHeader(AccessControlAllowHeaders, ContentType);
  handleAccessControlAllowHeaders(req, res);

  next();
};

// Middleware to check if the user is authenticated
const ensureUserIsAuthenticated = async ({ headers }, res, next) => {
  const token = getAuthTokenFromHeaders(headers);
  debug(token);
  if (token) {
    try {
      const decodedToken = await verifyJWTtokenAsync(token);
      debug(`decodedToken=${JSON.stringify(decodedToken)}`);
      const { exp: expiryTime } = decodedToken;
      if (!isExpiredToken(expiryTime)) {
        next();
      } else {
        res.status(httpStatusCodes.UNAUTHORIZED).send();
      }
    } catch (err) {
      console.error(err);
      res.status(httpStatusCodes.UNAUTHORIZED).send();
    }
  } else {
    res.status(httpStatusCodes.UNAUTHORIZED).send();
  }
};

ensureUserIsAuthenticated.unless = unless;

module.exports = {
  allowCORS,
  ensureUserIsAuthenticated
};
