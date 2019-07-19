const assert = require('assert'),
    jsonHasDifferences = require('compare-json-difference'),
    packagejson = require('../package.json')

const packageMock = {
  "author": {
    "name": "Jim Manton"
  },
  "bundleDependencies": false,
  "dependencies": {
    "chai": "^4.2.0",
    "colors": "*",
    "compare-json-difference": "^0.1.3",
    "email-smtp-cron-delivery": "0.0.12",
    "log4js": "^4.5.1",
    "mocha": "^6.2.0",
    "node-dogstatsd": "0.0.7"
  },
  "scripts": {
    "start": "node app.js",
    "test": "mocha"
  },
  "keywords": [
    "logging",
    "log",
    "log4js",
    "appenders",
    "node",
    "email",
    "cron",
    "mocha",
    "datadog"
  ],
  "homepage": "https://github.com/jman717/log4js-tagline",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jman717/log4js-tagline.git"
  },
  "deprecated": false,
  "description": "log4js + tagline",
  "email": "jrman@risebroadband.net",
  "license": "ISC",
  "main": "app.js",
  "name": "log4js-tagline",
  "start": "node app.js",
  "version": "2.1.15"
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
