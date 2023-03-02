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
    let t = this, fname = "name_matching.test1.constructor"
    t.log = props.log
    t.id = props.id
    t.name = "test 1"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "name_matching.test1.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) name (${t.name}). Do stuff here`.bgBrightGreen, type: "info" })
    callback({ success: { msg: `processing all ${t.name}` } })
  }
}

var tst2 = class test2 {
  constructor(props) {
    let t = this, fname = "name_matching.test2.constructor"
    t.log = props.log
    t.id = props.id
    t.name = "test 2"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "name_matching.test2.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) name (${t.name}). Do stuff here`.bgBrightGreen, type: "info" })
    setTimeout(() => {
      callback({ success: { msg: `processing all ${t.name}` } })
    }, 4000)
  }
}

var tst3 = class test3 {
  constructor(props) {
    let t = this, fname = "name_matching.test3.constructor"
    t.log = props.log
    t.id = props.id
    t.name = "test 3"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "name_matching.test3.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) name (${t.name}). Do stuff here`.bgBrightGreen, type: "info" })
    // callback({success: { msg: `processing all ${t.name}` }})
    callback({ error: { msg: `there is some problem thrown here on ${t.name}` } })
  }
}

var tst4 = class test4 {
  constructor(props) {
    let t = this, fname = "name_matching.test4.constructor"
    t.log = props.log
    t.id = props.id
    t.name = "test 4"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "name_matching.test4.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) name (${t.name}). Do stuff here`.bgBrightGreen, type: "info" })
    callback({ success: { msg: `processing all ${t.name}` } })
  }
}

var qObj = new queue()

qObj.init().process({
  appender: "name",
  xlog: {appender: "log4js-tagline", logger: logger},
  exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
  include_names: ["test 2", "test 4"],
  process_objects: [tst1, tst2, tst3, tst4]
}).then((success) => {
  qObj.logMsg({ msg: `test success: name matching objects processed with no errors`, type: "success" })
}, (error) => {
  if (typeof error == "string") {
    qObj.logMsg({ msg: `error: ${error}`, type: "error" })
  } else {
    let add_s = (error.error_count > 1) ? 's' : ''
    qObj.logMsg({ msg: `${error.error_count} error${add_s} detected`, type: "error" })
  }
})

/* Expected output in my.log
[2023-02-27T19:56:20.261] [info] myLog - (msg: "This object (name_matching.test2.process) is id (2) name (test 2). Do stuff here")
[2023-02-27T19:56:24.270] [info] myLog - (msg: "This object (name_matching.test4.process) is id (4) name (test 4). Do stuff here")
[2023-02-27T19:56:24.273] [info] myLog - (msg: "processing all test 2")
[2023-02-27T19:56:24.275] [info] myLog - (msg: "processing all test 4")
[2023-02-27T19:56:24.279] [info] myLog - (msg: "test success: name matching objects processed with no errors")
*/