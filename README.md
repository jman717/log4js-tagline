

log4js-tagline is an extension of the node logging package log4js. Tags can be created and used independently or in combination with other tags. Tag are counted and the output can be turned on and off.
Included tag appenders:

* route - to display path or service name
* line - displays file name and line number
* action - displays action name
* stopwatch - displays time elapsed for a particular tag.
* counter - displays counts applied to a tag.
* error - displays an error from a try/catch block applied to a tag.
* display - ability to turn tags on or off
* counter - count how many itterations a tag has been inputted to. Helpfull in turning tags on/off.

Installation
---------
```
npm install log4js
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
});

tagline = new log4js_tagline(log4js, {
    display: ["trace", "debug", "info", "warn", "error", "fatal", "mark"]
});

append = tagline.appender('route');
rte = new append().setConfig({"format": "rte(@route)"}).setInput('/');

append = tagline.appender('line');
lne = new append().setConfig({"format": "lne(@name(): @file:@line:@column)"});

append = tagline.appender('error');
err = new append().setConfig({"format": "msg(@error)"});

append = tagline.appender('anyMsg');
act = new append().setConfig({"format": "act(@action)", "replace": "@action"});

append = tagline.appender('stopwatch');
stw = new append().setConfig({"format": "stopwatch(@stop - @start = @elapsed/mili)"});

const logger = log4js.getLogger('myLog');
logger.level = 'debug';

append = t.tagline.appender('boolean');
isFalse = new append().setConfig({"format": "bool(@boolean)"}).setFalse();
isTrue = new append().setConfig({"format": "bool(@boolean)"}).setTrue();
append = t.tagline.appender('displayLine');
display = new append().setConfig({"format": "display(@boolean)"});

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
