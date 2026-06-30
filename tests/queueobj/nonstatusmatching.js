"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2026-06-26
*/

var queue = require("queueobj")

const base = require('./t_base')

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
    t.log({ msg: `This object (${fname}) is id (${t.id}) status (${t.status}). Do stuff here`.bgGreen, type: "info" })
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
    t.log({ msg: `This object (${fname}) is id (${t.id}) status (${t.status}). Do stuff here`.bgGreen, type: "info" })
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
    t.log({ msg: `This object (${fname}) is id (${t.id}) status (${t.status}). Do stuff here`.bgGreen, type: "info" })
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
    let t = this, fname = "status.test4.constructor"
    t.log = props.log
    t.id = props.id
    t.status = "delete"

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "status.test4.process"
    t.log({ msg: `This object (${fname}) is id (${t.id}) status (${t.status}). Do stuff here`.bgGreen, type: "info" })
    callback({ success: { msg: `processing all test4` } })
  }
}

var tobj = class top_one extends base {
  constructor() {
    super()
    var t = this
    var qObj = new queue()
    qObj.init().process({
      appender: "status",
      xlog: { appender: "log4js-tagline", logger: t.logger },
      exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
      exclude_status: ["init", "delete"],
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
[2026-06-29T20:12:47.230] [info] myLog - (msg: "test success: {msg: \"all objects processed with no errors\"}")
[2026-06-29T20:16:45.013] [info] myLog - (msg: "This object (status.test1.process) is id (1) status (init). Do stuff here")
[2026-06-29T20:16:45.018] [info] myLog - (msg: "This object (status.test4.process) is id (4) status (delete). Do stuff here")
[2026-06-29T20:16:45.020] [info] myLog - (msg: "processing all test1")
[2026-06-29T20:16:45.020] [info] myLog - (msg: "processing all test4")
[2026-06-29T20:16:45.022] [info] myLog - (msg: "test success: {msg: \"all objects processed with no errors\"}")
*/