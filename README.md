

log4js-tagline is an extension of the node logging package log4js. Tags can be created and used independently or in combination with other tags; the output can be directed to both a local file, console, datadog, combinations of both on the fly or none. Each tag itteration is incremented.

Included tag appenders:

* route - to display path or service name
* line - displays file name and line number
* action - displays action name
* stopwatch - displays time elapsed for a particular tag.
* counter - displays counts applied to a tag.
* error - displays an error message from the try/catch block along with the class/function if available from the stack, or simply display an error message.
* display - ability to turn tags on or off
* counter - count how many itterations a tag has been inputted to. Helpfull in turning tags on/off.
* datadog - for metrics including increment, incrementBy, gauge, histogram, and set.
* email - Appenders and cron settings allows flexible email delivery options


Installation
---------
```
npm install log4js-tagline
```

Mocha Test
---------
```
npm test
```

General Setup Test
---------
```
node test
```

Usage
---------
```js
var log4js = require("log4js"),
    log4js_tagline = require("log4js-tagline")

log4js.configure({
    appenders: { myLog: { type: 'file', filename: 'my.log' } },
    categories: { default: { appenders: ['myLog'], level: 'debug' } }
})

tagline = new log4js_tagline(log4js, {
    "display": ["trace", "debug", "info", "warn", "error", "fatal", "mark"],
    "output": {
        "to_console": { "show": true, "color": "yellow" },      /* send output to console.log */
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

append = tagline.appender('email')
email = new append(tagline, {smtp_config : {
    host: "smtp host goes here",
    port: "smtp port goes here",
    auth: {
      user: "user name here",
      pass: "password goes here",
      type: "SMTP",
    },
    secure: ""
  },
  emailThrottle : {
    cronTime: "0,15,30,45 0-59 * * * *"   /* This is optional. Cron setting for how often you want emails to be sent. */
  }
}).init()

var email_instant = email.appender({type: 'instant'})
email_instant.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This will appear in the email</h2>"
  }
})
email_instant.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is another email</h2>"
  }
})

var email_threshold = email.appender({
  type: 'threshold',
  threshold_number: 1000,
  test_as: 'greater_than'
})
email_threshold.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This will appear in the email</h2>"
  }
})

var email_escallating = email.appender({
  type: 'escallating'                         
})
email_escallating.add({cron_config : {
    cronTime: "0 0-59 * * * *"
  }
})
email_escallating.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is the first email that will appear</h2>"
  }
})
email_escallating.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is the second email that will appear</h2>"
  }
})

var email_bundle = email.appender({
  type: 'bundle'                         
})
email_bundle.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is the first email that will appear</h2>"
  }
})
email_bundle.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is the second email that will appear</h2>"
  }
})
email_bundle.add({
  bundle : {
    "html": "<h4>Here is something we need to know</h4>"
  }
})
email_bundle.add({
  bundle : {
    "html": "<h4>Something else</h4>"
  }
})
email_bundle.add({
  bundle : {
    "html": "<h4>Cool</h4>"
  }
})

append = tagline.appender('email')
email = new append({smtp_config : {
    host: "smtp host goes here",
    port: "smtp port goes here",
    auth: {
      user: "user name here",
      pass: "password goes here",
      type: "SMTP",
    },
    secure: ""
  },
  emailThrottle : {
    cronTime: "0,15,30,45 0-59 * * * *"   /* This is optional. Cron setting for how often you want emails to be sent. */
  }
}).init()

var email_instant = email.appender({type: 'instant'})
email_instant.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This will appear in the email</h2>"
  }
})
email_instant.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is another email</h2>"
  }
})

var email_threshold = email.appender({
  type: 'threshold',
  threshold_number: 1000,
  test_as: 'greater_than'
})
email_threshold.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This will appear in the email</h2>"
  }
})

var email_escallating = email.appender({
  type: 'escallating'                         
})
email_escallating.add({cron_config : {
    cronTime: "0 0-59 * * * *"
  }
})
email_escallating.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is the first email that will appear</h2>"
  }
})
email_escallating.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is the second email that will appear</h2>"
  }
})

var email_bundle = email.appender({
  type: 'bundle'                         
})
email_bundle.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is the first email that will appear</h2>"
  }
})
email_bundle.add({
  email_setup : {
    "from": "some email address",
    "to": "some email address",
    "subject": "try me out",
    "html": "<h2>This is the second email that will appear</h2>"
  }
})
email_bundle.add({
  bundle : {
    "html": "<h4>Here is something we need to know</h4>"
  }
})
email_bundle.add({
  bundle : {
    "html": "<h4>Something else</h4>"
  }
})
email_bundle.add({
  bundle : {
    "html": "<h4>Cool</h4>"
  }
})

append = tagline.appender('boolean') 
isFalse = new append(tagline).setConfig({"format": "bool(@boolean)"}).setFalse() 
isTrue = new append(tagline).setConfig({"format": "bool(@boolean)"}).setTrue() 
append = tagline.appender('displayLine') 
display = new append(tagline).setConfig({"format": "display(@boolean)"}) 

logger.debug('show this line').tag(display.show(isTrue.getValue())).tagline() 
logger.debug('hide this line').tag(display.show(isFalse.getValue())).tagline() 

append = tagline.appender('anyMsg')
err = new append(tagline)
append = tagline.appender('anyMsg')
act = new append(tagline)
append = tagline.appender('stopwatch')
stw = new append(tagline)
stw.setStart()
logger.info('Hello World log').tag(rte).tag(lne).tagline() 

class testClass {
  call_a_function() {
    try {
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
if(act.getCount() > someNumber){
		tagline.setOptions({display: ["trace", "debug", "info", "warn", "error", "fatal", "mark"]})   
}else{
		tagline.setOptions({display: ["error", "fatal"]})   //just display errors and fatal
}

tagline.setOptions({display: ["trace", "info", "warn", "error", "fatal", "mark"]})    //to display all tags except debug

setTimeout(data => {
  console.log('Done with test. Output in my.log')
  process.exit()
}, 1500)

```

