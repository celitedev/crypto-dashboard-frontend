/**
Application Configuration File
*/

const path = require('path');
const ENVIRONMENTS = require('../enum/environments');

const ENV = process.env;
const NODE_ENV = ENV.NODE_ENV || ENVIRONMENTS.DEV;
const isDev = NODE_ENV === ENVIRONMENTS.DEV;
const PROTOCOL = 'https';
const APP_DOMAIN = 'local-crypto.co';
const isProd =
  NODE_ENV === ENVIRONMENTS.STAGING ||
  NODE_ENV === ENVIRONMENTS.QA ||
  NODE_ENV === ENVIRONMENTS.PROD;
const ROOT_DIR = process.cwd();

module.exports = {
  /** Logging */
  LOG: true,

  /** Application Running Environment */
  ENV: NODE_ENV,

  /** If Application Running In Development Environment. */
  IS_DEV: isDev,

  /** If Application Running In Production Environment. */
  IS_PROD: isProd,

  /** If Application Running In Production Environment. */
  IS_BUILD_DEPENDENCY: ENV.BUILD_LIB ? ENV.BUILD_LIB === 'true' : false,

  /** Application Root Directory */
  ROOT: ROOT_DIR,

  /** Application Build Directory */
  BUILD_DIR: path.resolve(ROOT_DIR, 'build'),

  /** APP Configs */
  APP: {
    /** Application Name */
    NAME: 'Crypto',

    /** Application Version */
    VERSION: '2.0.0',

    /** Application Main Script */
    ENTRY: 'app/app.js',

    PROTOCOL,

    /** Application Domain Name */
    DOMAIN_NAME: APP_DOMAIN,

    /** Application Base Url */
    BASE_URL: `${PROTOCOL}://${APP_DOMAIN}`,

    // Todo: OKsand, this need to be fixed and all assigned image url path in server need to be migrated to follow `https://cdn.${APP_DOMAIN}`
    /** Application CDN Url */
    CDN_URL: `https://images.lift.co`,

    PRE_RENDER_SERVICE_URL: 'http://localhost:3001',

    /** New Url */
    NEWS_URL: 'https://staging.news.lift.co/wp-json/wp/v2/',

    /** IP to listen on */
    IP: '0.0.0.0',

    /** Port Number To Listen To */
    PORT: 3000,
  },

  /** Application API */
  API: {
    /** Application API Base Url */
    URL: `http://127.0.0.1:8000`,
  },
};
