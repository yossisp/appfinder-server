const express = require('express');
const constants = require('../../../config/constants.js');
const {
  verifyLoginDetails,
  sendToken
} = require('../controllers/authController.js');


const storeAppRouter = express.Router();

const authRouter = () => {
  storeAppRouter.post(constants.ROUTES.LOGIN,
    verifyLoginDetails, sendToken);
  return storeAppRouter;
};

module.exports = authRouter;
