"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2026-06-26
*/

var queue = require("queueobj")

const base = require('./t_base')

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
    t.log({ msg: `This object (${fname}) is id (${t.id}) name (${t.name}). Do stuff here`.bgGreen, type: "info" })
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
    t.log({ msg: `This object (${fname}) is id (${t.id}) name (${t.name}). Do stuff here`.bgGreen, type: "info" })
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
    t.log({ msg: `This object (${fname}) is id (${t.id}) name (${t.name}). Do stuff here`.bgGreen, type: "info" })
    // callback({success: { msg: `processing all ${t.name}` }})
    try {
      throw new Error(`there is some problem thrown here on ${t.name}`)
    } catch (e) {
      callback({ error: { 'msg': e.message, 'stack': e.stack } })
    }
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
    t.log({ msg: `This object (${fname}) is id (${t.id}) name (${t.name}). Do stuff here`.bgGreen, type: "info" })
    callback({ success: { msg: `processing all ${t.name}` } })
  }
}

var tobj = class top_one extends base {
  constructor() {
    super()
    var t = this
    var qObj = new queue()
    qObj.init().process({
      appender: "name",
      xlog: { appender: "log4js-tagline", logger: t.logger },
      exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
      exclude_names: ["test 2", "test 4"],
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
[2026-06-29T21:33:38.688] [info] myLog - (msg: "This object (name_matching.test1.process) is id (1) name (test 1). Do stuff here")
[2026-06-29T21:33:38.692] [info] myLog - (msg: "This object (name_matching.test3.process) is id (3) name (test 3). Do stuff here")
[2026-06-29T21:33:38.693] [info] myLog - (msg: "processing all test 1")
[2026-06-29T21:33:38.693] [error] myLog - (msg: "there is some problem thrown here on test 3")
[2026-06-29T21:33:38.695] [error] myLog - (msg: "at test3.process (C:\\Users\\jimma\\GitHub\\log4js-tagline\\tests\\queueobj\\nonnamematching.js:63:13)")
[2026-06-29T21:33:38.698] [error] myLog - (msg: "1 error detected")
[2026-06-29T21:33:38.699] [error] myLog - (msg: "promise failed")
[2026-06-29T21:33:38.700] [error] myLog - (msg: "at C:\\Users\\jimma\\GitHub\\log4js-tagline\\tests\\queueobj\\nonnamematching.js:107:17")
*/