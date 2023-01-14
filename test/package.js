const assert = require('assert'),
    jsonHasDifferences = require('diffler'),
    packagejson = require('../package.json')

const packageMock = {
  "author": {
    "name": "Jim Manton"
  },
  "bundleDependencies": [],
  "dependencies": {
    "chai": "^4.3.7",
    "node-console-colors": "^1.1.4",
    "diffler": "^2.0.4",
    "ditched": "^2.2.0",
    "email-smtp-cron-delivery": "^0.1.0",
    "log4js": "^6.7.1",
    "mocha": "^10.1.0",
    "node-dogstatsd": "0.0.7",
    "queuejson": "^8.3.0"
  },
  "scripts": {
    "start": "node app.js",
    "test": "mocha",
    "ditched": "ditched -a",
    "test_basic": "node ./tests/basic",
    "test_qObjAll": "node ./tests/qObjAll",
    "test_qObjBottom_One": "node ./tests/qObjBottom_One",
    "test_qObjTop_One": "node ./tests/qObjTop_One",
    "test_qJsonAll": "node ./tests/qJsonAll",
    "test_qJsonBottom_One": "node ./tests/qJsonBottom_One",
    "test_qJsonTop_One": "node ./tests/qJsonTop_One"
  },
  "keywords": [
    "logging",
    "log",
    "log4js",
    "appenders",
    "queueObj",
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
  "version": "3.7.0"
}

describe('package.json', function () {
  it('should pass', function () {
    const difference = jsonHasDifferences(packagejson, packageMock)
    assert(JSON.stringify(difference) == "{}")
  })

  it('should fail', function () {
      packageMock.version = '0'
      assert(jsonHasDifferences(packagejson, packageMock))
  })
})

