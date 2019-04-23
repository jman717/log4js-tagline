const assert = require('assert'),
    jsonHasDifferences = require('compare-json-difference'),
    packagejson = require('../package.json')

const packageMock = {
    "_from": "log4js-tagline",
    "_id": "log4js-tagline@2.0.2",
    "_inBundle": false,
    "_integrity": "sha512-hBdHoL8qLKlK0bxw+BnD5F3XFJgRMyog6tq/BRJ34OIDhIBxY5KrHw21dRVdW1P232j1zf/zlHci9w3XkzATQQ==",
    "_location": "/log4js-tagline",
    "_phantomChildren": {},
    "_requested": {
      "type": "tag",
      "registry": true,
      "raw": "log4js-tagline",
      "name": "log4js-tagline",
      "escapedName": "log4js-tagline",
      "rawSpec": "",
      "saveSpec": null,
      "fetchSpec": "latest"
    },
    "_requiredBy": [
      "#USER",
      "/",
      "/email-smtp-cron-delivery"
    ],
    "_resolved": "https://registry.npmjs.org/log4js-tagline/-/log4js-tagline-1.6.4.tgz",
    "_shasum": "4ec25a7774ff9d76ab8d42ebed713ee7f2ec610a",
    "_spec": "log4js-tagline",
    "_where": "C:\\Users\\jmanton\\node\\managed giving\\processachacknowledgment",
    "author": {
      "name": "Jim Manton"
    },
    "bundleDependencies": false,
    "dependencies": {
      "chai": "^4.2.0",
      "colors": "*",
      "compare-json-difference": "^0.1.3",
      "email-smtp-cron-delivery": "0.0.2",
      "log4js": "^2.6.0",
      "mocha": "^5.2.0",
      "node-dogstatsd": "0.0.7"
    },
    "scripts": {
      "start": "node app.js",
      "test": "mocha"
    },
    "deprecated": false,
    "description": "log4js + tagline",
    "email": "jrman@risebroadband.net",
    "license": "ISC",
    "main": "app.js",
    "name": "log4js-tagline",
    "start": "node app.js",
    "version": "2.0.2"
}

describe('package.json', function () {
    it('should pass', function () {
        assert(!jsonHasDifferences(packagejson, packageMock, true))
    })

    it('should fail', function () {
        packageMock.version = '0'
        assert(jsonHasDifferences(packagejson, packageMock, true))
    })
})