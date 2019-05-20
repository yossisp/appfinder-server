const db = require('../../db/db.js');

class ErrorInfo {
  constructor({
    appId, message, func, file
  }) {
    this.appId = appId;
    this.message = message;
    this.func = func;
    this.file = file;
  }

  getJSON() {
    return {
      appId: this.appId,
      message: this.message,
      func: this.func,
      file: this.file
    };
  }

  addToDB() {
    db.errorsModel.create(this.getJSON());
  }
}

module.exports = ErrorInfo;
