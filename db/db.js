const Sequelize = require('sequelize');
const constants = require('../config/constants.js');

const {
  HOSTING: { AWS, HEROKU },
  DB: { DB_NAME, DIALECTS: { POSTGRES, SQLITE } },
  ENV: { PROD }
} = constants;

const env = process.env.NODE_ENV || 'development';
let sequelize;

if (env === PROD && process.env.HOSTING_SERVICE === AWS) {
  console.log(`db: ${AWS}`);
  sequelize = new Sequelize(DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_URL,
    dialect: POSTGRES
  });
} else if (env === PROD && process.env.HOSTING_SERVICE === HEROKU) {
  console.log(`db: ${HEROKU}`);
  console.log(`process.env.DATABASE_URL=${process.env.DATABASE_URL}`);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: POSTGRES
  });
} else {
  console.log(`db: ${SQLITE}`);
  sequelize = new Sequelize(undefined, undefined, undefined, {
    dialect: SQLITE,
    storage: `${__dirname}/data/dev-apps.sqlite`
  });
}

const db = {};

db.appModel = sequelize.import(`${__dirname}/models/appModel.js`);
db.errorsModel = sequelize.import(`${__dirname}/models/errorsModel.js`);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
