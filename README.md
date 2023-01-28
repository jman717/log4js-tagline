[![npm Package](https://img.shields.io/npm/v/log4js-tagline.svg)](https://www.npmjs.org/package/log4js-tagline)
[![License](https://img.shields.io/npm/l/log4js-tagline.svg)](https://github.com/jman717/log4js-tagline/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/log4js-tagline.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/log4js-tagline/)

log4js-tagline is an extension of the node logging package log4js. Tags can be created and used independently or in combination with other tags; the output can be directed to both a local file, console, datadog, combinations of both on the fly or none. Each tag itteration is incremented.

---------

Included object processing:

* queueObj - Support for dynamic objects with all the tagline appenders 
* queueJson - Support for dynamic objects with all the tagline appenders 

Included tag appenders:

* route - to display path or service name
* line - displays file name and line number
* action - displays action name
* stopwatch - displays time elapsed for a particular tag.
* counter - displays counts applied to a tag.
* error - displays an error message from the try/catch block along with the class/function if available from the stack, or simply display an error message.
* class_function - display the class and function name.
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

General Setup Tests
---------
```
npm run test_basic
npm run test_qObjAll
npm run test_qObjBottom_One
npm run test_qJsonTop_One
npm run test_qJsonAll
npm run test_qJsonBottom_One
npm run test_qJsonTop_One


```
