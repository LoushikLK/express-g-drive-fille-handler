"use strict";
const serverless = require("serverless-http");
const app = require("./build/index");

module.exports.app = serverless(app);
