var log4js = require("log4js"),
  log4js_tagline = require("../app.js")

log4js.configure({
  appenders: { myLog: { type: 'file', filename: 'my.log' } },
  categories: { default: { appenders: ['myLog'], level: 'debug' } }
})

tagline = new log4js_tagline(log4js, {
  "display": ["trace", "debug", "info", "warn", "error", "fatal", "mark"],
  "output": {
    "to_console": { "show": true, "color": {"trace": "blue", 
                                            "debug": "magenta", 
                                            "info": "bgBlue", 
                                            "warn": "yellow", 
                                            "error": "red", 
                                            "fatal": "red", 
                                            "mark": "white" }},      /* send output to console.log */
    "to_local_file": true,   /* send output to the local file */
    "to_datadog": true        /* send output to datadog (when the datadog appender is configured) */
  }
})

const logger = log4js.getLogger('myLog')
logger.level = 'debug'

append = tagline.appender('boolean')
isFalse = new append(tagline).setConfig({ "format": "bool(@boolean)" }).setFalse()
isTrue = new append(tagline).setConfig({ "format": "bool(@boolean)" }).setTrue()
display = new append(tagline).setConfig({ "format": "bool(@boolean)" }).setTrue()

console.log('show=' + typeof display.show)
logger.debug('show this line').tag(display.show(isTrue.getValue())).tagline()
logger.debug('do not show this line').tag(display.show(isFalse.getValue())).tagline()

append = tagline.appender('route')
rte = new append(tagline).setConfig({ "format": "rte(@route)" }).setInput('/test')

append = tagline.appender('line')
lne = new append(tagline).setConfig({ "format": "lne(@name(): @file:@line:@column)" })

try {
  var hip = '123.45.678.910'

  datadog = tagline.init({
    "datadog": {
      "StatsD_Ip": hip
    }
  }).appender('datadog')
  increment = new datadog(tagline).setConfig({ "format": "increment(@data, @simple_rate, @tags)" }).setData('some datadog increment message').setRate(4).setTags('env:test')
  incrementBy = new datadog(tagline).setConfig({ "format": "incrementBy(@data, @value, @simple_rate, @tags)" }).setData('some datadog incrementBy message').setValue(400).setRate(1).setTags('env:test')
  gauge = new datadog(tagline).setConfig({ "format": "gauge(@data, @value, @simple_rate, @tags)" }).setData('some datadog gauge message').setValue(400).setRate(1).setTags('env:staging:east')
  histogram = new datadog(tagline).setConfig({ "format": "histogram(@data, @value, @simple_rate, @tags)" }).setData('some datadog histogram message').setValue(1000).setRate(1).setTags('env:histogram')
  set = new datadog(tagline).setConfig({ "format": "set(@data, @value, @simple_rate, @tags)" }).setData('some datadog set message').setValue(20).setRate(15).setTags('env:set')

  logger.info('this is an info line').tag(lne).tag(increment).tag(incrementBy).tag(gauge).tag(histogram).tag(set).tagline()
  incrementBy.setValue(600)
  logger.debug('this is an debug line').tag(incrementBy).tagline()
  logger.debug('this is an debug line2').tag(display.show(isFalse.getValue())).tag(increment).tagline()
  logger.debug('this is an debug line3').tag(display.show(isTrue.getValue())).tag(increment).tagline()
} catch (e) {
  console.log('error message here(' + e.message + ')')
}

append = tagline.appender('boolean')
isFalse = new append(tagline).setConfig({ "format": "bool(@boolean)" }).setFalse()
isTrue = new append(tagline).setConfig({ "format": "bool(@boolean)" }).setTrue()
append = tagline.appender('displayLine')
display = new append(tagline).setConfig({ "format": "display(@boolean)" })

logger.debug('show this line').tag(display.show(isTrue.getValue())).tagline()
logger.debug('hide this line').tag(display.show(isFalse.getValue())).tagline()

append = tagline.appender('error')
err = new append(tagline)

append = tagline.appender('class_function')
cfu = new append(tagline)

append = tagline.appender('anyMsg')
act = new append(tagline)
append = tagline.appender('stopwatch')
stw = new append(tagline)
stw.setStart()
logger.info('Hello World log').tag(rte).tag(lne).tagline()

class testClass {
  call_a_function() {
    try {
      logger.info('class/function name can be found here').tag(cfu).tag(lne).tagline()
      throw new Error('This is some sort of an error')
    } catch (e) {
      logger.error('error here').tag(err.setError(e)).tag(stw.setStop()).tag(rte).tagline()
    }
  }
}
var testThisClass = new testClass()
testThisClass.call_a_function()
logger.error('error this').tag(err.setInput("A free form error message.")).tag(rte).tagline()

logger.debug('hello from stopwatch').tag(act.setInput('some messages')).tag(stw.setStop()).tag(rte).tagline()

someNumber = 1000
if (act.getCount() > someNumber) {
  tagline.setOptions({ display: ["trace", "debug", "info", "warn", "error", "fatal", "mark"] })
} else {
  tagline.setOptions({ display: ["error", "fatal"] })   //just display errors and fatal
}

tagline.setOptions({ display: ["trace", "info", "warn", "error", "fatal", "mark"] })    //to display all tags except debug

setTimeout(data => {
  console.log('Done with test. Output in my.log')
  process.exit()
}, 1500)

/* Expected output in my.log
[2019-08-08T14:01:58.402] [debug] myLog - (msg: show this line) bool()
[2019-08-08T14:01:58.434] [info] myLog - (msg: this is an info line) lne(<anonymous>(): log4js-tagline/test.js:56:10)
[2019-08-08T14:01:58.435] [debug] myLog - (msg: this is an debug line)
[2019-08-08T14:01:58.440] [debug] myLog - (msg: this is an debug line3) bool()
[2019-08-08T14:01:58.988] [debug] myLog - (msg: show this line) display(@boolean)
[2019-08-08T14:01:59.091] [info] myLog - (msg: Hello World log) rte(/test) lne(<anonymous>(): log4js-tagline/test.js:303:8)
[2019-08-08T14:01:59.147] [info] myLog - (msg: class/function name can be found here) class/function name(testClass.call_a_function) lne(call_a_function(): log4js-tagline/test.js:308:14)
[2019-08-08T14:01:59.169] [error] myLog - (msg: error here) error(testClass.call_a_function: This is some sort of an error) stopwatch(8/8/2019, 2:01:59 PM - 8/8/2019, 2:01:59 PM = 0.097/mili) rte(/test)
[2019-08-08T14:01:59.197] [error] myLog - (msg: error this) error(msg: A free form error message.) rte(/test)
[2019-08-08T14:01:59.220] [debug] myLog - (msg: hello from stopwatch) msg(some messages) stopwatch(8/8/2019, 2:01:59 PM - 8/8/2019, 2:01:59 PM = 0.146/mili) rte(/test)
*/