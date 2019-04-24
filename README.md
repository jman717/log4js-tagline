

log4js-tagline is an extension of the node logging package log4js. Tags can be created and used independently or in combination with other tags; the output can be directed to both a local file, datadog, combinations of both on the fly or none. Each tag itterations is counted.

Included tag appenders:

* route - to display path or service name
* line - displays file name and line number
* action - displays action name
* stopwatch - displays time elapsed for a particular tag.
* counter - displays counts applied to a tag.
* error - displays an error from a try/catch block applied to a tag.
* display - ability to turn tags on or off
* counter - count how many itterations a tag has been inputted to. Helpfull in turning tags on/off.
* datadog - for metrics including increment, incrementBy, gauge, histogram, and set.
* email - Appenders and cron settings allows flexible email delivery options


Installation
---------
```
npm install log4js-tagline
```

Usage
---------
```js
var log4js = require("log4js"),
var log4js_tagline = require("log4js-tagline");

log4js.configure({
    appenders: { myLog: { type: 'file', filename: 'my.log' } },
    categories: { default: { appenders: ['myLog'], level: 'debug' } }
})

tagline = new log4js_tagline(log4js, {
    "display": ["trace", "debug", "info", "warn", "error", "fatal", "mark"],
    "output": {
        "to_local_file": true,   /* send output to the local file */
        "to_datadog": true        /* send output to datadog (when the datadog appender is configured) */
    }
})

const logger = log4js.getLogger('myLog')
logger.level = 'debug'

append = tagline.appender('boolean')
isFalse = new append(tagline).setConfig({ "format": "bool(@boolean)" }).setFalse()
isTrue = new append(tagline).setConfig({ "format": "bool(@boolean)" }).setTrue()
display = new append(tagline).setConfig({ "format": "display(@boolean)" })

logger.debug('show this line').tag(display.show(isTrue.getValue())).tagline()
logger.debug('do not show this line').tag(display.show(isFalse.getValue())).tagline()

append = tagline.appender('route')
rte = new append(tagline).setConfig({ "format": "rte(@route)" }).setInput('/');

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

var email_bundle = t.email.appender({
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

append = t.tagline.appender('email')
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

var email_bundle = t.email.appender({
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

const logger = log4js.getLogger('myLog');
logger.level = 'debug';

append = tagline.appender('boolean');
isFalse = new append(tagline).setConfig({"format": "bool(@boolean)"}).setFalse();
isTrue = new append(tagline).setConfig({"format": "bool(@boolean)"}).setTrue();
append = tagline.appender('displayLine');
display = new append(tagline).setConfig({"format": "display(@boolean)"});

logger.debug('show this line').tag(display.show(isTrue.getValue())).tagline();
logger.debug('hide this line').tag(display.show(isFalse.getValue())).tagline();


stw.setStart();
logger.info('Hello World log').tag(rte).tag(lne).tagline();

try{
    logger.info('Hello World log').tag(rte).tag(lne).tagline();
}catch(e){
    logger.debug('error here').tag(err.setInput(e.message)).tag(stw.setStop()).tag(rte).tagline();
}
logger.debug('hello message').tag(act.setInput('some messages')).tag(stw.setStop()).tag(rte).tagline();

if(act.getCount() > someNumber){
		log4js_tagline.setOptions({display: ["trace", "debug", "info", "warn", "error", "fatal", "mark"]});  
}else{
		log4js_tagline.setOptions({display: ["error", "fatal"]});  //just display errors and fatal
}


log4js_tagline.setOptions({display: ["trace", "info", "warn", "error", "fatal", "mark"]});   //to display all tags except debug
```

Example output
---------
```
[2017-09-22 13:40:56.734] [INFO] myLog - route rte(/post/query/countSample) qry(countOLT) lne(processAction(): helper/server.js:110:14)
[2017-09-22 13:40:56.737] [DEBUG] myLog - OLTs body({"query":"countOLT","ip":"10.231.99.99"} lne(countOLTs(): queries/countOLT.js:9:12)
[2017-09-29 11:01:21.984] [INFO] myLog - hello info message rte(/hello_world)
[2017-09-29 11:01:21.988] [ERROR] myLog - hello error message count(3) stopwatch(9/29/2017, 11:01:21 AM - 9/29/2017, 11:01:21 AM = 0.004/mili)
[2017-09-29 11:01:21.988] [DEBUG] myLog - hello message act(some messages) stopwatch(9/29/2017, 11:01:21 AM - 9/29/2017, 11:01:21 AM = 0.008/mili) rte(/hello_world)
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