Example log file output
---------
```
[2019-06-10T16:07:45.985] [debug] myLog - (msg: show this line) bool()
[2019-06-10T16:07:46.338] [info] myLog - (msg: this is an info line) lne(<anonymous>(): log4js-tagline/test.js:49:12)
[2019-06-10T16:07:46.339] [debug] myLog - (msg: this is an debug line)
[2019-06-10T16:07:46.341] [debug] myLog - (msg: this is an debug line3) bool()
[2019-06-10T16:07:46.725] [debug] myLog - (msg: show this line) display(@boolean)
[2019-06-10T16:07:46.746] [info] myLog - (msg: Hello World log) rte(/test) lne(<anonymous>(): log4js-tagline/test.js:289:8)
[2019-06-10T16:07:46.750] [error] myLog - (msg: error here) msg(This is an error) stopwatch(6/10/2019, 4:07:46 PM - 6/10/2019, 4:07:46 PM = 0.004/mili) rte(/test)
[2019-06-10T16:07:46.754] [debug] myLog - (msg: hello from stopwatch) msg(some messages) stopwatch(6/10/2019, 4:07:46 PM - 6/10/2019, 4:07:46 PM = 0.008/mili) rte(/test)
```

The following examples are various attempts to email:

```javascript
  email_bundle.attempt().on('success', function(){
    email_bundle.then('stop').then('reset').then('clear_messages').add({
      bundle : {
        "html": "<h1>This is a new message</h1>"
      }
    }).attempt().on('error', function(obj){
      console.log('error: ' + obj.message)
    })
  }).on('error', function(obj){
    console.log('error: ' + obj.message)
  })

  email_instant.attempt().on('success', function(){
    email_instant.then('stop').then('reset')
  }).on('error', function(){
    console.log('error: ' + obj.message)
  })
  
  email_escallating.attempt().on('success', function(){
    email_escallating.attempt().on('success', function(){
      email_escallating.then('stop').then('reset').attempt().on('success', function(){
        email_escallating.then('stop').then('reset')
      }).on('error', function(){
        console.log('error: ' + obj.message)
      })
    }).on('error', function(){
      console.log('error: ' + obj.message)
    })
  }).on('error', function(){
    console.log('error: ' + obj.message)
  })

  email_threshold.attempt({submit: 1001}).on('success', function(obj){
    console.log('threshold debug 10.00')
  }).on('error', function(){
    console.log('error: ' + obj.message)
  })
  
....
```
