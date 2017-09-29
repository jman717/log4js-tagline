
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

tagline = new log4js_tagline(log4js, {
    display: ["trace", "debug", "info", "warn", "error", "fatal", "mark"]
});

append = tagline.appender('route');
rte = new append().setConfig({"format": "rte(@route)"}).setInput('/');

append = tagline.appender('line');
lne = new append().setConfig({"format": "lne(@name(): @file:@line:@column)"});

append = tagline.appender('anyMsg');
act = new append().setConfig({"format": "act(@action)", "replace": "@action"});

append = tagline.appender('stopwatch');
stw = new append().setConfig({"format": "stopwatch(@stop - @start = @elapsed/mili)"});

const logger = log4js.getLogger();
logger.level = 'debug';

stw.setStart();
logger.info('Hello World log').tag(rte).tag(lne).tagline();
logger.debug('hello message').tag(act.setInput('some messages')).tag(stw.setStop()).tag(rte).tagline();
Example output
---------
```
[2017-09-22 13:40:56.734] [INFO] armLog - route rte(/post/query/countSample) qry(countOLT) lne(processAction(): helper/server.js:110:14)
[2017-09-22 13:40:56.737] [DEBUG] armLog - OLTs body({"query":"countVaderOLT","ip":"10.231.99.99"} lne(countOLTs(): queries/countVaderOLT.js:9:12)
[2017-09-29 11:01:21.984] [INFO] default - hello info message rte(/hello_world)
[2017-09-29 11:01:21.988] [ERROR] default - hello error message cnt(3) stopwatch(9/29/2017, 11:01:21 AM - 9/29/2017, 11:01:21 AM = 0.004/mili)
[2017-09-29 11:01:21.988] [DEBUG] default - hello message act(some messages) stopwatch(9/29/2017, 11:01:21 AM - 9/29/2017, 11:01:21 AM = 0.008/mili) rte(/hello_world)
```
