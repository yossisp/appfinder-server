const express = require('express');
const constants = require('../../../config/constants.js');
const { getTrendInfo } = require('../controllers/trendsController.js');

const router = express.Router();

const trendsRouter = () => {
  router.route(constants.ROUTES.ROOT)
    .get(getTrendInfo);
  return router;
};

module.exports = trendsRouter;
