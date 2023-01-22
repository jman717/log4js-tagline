/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2022-12-11
* qJsonBottom_One.js
*/

var colors = require('colors')

var log4js = require("log4js"),
  log4js_tagline = require("../app.js"),
  queue = require("queuejson")

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

class class_test_func_all {
  constructor(props) {
    let t = this
    t.id = props.id
    t.log = props.log
    t.name = props.name

    t.some_function = t.some_function.bind(t)
    t.another_function = t.another_function.bind(t)
  }

  some_function(callback) {
    let t = this
    // if (t.id == 44) {
    //     callback({ error: { msg: `this id(${t.id}) in the custom function 'some_function' has thrown an error` } })
    // } else
    callback({ success: { id: t.id, function_name: 'some_function' } })
  }

  another_function(callback) {
    let t = this
    callback({ success: { id: t.id } })
  }
}

let qJson = new queue({
  class_obj: class_test_func_all,
  appender: 'func_all',
  stats: false,
  debug: true
})

qJson.logMsg = (msg, props = {}) => {
  let t = this
  try {
    let t = this, tp
    if (typeof props.obj_name != 'undefined')
      rte.setInput(props.obj_name)
    if (typeof props != 'undefined' &&
      typeof props.type != 'undefined') {
      switch (props.type) {
        case 'debug':
          logger.debug(msg).tag(rte).tagline()
          return
        case 'error':
          logger.error(msg).tag(rte).tagline()
          return
        case 'success':
          logger.info(msg).tag(rte).tagline()
          return
        case 'info':
          logger.info(msg).tag(rte).tagline()
          return
      }
      logger.error(`No type in json object`).tagline()
    }
    throw new Error('No props.type included')
  } catch (e) {
    logger.error(`app log: ${e.message} for message (${msg})`).tagline()
  }
}

const sample_data_func_all = [
  { props: { id: 22, name: 'test', function_name: 'some_function', log: qJson.logMsg } },
  { props: { id: 33, name: 'another', function_name: 'another_function', log: qJson.logMsg } },
  { props: { id: 44, name: 'some name', function_name: 'some_function', log: qJson.logMsg } },
  { props: { id: 45, name: 'last', function_name: 'some_function', log: qJson.logMsg } }
]
append = tagline.appender('stopwatch')
stw = new append(tagline)

append = tagline.appender('anyMsg')
act = new append(tagline)

append = tagline.appender('route')
rte = new append(tagline).setConfig({ "format": "rte(@route)" }).setInput('/test')


qJson.init({ input_data: sample_data_func_all })

try {

  qJson.process({}).then((success) => {
    logger.debug(`all success: (${JSON.stringify(success)})`).tag(stw.setStop()).tagline()
  }, (error) => {
    logger.error(`all errors: (${JSON.stringify(error)})`).tag(stw.setStop()).tagline()
  })
} catch (e) {
  qJson.logMsg(`error running qJsonBottom_One`, { "type": "error" })
}

/* Expected output in my.log
[2023-01-21T17:28:02.362] [debug] myLog - (msg: app init appender(func_all)) rte(/test)
[2023-01-21T17:28:02.399] [debug] myLog - (msg: base process) rte(/test)
[2023-01-21T17:28:02.401] [debug] myLog - (msg: base process_all) rte(/test)
[2023-01-21T17:28:02.403] [debug] myLog - (msg: base process_all: function name(some_function)) rte(/test)
[2023-01-21T17:28:02.404] [debug] myLog - (msg: base process_all: function name(another_function)) rte(/test)
[2023-01-21T17:28:02.405] [debug] myLog - (msg: base process_all: function name(some_function)) rte(/test)
[2023-01-21T17:28:02.405] [debug] myLog - (msg: base process_all: function name(some_function)) rte(/test)
[2023-01-21T17:28:02.421] [debug] myLog - (msg: all success: ({"res":""})) stopwatch(1/21/2023, 5:28:02 PM - 1/21/2023, 5:28:02 PM = 0.083/mili)
*/