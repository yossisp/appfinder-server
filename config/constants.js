const constants = {
  PORT: process.env.PORT || 3000,
  GOOGLE_APP_STORE_URL: 'https://play.google.com/store/apps/details?id=',
  APPLE_APP_STORE_URL: 'https://itunes.apple.com/us/app/id',
  DEFAULT: 'default',
  PARSE_INT_RADIX: 10,
  APPS_IN_LOOKUP_BATCH: 20,
  MIN_SLEEP_TIME: 5,
  SLEEP_RANDOM_ADDITION: 3,
  MILLISECONDS: 1000,
  SECOND_RANDOM_MAX_ADDITION: 555,
  GOOGLE_TRENDS_DAYS_PERIOD: 32,
  BLANK: '',
  STORES: {
    IOS: 'ios',
    ANDROID: 'android'
  },
  HTML: {
    NAME: 'name',
    CONTENT_RATING: 'contentRating',
    META: 'meta',
    IOS_META_QUERY: 'meta[property]',
    IOS_APP_TITLE: 'og:title',
    IOS_IMG: 'og:image',
    IOS_CONTENT_RATING: 'span.badge.badge--product-title',
    IOS_APP_NAME_ATTR: 'property',
    ANDROID_CATEGORY: 'a[itemprop]',
    ANDROID_VERSION: 'Current Version',
    IOS_VERSION: '.whats-new__latest__version',
    IOS_CATEGORY: 'script[name="schema:software-application"]',
    IOS_VERSION_INDEX: 1
  },
  SRC_FILES_NAMES: {
    MAIN: 'main.js',
    UTILS: 'utils.js',
    LOOKUP_JOB: 'LookupJob.js',
    APP: 'app.js'
  },
  ALLOWED_ORIGINS: ['http://localhost:3005', 'https://localhost:3005',
    'http://localhost:80', 'http://localhost', 'https://localhost:80', 'https://accounts.google.com',
    'http://localhost:3005', 'https://app-finder-ui.netlify.com'],
  REGEX_GOOGLE_APP: /[a-zA-Z]/,
  SCIENTIFIC_NOTATION: 'E+',
  ERRORS: {
    UNABLE_TO_PARSE: {
      CODE: 0,
      MESSAGE: 'Unable to parse appId'
    },
    STORE_NOT_EXISTS: {
      CODE: 1,
      MESSAGE: 'App store does not exist'
    },
    UNKNOWN: 'Unknown error trying to lookup app id',
    ENOTFOUND: 'ENOTFOUND',
    BAD_APP_ID: 'Bad appId'
  },
  DB: {
    MODELS: {
      APP: 'app',
      ERRORS: 'errors'
    },
    DB_NAME: 'appstore',
    DIALECTS: {
      POSTGRES: 'postgres',
      SQLITE: 'sqlite'
    }
  },
  ROUTES: {
    CATCH_ALL: '*',
    ROOT: '/',
    STORE_APP: '/api/app',
    TRENDS: '/api/trends',
    AUTH: '/api/auth',
    LOGIN: '/login',
    GOOGLE_CB: '/google/callback',
    LOGIN_ENDPOINT() {
      return `${this.AUTH}${this.LOGIN}`;
    }
  },
  ERRORS_TO_USER: {
    INVALID_API_CALL: { error: 'invalid API method or incorrect usage. Please refer to API documentation' }
  },
  CERT: {
    certDir: 'certificate',
    keyName: 'server.key',
    certName: 'server.crt'
  },
  AUTH: {
    get callbackURL() {
      return '/auth/google/callback';
    },
    expiresIn: '24h',
    issuer: 'Spektor Inc.'
  },
  HOSTING: {
    AWS: 'aws',
    HEROKU: 'heroku'
  },
  ENV: {
    PROD: 'production',
    DEV: 'development'
  },
  HEADERS: {
    AUTHORIZATION: 'authorization',
    AccessControlAllowOrigin: 'Access-Control-Allow-Origin',
    AccessControlRequestHeaders: 'access-control-request-headers',
    AccessControlAllowHeaders: 'Access-Control-Allow-Headers',
    AccessControlAllowHeadersValue: 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, mode',
    AccessControlAllowMethods: 'Access-Control-Allow-Methods',
    AccessControlAllowMethodsValue: 'GET,PUT,POST,DELETE',
    ContentType: 'Content-Type',
    ContentTypeCSV: 'application/octet-stream; charset=utf-8'
  }
};

module.exports = constants;
