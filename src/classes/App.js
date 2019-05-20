const axios = require('axios');
const jsdom = require('jsdom');
const HTTP_STATUS = require('http-status-codes');
const constants = require('../../config/constants.js');
const ErrorInfo = require('./ErrorInfo.js');
const db = require('../../db/db.js');

const { JSDOM } = jsdom;


class App {
  constructor(appId) {
    if (appId === null || appId === undefined || appId === constants.BLANK) {
      const e = new Error(constants.ERRORS.BAD_APP_ID);
      e.appId = constants.BLANK;
      throw e;
    }
    this.appId = appId.trim();
    this.appId = this.appId.toLowerCase();
    this.appStore = null;
    this.appStoreURL = this.getLookupURL();
    if (this.appStoreURL === null) {
      const e = new Error(constants.ERRORS.UNABLE_TO_PARSE.MESSAGE);
      e.appId = this.appId;
      throw e;
    }
    this.found = false;
    this.appName = constants.DEFAULT;
    this.contentRating = constants.DEFAULT;
    this.category = constants.DEFAULT;
    this.version = constants.DEFAULT;
    this.image = null;
  }

  getLookupURL() {
    const googleAppRegex = RegExp(constants.REGEX_GOOGLE_APP);
    const num = parseInt(this.appId, constants.PARSE_INT_RADIX);
    if (googleAppRegex.test(this.appId)) {
      this.appStore = constants.STORES.ANDROID;
      return `${constants.GOOGLE_APP_STORE_URL}${this.appId}`;
    } if (Number.isInteger(num)) {
      this.appStore = constants.STORES.IOS;
      return `${constants.APPLE_APP_STORE_URL}${this.appId}`;
    }
    return null;
  }

  getApp() {
    return {
      appId: this.appId,
      appStore: this.appStore,
      appStoreURL: this.appStoreURL,
      found: this.found,
      appName: this.appName,
      contentRating: this.contentRating,
      category: this.category,
      version: this.version,
      image: this.image
    };
  }

  setApp(app) {
    this.appId = app.appId;
    this.appStore = app.appStore;
    this.found = app.found;
    this.appName = app.appName;
    this.contentRating = app.contentRating;
    this.category = app.category;
    this.version = app.version;
    this.image = app.image;
  }

  setAndroidAppInfo(JSDOMparsedHTML) {
    const infoArray = JSDOMparsedHTML.window.document.querySelectorAll(constants.HTML.META);
    const category = JSDOMparsedHTML.window.document.querySelectorAll(constants.HTML.ANDROID_CATEGORY);
    const version = JSDOMparsedHTML.window.document.querySelectorAll('div');

    infoArray.forEach((elem) => {
      if (elem.attributes[0].value === constants.HTML.NAME) {
        this.appName = elem.content;
      }

      if (elem.attributes[0].value === constants.HTML.CONTENT_RATING) {
        this.contentRating = elem.content;
      }

      if (elem.attributes[0].value === 'image') {
        this.image = elem.content;
      }
    });

    this.category = category[0].text;

    version.forEach((elem) => {
      if (elem.textContent === constants.HTML.ANDROID_VERSION) {
        this.version = elem.nextSibling.children[0].children[0].textContent;
      }
    });
  }

  parseIOSVersion(appVersion) {
    if (appVersion[0] !== undefined) {
      const result = appVersion[0].textContent.split(' ');
      this.version = result[constants.HTML.IOS_VERSION_INDEX];
    }
  }

  parseIOSCategory(category) {
    if (!category[0]) {
      new ErrorInfo(
        {
          appId: this.appId,
          message: err.message,
          func: this.checkUrl.name,
          file: constants.SRC_FILES_NAMES.APP
        }
      ).addToDB();
    } else {
      const { innerHTML } = category[0];
      const jsonContent = JSON.parse((innerHTML));
      this.category = jsonContent.applicationCategory;
    }
  }

  setIOSAppInfo(appPageDOM) {
    const appNames = appPageDOM.window.document.querySelectorAll(constants.HTML.IOS_META_QUERY);
    const contentRating = appPageDOM.window.document.querySelectorAll(constants.HTML.IOS_CONTENT_RATING);
    const version = appPageDOM.window.document.querySelectorAll(constants.HTML.IOS_VERSION);
    const category = appPageDOM.window.document.querySelectorAll(constants.HTML.IOS_CATEGORY);

    for (let i = 0; i < appNames.length; i++) {
      if (appNames[i].getAttribute(constants.HTML.IOS_APP_NAME_ATTR) === constants.HTML.IOS_APP_TITLE) {
        this.appName = appNames[i].content;
      }

      if (appNames[i].getAttribute(constants.HTML.IOS_APP_NAME_ATTR) === constants.HTML.IOS_IMG) {
        this.image = appNames[i].content;
      }
    }

    this.contentRating = contentRating[0].textContent;
    this.parseIOSVersion(version);
    this.parseIOSCategory(category);
  }

  setAppFromHTML(htmlResponse) {
    const { data } = htmlResponse;
    const appPageDOM = new JSDOM(data);

    if (this.appStore === constants.STORES.IOS) {
      this.setIOSAppInfo(appPageDOM);
    } else if (this.appStore === constants.STORES.ANDROID) {
      this.setAndroidAppInfo(appPageDOM);
    }
  }

  async checkUrl() {
    try {
      const response = await axios.get(this.appStoreURL);
      this.setAppFromHTML(response);
      this.found = true;
      await this.addAppToDB();
    } catch (err) {
      let httpStatus;
      if (err.request && err.request.res) {
        httpStatus = err.request.res.statusCode;
      }
      if (httpStatus !== undefined && httpStatus === HTTP_STATUS.NOT_FOUND) {
        await this.addAppToDB();
        console.log('App doesn\'t exist');
      } else {
        new ErrorInfo(
          {
            appId: this.appId,
            message: err.message,
            func: this.checkUrl.name,
            file: constants.SRC_FILES_NAMES.APP
          }
        ).addToDB();
        console.log(`Unknown error trying to lookup app id ${this.appId}`);
      }
    }
  }

  /*
  returns true/false depending on whether the app exists in the DB
  regardless whether its status is found or not
   */
  async existsInDB() {
    let result = {
      dataValues: null
    };
    try {
      const tmpResult = await db.appModel.findOne({
        where: {
          appId: this.appId
        }
      });

      if (tmpResult) {
        result = tmpResult;
        this.setApp(result.dataValues);
        return true;
      }
    } catch (err) {
      new ErrorInfo({
        appId: this.appId,
        message: err.message,
        func: this.existsInDB.name,
        file: constants.SRC_FILES_NAMES.APP
      }).addToDB();
    }
    return false;
  }

  async addAppToDB() {
    try {
      await db.appModel.create(this.getApp());
      console.log(`app ${this.appId} successfully added to db`);
    } catch (err) {
      new ErrorInfo({
        appId: this.appId,
        message: err.message,
        func: this.addAppToDB.name,
        file: constants.SRC_FILES_NAMES.APP
      }).addToDB();
      console.error(err);
    }
  }
}

module.exports = App;
