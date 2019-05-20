const debug = require('debug')('server:trendsController');
const httpStatusCodes = require('http-status-codes');
const googleTrends = require('google-trends-api');
const Trend = require('../../classes/Trend.js');
const constants = require('../../../config/constants.js');

const getTrendJSON = async (appName) => {
  debug(`appName=${appName}`);
  const today = new Date(Date.now());
  const dateOf30daysBefore = new Date(today);
  dateOf30daysBefore.setDate(
    today.getDate() - constants.GOOGLE_TRENDS_DAYS_PERIOD
  );
  return googleTrends.interestOverTime({
    keyword: appName,
    startTime: dateOf30daysBefore,
    endTime: today
  });
};

const getTrendInfo = async (request, response) => {
  const { appName } = request.query;
  debug(`appId from trends = ${appName}`);
  try {
    const trendJSON = await getTrendJSON(appName);
    const data = JSON.parse(trendJSON);
    const trend = new Trend(data.default.timelineData);
    response.status(httpStatusCodes.OK).json(trend.getTrendData());
  } catch (err) {
    response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};

module.exports = {
  getTrendInfo
};
