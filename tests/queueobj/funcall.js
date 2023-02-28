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
    let t = this, fname = "test_all.test1.constructor"
    t.log = props.log
    t.id = props.id
    t.base_queue_process_function = t.custom_function

    t.custom_function = t.custom_function.bind(t)
    t.base_queue_process_function = t.base_queue_process_function.bind(t)
  }

  custom_function(callback) {
    let t = this, fname = "test_all.test1.custom_function"
    t.log({ msg: `This object (${fname}) is id (${t.id}). Do stuff here`.bgBrightGreen, type: "info" })
    callback({ success: { msg: `processing all test1` } })
  }
}

var tst2 = class test2 {
  constructor(props) {
    let t = this, fname = "test_all.test2.constructor"
    t.log = props.log
    t.id = props.id
    t.base_queue_process_function = t.another_function

    t.another_function = t.another_function.bind(t)
    t.base_queue_process_function = t.base_queue_process_function.bind(t)
  }

  another_function(callback) {
    let t = this, fname = "test_all.test2.another_function"
    t.log({ msg: `This object (${fname}) is id (${t.id}). Do stuff here`.bgBrightGreen, type: "info" })
    // callback({ success: { msg: `processing all test2` } })
    setTimeout(() => {  
      callback({ success: { msg: `processing all test2` } })
    }, 4000)
  }
}

var tst3 = class test3 {
  constructor(props) {
    let t = this, fname = "test_all.test3.constructor"
    t.log = props.log
    t.id = props.id
    t.base_queue_process_function = t.third_test

    t.third_test = t.third_test.bind(t)
    t.base_queue_process_function = t.base_queue_process_function.bind(t)
  }

  third_test(callback) {
    let t = this, fname = "test_all.test3.third_test"
    t.log({ msg: `This object (${fname}) is id (${t.id}). Do stuff here`.bgBrightGreen, type: "info" })
    // callback({success: { msg: `processing all test3` }})
    callback({ error: { msg: `there is some problem thrown here on test3` } })
  }
}

var tst4 = class test4 {
  constructor(props) {
    let t = this, fname = "test_all.test4.constructor"
    t.log = props.log
    t.id = props.id
    t.base_queue_process_function = t.last_shot

    t.last_shot = t.last_shot.bind(t)
    t.base_queue_process_function = t.base_queue_process_function.bind(t)
  }

  last_shot(callback) {
    let t = this, fname = "test_all.test4.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}). Do stuff here`.bgBrightGreen, type: "info" })
    callback({ success: { msg: `processing all test4` } })
  }
}

var qObj = new queue()

qObj.init().process({
  appender: "func_all",
  xlog: {appender: "log4js-tagline", logger: logger},
  exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
  process_objects: [tst1, tst2, tst3, tst4]
}).then((success) => {
  qObj.logMsg({ msg: `test success: func all objects processed with no errors`, type: "success" })
}, (error) => {
  if (typeof error == "string") {
    qObj.logMsg({ msg: `error: ${error}`, type: "error" })
  } else {
    let add_s = (error.error_count > 1) ? 's' : ''
    qObj.logMsg({ msg: `${error.error_count} error${add_s} detected`, type: "error" })
  }
})

/* Expected output in my.log
[2023-02-27T12:44:11.986] [info] myLog - (msg: "This object (test_all.test1.custom_function) is id (1). Do stuff here")
[2023-02-27T12:44:11.988] [info] myLog - (msg: "This object (test_all.test2.another_function) is id (2). Do stuff here")
[2023-02-27T12:44:16.005] [info] myLog - (msg: "This object (test_all.test3.third_test) is id (3). Do stuff here")
[2023-02-27T12:44:16.018] [info] myLog - (msg: "This object (test_all.test4.process) is id (4). Do stuff here")
[2023-02-27T12:44:16.028] [info] myLog - (msg: "processing all test1")
[2023-02-27T12:44:16.036] [info] myLog - (msg: "processing all test2")
[2023-02-27T12:44:16.044] [error] myLog - (msg: "there is some problem thrown here on test3")
[2023-02-27T12:44:16.050] [info] myLog - (msg: "processing all test4")
[2023-02-27T12:44:16.068] [error] myLog - (msg: "1 error detected")
*/