Example
---------
```
[2017-09-22 13:40:56.734] [INFO] armLog - route rte(/post/query/countSample) qry(countOLT) lne(processAction(): helper/server.js:110:14)
[2017-09-22 13:40:56.737] [DEBUG] armLog - countVaderOLTs body({"query":"countVaderOLT","ip":"10.231.99.99"} lne(countOLTs(): queries/countVaderOLT.js:9:12)
```

Installation
---------
```
npm install log4js-tagline
```

Usage change
---------
```js
var log4js = require("log4js"),
    log4js_tagline = require("log4js-tagline");

		tagline = new log4js_tagline(log4js, {
			display: ["trace", "debug", "info", "warn", "error", "fatal", "mark"]
		});

