export const PROD = process.env["NODE_ENV"]
  ? process.env["NODE_ENV"] === "production"
  : false;

export const COOKIE_NAME = "wayid";

export const FORGOT_PASSWORD_PREFIX = "forgotpassword:";
