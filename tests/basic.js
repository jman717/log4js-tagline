"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2026-06-26
*/

var queue = require("queueobj")

const base = require('./queueobj/t_base')

var tst1 = class test1 {
  constructor(props) {
    let t = this
    t.log = props.log
    t.id = props.id
    t.tagline = props.tagline
    console.log(`jrm debug 222: ${typeof props.tagline}`)

    t.process = t.process.bind(t)
  }

  process(callback) {
    let t = this, fname = "basic.process"
    var hip = '123.45.678.910'

    console.log(`jrm debug 111`)

    try {
      t.datadog = t.tagline.init({
        "datadog": {
          "StatsD_Ip": hip
        }
      }).appender('datadog')
      t.increment = new t.datadog(t.tagline).setConfig({ "format": "increment(@data, @simple_rate, @tags)" }).setData('some datadog increment message').setRate(4).setTags('env:test')
      t.incrementBy = new t.datadog(t.tagline).setConfig({ "format": "incrementBy(@data, @value, @simple_rate, @tags)" }).setData('some datadog incrementBy message').setValue(400).setRate(1).setTags('env:test')
      t.gauge = new t.datadog(t.tagline).setConfig({ "format": "gauge(@data, @value, @simple_rate, @tags)" }).setData('some datadog gauge message').setValue(400).setRate(1).setTags('env:staging:east')
      t.histogram = new t.datadog(t.tagline).setConfig({ "format": "histogram(@data, @value, @simple_rate, @tags)" }).setData('some datadog histogram message').setValue(1000).setRate(1).setTags('env:histogram')
      t.set = new t.datadog(t.tagline).setConfig({ "format": "set(@data, @value, @simple_rate, @tags)" }).setData('some datadog set message').setValue(20).setRate(15).setTags('env:set')

      //      t.logger.info('this is an info line').tag(lne).tag(increment).tag(incrementBy).tag(gauge).tag(histogram).tag(set).tagline()
      t.append = t.tagline.appender('boolean')
      t.isFalse = new t.append(t.tagline).setConfig({ "format": "bool(@boolean)" }).setFalse()
      t.isTrue = new t.append(t.tagline).setConfig({ "format": "bool(@boolean)" }).setTrue()


      t.incrementBy.setValue(600)
      t.log({ msg: `This object (${fname}) is id (${t.id}). this is a debug line`, type: "info" })
      t.log({ msg: `This object (${fname}) is id (${t.id}). this is a debug line2 isFalse(${t.isFalse.getValue()}) increment(${t.increment.value})`, type: "info" })
      t.log({ msg: `This object (${fname}) is id (${t.id}). this is a debug line3 isFalse(${t.isTrue.getValue()})`, type: "info" })

      t.append = t.tagline.appender('route')
      t.rte = new t.append(t.tagline).setConfig({ "format": "rte(@route)" }).setInput('/test')

      t.append = t.tagline.appender('line')
      t.lne = new t.append(t.tagline).setConfig({ "format": "lne(@name(): @file:@line:@column)" })

      t.append = t.tagline.appender('anyMsg')
      t.act = new t.append(t.tagline)
      t.append = t.tagline.appender('stopwatch')
      t.stw = new t.append(t.tagline)
      t.stw.setStart()

      t.act.setInput('some messages')
      t.log({ msg: `Hello World log (${fname}) is id (${t.id}). ${t.rte.format_line()} stopwatch({${t.stw.setStop().format_line()}))`, type: "info" })

      callback({ success: { msg: `processing all test1` } })
    } catch (e) {
      callback({ error: { 'msg': e.message, 'stack': e.stack } })
    }
  }
}

var tbase = class xbase extends base {
  constructor() {
    super()
    var t = this
    try {
      var qObj = new queue()
      qObj.init().process({
        appender: "with_tagline",
        xlog: { appender: "log4js-tagline", logger: t.logger },
        exclude_logMsg: ["debug"],   /* example ["debug", "info"] */
        tagline: t.tagline,
        process_objects: [tst1]
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
    } catch (e) {
      console.log('error message here(' + e.message + ')')
    }
  }
}

var tst = new tbase()

/* Expected output in my.log
[2026-06-29T19:18:33.053] [info] myLog - (msg: "This object (basic.process) is id (1). this is a debug line")
[2026-06-29T19:18:33.068] [info] myLog - (msg: "This object (basic.process) is id (1). this is a debug line2 isFalse(false) increment(1)")
[2026-06-29T19:18:33.076] [info] myLog - (msg: "This object (basic.process) is id (1). this is a debug line3 isFalse(true)")
[2026-06-29T19:18:33.151] [info] myLog - (msg: "Hello World log (basic.process) is id (1). rte(/test) stopwatch({stopwatch(6/29/2026, 7:18:33 PM - 6/29/2026, 7:18:33 PM = 0/mili)))")
[2026-06-29T19:18:33.153] [info] myLog - (msg: "processing all test1")
[2026-06-29T19:18:33.156] [info] myLog - (msg: "test success: {msg: \"all objects processed with no errors\"}")
*/