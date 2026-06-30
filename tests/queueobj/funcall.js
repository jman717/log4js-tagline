"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2026-06-26
*/

var queue = require("queueobj")

const base = require('./t_base')

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
    try {
      throw new Error(`there is some problem thrown here on test3`)
    } catch (e) {
      callback({ error: { 'msg': e.message, 'stack': e.stack } })
    }
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

var tobj = class top_one extends base {
  constructor() {
    super()
    var t = this
    var qObj = new queue()
    qObj.init().process({
      appender: "func_all",
      xlog: { appender: "log4js-tagline", logger: t.logger },
      exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
      process_objects: [tst1, tst2, tst3, tst4]
    }).then((success) => {
      qObj.logMsg({ msg: `test success: {msg: "all objects processed with no errors"}`, type: "success" })
    }, (error) => {
      if (typeof error == "string") {
        qObj.logMsg({ msg: `error: ${error}`, type: "error" })
      } else {
        let add_s = (error.error_count > 1) ? 's' : ''
        qObj.logMsg({ msg: `${error.error_count} error${add_s} detected`, type: "error" })
      }
      var err = new Error('promise failed')
      qObj.logMsg({ msg: err.message, 'stack': err.stack, 'type': "error" })
    })
  }
}

var tst = new tobj()


/* Expected output in my.log
[2026-06-29T20:02:06.196] [info] myLog - (msg: "This object (test_all.test1.custom_function) is id (1). Do stuff here")
[2026-06-29T20:02:06.200] [info] myLog - (msg: "This object (test_all.test2.another_function) is id (2). Do stuff here")
[2026-06-29T20:02:10.207] [info] myLog - (msg: "This object (test_all.test3.third_test) is id (3). Do stuff here")
[2026-06-29T20:02:10.209] [info] myLog - (msg: "This object (test_all.test4.process) is id (4). Do stuff here")
[2026-06-29T20:02:10.212] [info] myLog - (msg: "processing all test1")
[2026-06-29T20:02:10.213] [info] myLog - (msg: "processing all test2")
[2026-06-29T20:02:10.242] [error] myLog - (msg: "there is some problem thrown here on test3")
[2026-06-29T20:02:10.243] [error] myLog - (msg: "at test3.third_test (C:\\Users\\jimma\\GitHub\\log4js-tagline\\tests\\queueobj\\funcall.js:67:13)")
[2026-06-29T20:02:10.245] [info] myLog - (msg: "processing all test4")
[2026-06-29T20:02:10.247] [error] myLog - (msg: "1 error detected")
[2026-06-29T20:02:10.258] [error] myLog - (msg: "promise failed")
[2026-06-29T20:02:10.258] [error] myLog - (msg: "at C:\\Users\\jimma\\GitHub\\log4js-tagline\\tests\\queueobj\\funcall.js:111:17")
*/