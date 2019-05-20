const _ = require('underscore');
const constants = require('../../config/constants.js');
const App = require('./App.js');
const { getRandomSleepTime, sleep } = require('../utils.js');
const ErrorInfo = require('../../src/classes/ErrorInfo.js');

class LookupJob {
  /**
   * @param {array} incomingApps - array of JSON objects of the following structure:
   * {appId: xyz}
   */
  constructor(incomingApps) {
    this.appsArray = incomingApps;
    this.appsToLookupCount = 0;
    this.resultApps = [];
  }

  async prepare() {
    await this.checksAppsInDB(this.appsArray);
    this.appsArray = LookupJob.getNotResolvedApps(this.appsArray);
    this.calculateAppsToLookup();
  }

  static getNotResolvedApps(appsArray) {
    return _.where(appsArray, {
      isInDB: false
    });
  }

  calculateAppsToLookup() {
    let appsToLookupCount = 0;
    this.appsArray.forEach((elem) => {
      if (!elem.isInDB) {
        appsToLookupCount++;
      }
    });
    this.appsToLookupCount = appsToLookupCount;
  }

  async run() {
    await this.prepare();

    if (this.appsToLookupCount > 0) {
      const lookupCycles = Math.ceil(this.appsToLookupCount / constants.APPS_IN_LOOKUP_BATCH);
      let sleepTime;

      /*
      lookupOneBatch does not use Promise.all on purpose so that there aren't
      too many GET requests to Google play store simultaneously
       */
      for (let i = 0; i < lookupCycles; i++) {
        console.log('--------------------------------------------------------');
        console.log(i * constants.APPS_IN_LOOKUP_BATCH);
        await this.lookupOneBatch(i * constants.APPS_IN_LOOKUP_BATCH);
        sleepTime = getRandomSleepTime();
        console.log(`sleepTime = ${sleepTime}`);
        if (lookupCycles - 1 !== i) {
          await sleep(sleepTime);
        }
      }
    }
  }

  async lookupOneBatch(from) {
    const to = from + constants.APPS_IN_LOOKUP_BATCH;
    const appsToLookup = this.appsArray.slice(from, to);
    await Promise.all(appsToLookup.map(async (app, index) => {
      try {
        const currApp = new App(app.appId);
        await currApp.checkUrl();
        appsToLookup[index].isInDB = currApp.found;
        this.resultApps.push(currApp.getApp());
      } catch (err) {
        new ErrorInfo({
          appId: err.appId,
          message: constants.ERRORS.UNABLE_TO_PARSE.MESSAGE,
          func: this.lookupOneBatch.name,
          file: constants.SRC_FILES_NAMES.LOOKUP_JOB
        }).addToDB();
        console.log(err);
      }
    }));
  }

  async checksAppsInDB(appsArray) {
    const promises = appsArray.map(async (elem) => {
      try {
        const app = new App(elem.appId);
        elem.isInDB = await app.existsInDB();

        if (elem.isInDB) {
          this.resultApps.push(app.getApp());
        }
      } catch (err) {
        new ErrorInfo({
          appId: err.appId,
          message: `${constants.ERRORS.UNABLE_TO_PARSE.MESSAGE}. Original error: ${err}`,
          func: this.checksAppsInDB.name,
          file: constants.SRC_FILES_NAMES.MAIN
        }).addToDB();
        console.log(err);
      }
    });

    await Promise.all(promises);
  }

  // returns array
  async getResultApps() {
    await this.run();
    return this.resultApps;
  }
}

module.exports = LookupJob;
