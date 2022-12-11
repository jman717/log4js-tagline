var colors = require('colors')

var log4js = require("log4js"),
  log4js_tagline = require("../app.js"),
  queue = require("queueobj")

log4js.configure({
  appenders: { myLog: { type: 'file', filename: 'my.log' } },
  categories: { default: { appenders: ['myLog'], level: 'debug' } }
})

tagline = new log4js_tagline(log4js, {
  "display": ["trace", "debug", "info", "warn", "error", "fatal", "mark"],
  "output": {
    "to_console": {
      "show": true, "color": {
        "trace": "blue",
        "debug": "magenta",
        "info": "bgBlue",
        "warn": "yellow",
        "error": "red",
        "fatal": "red",
        "mark": "white"
      }
    },      /* send output to console.log */
    "to_local_file": true,   /* send output to the local file */
    "to_datadog": true        /* send output to datadog (when the datadog appender is configured) */
  }
})

const logger = log4js.getLogger('myLog')
logger.level = 'debug'

class test1 {
  process(callback) {
    callback({ success: { msg: `processing all test1` } })
  }
}

class test2 {

  process(callback) {
    callback({ success: { msg: `processing all test2` } })
  }
}

class test3 {
  process(callback) {
    callback({ success: { msg: `processing all test3` } })
    // callback({ error: { msg: `there is some problem thrown here on test3` } })
  }
}

class test4 {
  process(callback) {
    callback({ success: { msg: `processing all test4` } })
  }
}

append = tagline.appender('stopwatch')
stw = new append(tagline)
stw.setStart()
let qObj = new queue(), props = { appender: 'all', stats: true }

qObj.logMsg = function (json) {
  try {
    if (typeof json != "undefined") {
      if (typeof json.success != "undefined" &&
        typeof json.success.msg != "undefined") {
        logger.info(`success: ${json.success.msg}`).tagline()
        return
      }
      if (typeof json.error != "undefined" &&
        typeof json.error.msg != "undefined") {
        logger.error(`error: ${json.error.msg}`).tagline()
        return
      }
    }
    throw new Error('No json to process')
  } catch (e) {
    logger.error(`error with all processing: (${e.message})`).tag(stw.setStop()).tagline()
  }
}

qObj.load(props).add(new test1()).add(new test2()).add(new test3()).add(new test4()).process({}).then(res => {
  logger.debug(`success with all processing: (${res})`).tag(stw.setStop()).tagline()
}, err => {
  logger.error(`error with all processing: (${err})`).tag(stw.setStop()).tagline()
})