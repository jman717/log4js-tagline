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

class class_test_top_one {
  constructor(props) {
    let t = this
    t.id = props.id
    t.clog = props.log
    t.name = props.name
    t.clog(`class_test_top_one object name (${t.name})(${t.id})`, { "type": "info" })

    t.process = t.process.bind(t)
  }

  process(callback) {
    try {
      let t = this, str
      if (t.id == 3) {
        str = `this id(${t.id}) has some problem`
        t.clog(str, { "type": "error", "obj_name": "class_test_top_one" })
        callback({ error: { msg: str } })
      } else {
        str = `processing id(${t.id})`
        t.clog(str, { "type": "success", "obj_name": "class_test_top_one" })
        callback({ success: { msg: `id = ${t.id}` } })
      }
    } catch (e) {
      t.clog(`class_test_top_one process error: ${e.message}`, { "type": "error" })
    }
  }
}

let qJson = new queue({
  class_obj: class_test_top_one,
  appender: 'top_one',
  stats: true,
  debug: true
})

qJson.logMsg = (msg, props = {}) => {
  let t = this
  try {
    let t = this, tp
    if (typeof props != 'undefined' &&
      typeof props.type != 'undefined' &&
      typeof props.obj_name != 'undefined') {
      rte.setInput(props.obj_name)
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
    console.log(`app log: ${e.message} for message (${msg})`)
  }
}

const sample_data_all = [
  { props: { id: 1, name: 'test', log: qJson.logMsg } },
  { props: { id: 2, name: 'another', log: qJson.logMsg } },
  { props: { id: 3, name: 'numb 3', log: qJson.logMsg } },
  { props: { id: 4, name: 'numb 4', log: qJson.logMsg } }
]

append = tagline.appender('stopwatch')
stw = new append(tagline)

append = tagline.appender('anyMsg')
act = new append(tagline)

append = tagline.appender('route')
rte = new append(tagline).setConfig({ "format": "rte(@route)" }).setInput('/test')


qJson.init({ input_data: sample_data_all })

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
[2023-01-12T11:31:25.547] [info] myLog - (msg: processing id(1)) rte(class_test_top_one)
[2023-01-12T11:31:25.566] [debug] myLog - (msg: all success: ({"res":"start (Thu Jan 12 2023 11:31:25 GMT-0700 (Mountain Standard Time)) end(Thu Jan 12 2023 11:31:25 GMT-0700 (Mountain Standard Time)) milliseconds(12)"})) stopwatch(1/12/2023, 11:31:25 AM - 1/12/2023, 11:31:25 AM = 0.059/mili)
*/