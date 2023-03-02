var log4js = require("log4js"),
  log4js_tagline = require("../../app.js"),
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

var tst1 = class test1 {
  constructor(props) {
    let t = this, fname = "version_matching.test1.constructor"
    t.log = props.log
    t.id = props.id
    t.version = "2.00"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "version_matching.test1.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) version (${t.version}). Do stuff here`.bgBrightGreen, type: "info" })
    callback({ success: { msg: `processing ${fname}) is id (${t.id}) version (${t.version})` } })
  }
}

var tst2 = class test2 {
  constructor(props) {
    let t = this, fname = "version_matching.test2.constructor"
    t.log = props.log
    t.id = props.id
    t.version = "1.00"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "version_matching.test2.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) version (${t.version}). Do stuff here`.bgBrightGreen, type: "info" })
    setTimeout(() => {
      callback({ success: { msg: `processing ${fname}) is id (${t.id}) version (${t.version})` } })
    }, 4000)
  }
}

var tst3 = class test3 {
  constructor(props) {
    let t = this, fname = "version_matching.test3.constructor"
    t.log = props.log
    t.id = props.id
    t.version = "1.00"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "version_matching.test3.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) version (${t.version}). Do stuff here`.bgBrightGreen, type: "info" })
    // callback({success: { msg: `processing ${fname}) is id (${t.id}) version (${t.version})` }})
    callback({ error: { msg: `there is some problem thrown here on ${fname}) is id (${t.id}) version (${t.version})` } })
  }
}

var tst4 = class test4 {
  constructor(props) {
    let t = this, fname = "version_matching.test4.constructor"
    t.log = props.log
    t.id = props.id
    t.version = "3.00"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "version_matching.test4.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) version (${t.version}). Do stuff here`.bgBrightGreen, type: "info" })
    callback({ success: { msg: `processing ${fname}) is id (${t.id}) version (${t.version})` } })
  }
}

var qObj = new queue()

qObj.init().process({
  appender: "version",
  xlog: {appender: "log4js-tagline", logger: logger},
  exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
  include_version: ["1.00", "3.00"],
  process_objects: [tst1, tst2, tst3, tst4]
}).then((success) => {
  qObj.logMsg({ msg: `test success: version matching objects processed with no errors`, type: "success" })
}, (error) => {
  if (typeof error == "string") {
    qObj.logMsg({ msg: `error: ${error}`, type: "error" })
  } else {
    let add_s = (error.error_count > 1) ? 's' : ''
    qObj.logMsg({ msg: `${error.error_count} error${add_s} detected`, type: "error" })
  }
})

/* Expected output in my.log
[2023-03-01T23:57:15.405] [info] myLog - (msg: "This object (version_matching.test2.process) is id (2) version (1.00). Do stuff here")
[2023-03-01T23:57:19.425] [info] myLog - (msg: "This object (version_matching.test3.process) is id (3) version (1.00). Do stuff here")
[2023-03-01T23:57:19.430] [info] myLog - (msg: "This object (version_matching.test4.process) is id (4) version (3.00). Do stuff here")
[2023-03-01T23:57:19.432] [info] myLog - (msg: "processing version_matching.test2.process) is id (2) version (1.00)")
[2023-03-01T23:57:19.435] [error] myLog - (msg: "there is some problem thrown here on version_matching.test3.process) is id (3) version (1.00)")
[2023-03-01T23:57:19.437] [info] myLog - (msg: "processing version_matching.test4.process) is id (4) version (3.00)")
[2023-03-01T23:57:19.441] [error] myLog - (msg: "1 error detected")
*/