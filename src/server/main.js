const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const bodyParser = require('body-parser');
const HTTP_STATUS = require('http-status-codes');
const https = require('https');
const debug = require('debug')('server:main');
const { getCertificate, printEnv } = require('../utils.js');
const constants = require('../../config/constants.js');
const db = require('../../db/db.js');
const { allowCORS, ensureUserIsAuthenticated } = require('./middeware/middleware.js');
const appRouter = require('./routes/appRouter.js');
const trendsRouter = require('./routes/trendsRouter.js');
const authRouter = require('./routes/authRouter.js');

const { HOSTING: { HEROKU } } = constants;

const main = async () => {
  const app = express();
  let server = null;

  printEnv();

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
  app.use(bodyParser.json({ limit: '10mb', extended: false }));
  app.use(allowCORS);
  app.use(ensureUserIsAuthenticated.unless({
    path: [constants.ROUTES.LOGIN_ENDPOINT()],
    method: 'OPTIONS'
  }));

  app.use(constants.ROUTES.STORE_APP, appRouter());
  app.use(constants.ROUTES.TRENDS, trendsRouter());
  app.use(constants.ROUTES.AUTH, authRouter());

  app.all(constants.ROUTES.CATCH_ALL, (req, res) => {
    debug(req.originalUrl);
    res.status(HTTP_STATUS.BAD_REQUEST).json(constants.ERRORS_TO_USER.INVALID_API_CALL);
  });

  // table is dropped by default, can be set to {force: false} in order not to drop
  db.sequelize.sync({ force: false })
    .then(() => {
      debug('db on');
    });

  // If we are in production we are already running in https
  if (process.env.HTTPS === 'false' || process.env.HOSTING_SERVICE === HEROKU) {
    debug('http server created');
    server = app;
  } else {
    debug('https server created');
    const sslCertificate = await getCertificate();
    server = https.createServer(sslCertificate, app);
  }
  server.listen(constants.PORT);
};

main().catch(e => debug(e));
