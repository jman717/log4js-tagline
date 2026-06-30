"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2026-06-26
*/

var queue = require("queueobj")

const base = require('./t_base')

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
    t.log({ msg: `This object (${fname}) is id (${t.id}) version (${t.version}). Do stuff here`.bgGreen, type: "info" })
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
    t.log({ msg: `This object (${fname}) is id (${t.id}) version (${t.version}). Do stuff here`.bgGreen, type: "info" })
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
    t.log({ msg: `This object (${fname}) is id (${t.id}) version (${t.version}). Do stuff here`.bgGreen, type: "info" })
    // callback({success: { msg: `processing ${fname}) is id (${t.id}) version (${t.version})` }})
    try {
      throw new Error(`there is some problem thrown here on ${fname}) is id (${t.id}) version (${t.version})`)
    } catch (e) {
      callback({ error: { 'msg': e.message, 'stack': e.stack } })
    }
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
    t.log({ msg: `This object (${fname}) is id (${t.id}) version (${t.version}). Do stuff here`.bgGreen, type: "info" })
    callback({ success: { msg: `processing ${fname}) is id (${t.id}) version (${t.version})` } })
  }
}

var tobj = class top_one extends base {
  constructor() {
    super()
    var t = this
    var qObj = new queue()
    qObj.init().process({
      appender: "version",
      xlog: { appender: "log4js-tagline", logger: t.logger },
      exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
      include_version: ["1.00", "3.00"],
      process_objects: [tst1, tst2, tst3, tst4]
    }).then((success) => {
      qObj.logMsg({ msg: `msg: 'all objects processed with no errors'`, type: "success" })
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
[2026-06-29T21:10:20.137] [info] myLog - (msg: "This object (version_matching.test2.process) is id (2) version (1.00). Do stuff here")
[2026-06-29T21:10:24.151] [info] myLog - (msg: "This object (version_matching.test3.process) is id (3) version (1.00). Do stuff here")
[2026-06-29T21:10:24.153] [info] myLog - (msg: "This object (version_matching.test4.process) is id (4) version (3.00). Do stuff here")
[2026-06-29T21:10:24.156] [info] myLog - (msg: "processing version_matching.test2.process) is id (2) version (1.00)")
[2026-06-29T21:10:24.157] [error] myLog - (msg: "there is some problem thrown here on version_matching.test3.process) is id (3) version (1.00)")
[2026-06-29T21:10:24.161] [error] myLog - (msg: "at test3.process (C:\\Users\\jimma\\GitHub\\log4js-tagline\\tests\\queueobj\\versionmatching.js:63:13)")
[2026-06-29T21:10:24.171] [info] myLog - (msg: "processing version_matching.test4.process) is id (4) version (3.00)")
[2026-06-29T21:10:24.202] [error] myLog - (msg: "1 error detected")
[2026-06-29T21:10:24.210] [error] myLog - (msg: "promise failed")
[2026-06-29T21:10:24.219] [error] myLog - (msg: "at C:\\Users\\jimma\\GitHub\\log4js-tagline\\tests\\queueobj\\versionmatching.js:108:17")
*/