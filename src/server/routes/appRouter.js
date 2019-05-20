const express = require('express');
const constants = require('../../../config/constants.js');
const { getOneAppInfo, getAppInfoByBulk } = require('../controllers/appController.js');

const storeAppRouter = express.Router();

const appRouter = () => {
  storeAppRouter.route(constants.ROUTES.ROOT)
    .get(getOneAppInfo)
    .post(getAppInfoByBulk);

  return storeAppRouter;
};

module.exports = appRouter;
