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
      t.log({ msg: `processing object id ${t.id} name(${t.name}) version(${t.version}). Do a bunch of stuff here.`.silly, type: "silly" })
      if (t.errors)
          callback({ error: { msg: t.error_msg } })
      else
          callback({ success: { msg: `id = ${t.id} name(${t.name}) version(${t.version})`}})
  }
}

var qObj = new queue()

qObj.init().process({
  appender: "json_version",
  xlog: {appender: "log4js-tagline", logger: logger},
  exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
  process_objects: [file_object],
  exclude_version: ["2.00", "4.00"],
  data_to_process_array: file_data
}).then((success) => {
  qObj.logMsg({ msg: `test success: json version non matching objects processed with no errors.`, type: "success" })
}, (error) => {
  if (typeof error == "string") {
    qObj.logMsg({ msg: `error: ${error}`, type: "error" })
  } else {
    let add_s = (error.error_count > 1) ? 's' : ''
    qObj.logMsg({ msg: `${error.error_count} error${add_s} detected`, type: "error" })
  }
})

/* Expected output in my.log
[2023-03-01T23:53:31.911] [trace] myLog - (msg: "processing object id 100 name(all) version(1.00). Do a bunch of stuff here.")
[2023-03-01T23:53:31.913] [trace] myLog - (msg: "processing object id 102 name(top_one) version(1.00). Do a bunch of stuff here.")
[2023-03-01T23:53:31.914] [trace] myLog - (msg: "processing object id 103 name(bottom_one) version(3.00). Do a bunch of stuff here.")
[2023-03-01T23:53:31.916] [trace] myLog - (msg: "processing object id 105 name(status) version(5.00). Do a bunch of stuff here.")
[2023-03-01T23:53:31.917] [trace] myLog - (msg: "processing object id 107 name(version) version(3.00). Do a bunch of stuff here.")
[2023-03-01T23:53:31.918] [info] myLog - (msg: "id = 100 name(all) version(1.00)")
[2023-03-01T23:53:31.919] [info] myLog - (msg: "id = 102 name(top_one) version(1.00)")
[2023-03-01T23:53:31.920] [info] myLog - (msg: "id = 103 name(bottom_one) version(3.00)")
[2023-03-01T23:53:31.923] [info] myLog - (msg: "id = 105 name(status) version(5.00)")
[2023-03-01T23:53:31.924] [info] myLog - (msg: "id = 107 name(version) version(3.00)")
[2023-03-01T23:53:31.928] [info] myLog - (msg: "test success: json version non matching objects processed with no errors.")
*/