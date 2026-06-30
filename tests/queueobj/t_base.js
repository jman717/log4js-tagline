"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2026-06-26
*/


var log4js = require("log4js"),
  log4js_tagline = require("../../app.js")

module.exports = class t_base {
  constructor() {
    var t = this;

    log4js.configure({
      appenders: { myLog: { type: 'file', filename: 'my.log' } },
      categories: { default: { appenders: ['myLog'], level: 'debug' } }
    })

    t.tagline = new log4js_tagline(log4js, {
      "display": ["trace", "debug", "info", "warn", "error", "fatal", "mark"],
      "output": {
        "to_console": {
          "show": true, "color": {
            "trace": "bgRed",
            "debug": "magenta",
            "info": "green",
            "warn": "yellow",
            "error": "red",
            "fatal": "bgRed",
            "mark": "white"
          }
        },      /* send output to console.log */
        "to_local_file": true,   /* send output to the local file */
        "to_datadog": false        /* send output to datadog (when the datadog appender is configured) */
      }
    })

    t.logger = log4js.getLogger('myLog')
  }

  getTagline () {
    return this.tagline
  }
}



