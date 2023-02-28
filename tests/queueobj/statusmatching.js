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
    let t = this, fname = "status.test1.constructor"
    t.log = props.log
    t.id = props.id
    t.status = "init"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "status.test1.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) status (${t.status}). Do stuff here`.bgBrightGreen, type: "info" })
    callback({ success: { msg: `processing all test1` } })
  }
}

var tst2 = class test2 {
  constructor(props) {
    let t = this, fname = "status.test2.constructor"
    t.log = props.log
    t.id = props.id
    t.status = "step 1"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "status.test2.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) status (${t.status}). Do stuff here`.bgBrightGreen, type: "info" })
    setTimeout(() => {
      callback({ success: { msg: `processing all test2` } })
    }, 4000)
  }
}

var tst3 = class test3 {
  constructor(props) {
    let t = this, fname = "status.test3.constructor"
    t.log = props.log
    t.id = props.id
    t.status = "remove"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "status.test3.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) status (${t.status}). Do stuff here`.bgBrightGreen, type: "info" })
    // callback({success: { msg: `processing all test3` }})
    callback({ error: { msg: `there is some problem thrown here on test3` } })
  }
}

var tst4 = class test4 {
  constructor(props) {
    let t = this, fname = "status.test4.constructor"
    t.log = props.log
    t.id = props.id
    t.status = "delete"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "status.test4.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) status (${t.status}). Do stuff here`.bgBrightGreen, type: "info" })
    callback({ success: { msg: `processing all test4` } })
  }
}

var qObj = new queue()

qObj.init().process({
  appender: "status",
  xlog: {appender: "log4js-tagline", logger: logger},
  exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
  include_status: ["init", "delete"],
  process_objects: [tst1, tst2, tst3, tst4]
}).then((success) => {
  qObj.logMsg({ msg: `test success: status matching objects processed with no errors`, type: "success" })
}, (error) => {
  if (typeof error == "string") {
    qObj.logMsg({ msg: `error: ${error}`, type: "error" })
  } else {
    let add_s = (error.error_count > 1) ? 's' : ''
    qObj.logMsg({ msg: `${error.error_count} error${add_s} detected`, type: "error" })
  }
})

/* Expected output in my.log
[2023-02-27T17:52:17.478] [info] myLog - (msg: "This object (status.test1.process) is id (1) status (init). Do stuff here")
[2023-02-27T17:52:17.481] [info] myLog - (msg: "This object (status.test4.process) is id (4) status (delete). Do stuff here")
[2023-02-27T17:52:17.483] [info] myLog - (msg: "processing all test1")
[2023-02-27T17:52:17.484] [info] myLog - (msg: "processing all test4")
[2023-02-27T17:52:17.488] [info] myLog - (msg: "test success: status matching objects processed with no errors")
*/