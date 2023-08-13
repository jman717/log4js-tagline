const assert = require('assert'),
    jsonHasDifferences = require('diffler'),
    packagejson = require('../package.json')

const packageMock = {
  "author": {
    "name": "Jim Manton"
  },
  "version": "5.3.10",
  "bundleDependencies": [],
  "dependencies": {
    "chai": "^4.3.7",
    "diffler": "^2.0.4",
    "ditched": "^2.2.0",
    "email-smtp-cron-delivery": "^0.1.0",
    "log4js": "^6.9.1",
    "mocha": "^10.1.0",
    "node-console-colors": "^1.1.4",
    "node-dogstatsd": "0.0.7",
    "queueobj": "^15.1.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.6"
  },
  "devDependencies": {
    "minimist": ">=1.2.6",
        "nodemailer": ">=6.6.1",
    "underscore": ">=1.12.1"  
  },
  "scripts": {
    "start": "node app.js",
    "test": "mocha",
    "ditched": "ditched -a",
    "test_basic": "node ./tests/basic",
    "test_qAll": "node ./tests/queueobj/all",
    "test_qTopOne": "node ./tests/queueobj/topone",
    "test_qBottomOne": "node ./tests/queueobj/bottomone",
    "test_qFuncAll": "node ./tests/queueobj/funcall",
    "test_qStatusMatching": "node ./tests/queueobj/statusmatching",
    "test_qNonStatusMatching": "node ./tests/queueobj/nonstatusmatching",
    "test_qVersionMatching": "node ./tests/queueobj/versionmatching",
    "test_qVersionNonMatching": "node ./tests/queueobj/versionnonmatching",
    "test_qNameMatching": "node ./tests/queueobj/namematching",
    "test_qNameNonMatching": "node ./tests/queueobj/nonnamematching",
    "test_qjAll": "node ./tests/queueobj/jall",
    "test_qjTopOne": "node ./tests/queueobj/jtopone",
    "test_qjBottomOne": "node ./tests/queueobj/jbottomone",
    "test_qjFuncAll": "node ./tests/queueobj/jfuncall",
    "test_qjStatusMatching": "node ./tests/queueobj/jstatusmatching",
    "test_qjStatusNonMatching": "node ./tests/queueobj/jnonstatusmatching",
    "test_qjNameMatching": "node ./tests/queueobj/jnamematching",
    "test_qjNameNonMatching": "node ./tests/queueobj/jnamenonmatching",
    "test_qjVersionMatching": "node ./tests/queueobj/jversionmatching",
    "test_qjVersionNonMatching": "node ./tests/queueobj/jversionnonmatching"
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
  "start": "node app.js"
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

