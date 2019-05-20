const debug = require('debug')('server:appController');
const httpStatusCodes = require('http-status-codes');
const converter = require('json-2-csv');
const LookupJob = require('../../classes/LookupJob.js');
const constants = require('../../../config/constants.js');

const { HEADERS: { ContentType, ContentTypeCSV } } = constants;

const parseJSONtoCSV = (JSON) => {
  return new Promise((resolve, reject) => {
    converter.json2csv(JSON, (err, csv) => {
      if (err) {
        reject(err);
      } else {
        debug(csv);
        resolve(csv);
      }
    }, { excelBOM: true });
  });
};

const getOneAppInfo = async (request, response) => {
  const { appId } = request.query;
  debug(`appId from server = ${appId}`);
  const job = new LookupJob([{ appId }]);
  const app = await job.getResultApps();

  if (app.length !== 0) {
    // the result is always an array with 1 app so it can be spread
    response.status(httpStatusCodes.OK).json(...app);
  } else {
    response.status(httpStatusCodes.NO_CONTENT).send();
  }
};

const getAppInfoByBulk = async (request, response) => {
  const { body } = request;
  debug(body);
  const job = new LookupJob(body);
  const apps = await job.getResultApps();

  if (apps.length > 0) {
    const appsCSV = await parseJSONtoCSV(apps);
    response.set(ContentType, ContentTypeCSV);
    response.status(httpStatusCodes.OK).send(appsCSV);
  } else {
    response.status(httpStatusCodes.NO_CONTENT).send();
  }
};

module.exports = {
  getOneAppInfo,
  getAppInfoByBulk
};
