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

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "test_all.test1.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}). Do stuff here`.bgGreen, type: "info" })
    callback({ success: { msg: `processing all test1` } })
  }
}

var tst2 = class test2 {
  constructor(props) {
    let t = this, fname = "test_all.test2.constructor"
    t.log = props.log
    t.id = props.id

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "test_all.test2.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}). Do stuff here`.bgGreen, type: "info" })
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

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "test_all.test3.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}). Do stuff here`.bgGreen, type: "info" })
    // callback({success: { msg: `processing all test3` }})
    try {
      throw new Error(`example of some thrown error`)
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

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "test_all.test4.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}). Do stuff here`.bgGreen, type: "info" })
    callback({ success: { msg: `processing all test4` } })
  }
}

var tobj = class top_one extends base {
  constructor() {
    super()
    var t = this
    var qObj = new queue()
    qObj.init().process({
      appender: "top_one",
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
[2026-06-29T19:33:33.448] [info] myLog - (msg: "This object (test_all.test1.process) is id (1). Do stuff here")
[2026-06-29T19:33:33.451] [info] myLog - (msg: "processing all test1")
[2026-06-29T19:33:33.453] [info] myLog - (msg: "test success: {msg: \"all objects processed with no errors\"}")
*/