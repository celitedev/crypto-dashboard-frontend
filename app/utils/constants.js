import yup from 'yup';
import CONFIG from '../conf';

export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const USERNAME_MIN_CHAR = 2;
export const USERNAME_MAX_CHAR = 30;

export const USERNAME_SCHEMA = yup
  .string()
  .min(
    USERNAME_MIN_CHAR,
    `minimum username length is ${USERNAME_MIN_CHAR} characters`
  )
  .max(
    USERNAME_MAX_CHAR,
    `max password length is ${USERNAME_MAX_CHAR} characters`
  )
  .matches(
    /^[a-zA-Z0-9 ]+$/,
    'username can be only alphanumeric and spaces, should not contain other symbols, emojis or characters in other languages'
  )
  .required();

export const API_URL = CONFIG.API.URL;
export const NEWS_API_URL = CONFIG.APP.NEWS_URL;

export const REQUESTED = '_REQUESTED';
export const SUCCEDED = '_SUCCEDED';
export const STARTED = '_STARTED';
export const SKIPPED = '_SKIPPED';
export const FAILED = '_FAILED';
export const ERROR = '_ERROR';
export const CLEAR = '_CLEAR';
