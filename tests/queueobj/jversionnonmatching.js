"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2026-06-26
*/

var queue = require("queueobj")

const base = require('./t_base')

var file_data = [
  { props: { id: 100, name: "all", version: "1.00", absolute_path: __filename, check: false } },
  { props: { id: 101, name: "func_all", version: "2.00", absolute_path: __filename, check: false } },
  { props: { id: 102, name: "top_one", version: "1.00", absolute_path: __filename, check: false } },
  { props: { id: 103, name: "bottom_one", version: "3.00", absolute_path: __filename, check: false } },
  { props: { id: 104, name: "sync_all", version: "4.00", absolute_path: __filename, check: false } },
  { props: { id: 105, name: "status", version: "5.00", absolute_path: __filename, check: false } },
  { props: { id: 106, name: "name", version: "2.00", absolute_path: __filename, check: false } },
  { props: { id: 107, name: "version", version: "3.00", absolute_path: __filename, check: false } }
]

var file_object = class file_obj {
  constructor(props) {
    let t = this, fname = "file_obj.constructor"
    try {
      t.id = props.id
      t.log = props.log
      t.name = props.name
      t.version = props.version
      t.path = props.relative_path
      t.absolute_path = props.absolute_path
      t.errors = false
      t.error_msg = 'none'

      t.process = t.process.bind(t)

      // if (t.id == 104) {
      //     t.errors = true
      //     t.error_msg = `some sort of error here`    
      // }
    } catch (e) {
      e.message = `${fname} error: ${e.message}`
      throw e
    }

    return t
  }

  process(callback) {
    let t = this
    t.log({ msg: `processing object id ${t.id} name(${t.name}) version(${t.version}). Do a bunch of stuff here.`, type: "info" })
    try {
      if (t.errors)
        throw new Error(t.error_msg)
    } catch (e) {
      callback({ error: { 'msg': e.message, 'stack': e.stack } })
    }
    callback({ success: { msg: `id = ${t.id} name(${t.name}) version(${t.version})` } })
  }
}

var tobj = class top_one extends base {
  constructor() {
    super()
    var t = this
    var qObj = new queue()
    qObj.init().process({
      appender: "json_version",
      xlog: { appender: "log4js-tagline", logger: t.logger },
      exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
      process_objects: [file_object],
      exclude_version: ["2.00", "4.00"],
      data_to_process_array: file_data
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
[2026-06-30T13:59:59.146] [info] myLog - (msg: "processing object id 100 name(all) version(1.00). Do a bunch of stuff here.")
[2026-06-30T13:59:59.148] [info] myLog - (msg: "processing object id 102 name(top_one) version(1.00). Do a bunch of stuff here.")
[2026-06-30T13:59:59.149] [info] myLog - (msg: "processing object id 103 name(bottom_one) version(3.00). Do a bunch of stuff here.")
[2026-06-30T13:59:59.149] [info] myLog - (msg: "processing object id 105 name(status) version(5.00). Do a bunch of stuff here.")
[2026-06-30T13:59:59.151] [info] myLog - (msg: "processing object id 107 name(version) version(3.00). Do a bunch of stuff here.")
[2026-06-30T13:59:59.152] [info] myLog - (msg: "id = 100 name(all) version(1.00)")
[2026-06-30T13:59:59.153] [info] myLog - (msg: "id = 102 name(top_one) version(1.00)")
[2026-06-30T13:59:59.154] [info] myLog - (msg: "id = 103 name(bottom_one) version(3.00)")
[2026-06-30T13:59:59.154] [info] myLog - (msg: "id = 105 name(status) version(5.00)")
[2026-06-30T13:59:59.161] [info] myLog - (msg: "id = 107 name(version) version(3.00)")
[2026-06-30T13:59:59.164] [info] myLog - (msg: "test success: {msg: \"all objects processed with no errors\"}")
*/