"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
* Main processing app
*/

var colors = require('colors'),
    StatsD = require('node-dogstatsd').StatsD,
    setup_owner,
    owner,
    parent

class TagLine {
    constructor(log4js, { display, output }) {
        var t = this
        try {
            owner = t
            parent = t
            t.log4js = log4js
            t.datadog
            t.dogstatsd
            t.to_local_file = true
            t.to_datadog = true
            t.setOptions({ display, output })
            t.appenders_dir = './lib/appenders/'
            t.setup()
        } catch (e) {
            e.message = "log4js-tagline app.js init error: " + e.message
            throw (e)
        }
    }

    init({ datadog }) {
        var t = owner
        try {
            if (t.dogstatsd != undefined)
                return t

            if (datadog != undefined && datadog.StatsD_Ip != undefined) {
                t.dogstatsd = new StatsD(datadog.StatsD_Ip)
                return t
            }
            throw new Error('datadog not defined')
        } catch (e) {
            e.message = "log4js-tagline app.js init error: " + e.message
            throw (e)
        }
    }

    setup() {
        var t = this
        try {
            var logger = t.log4js.getLogger()
            var arr = ["trace", "debug", "info", "warn", "error", "fatal", "mark"]
            arr.forEach(function (method) {
                var original = logger.constructor.prototype[method]
                logger.constructor.prototype[method] = function log(msg) {
                    this.original = original
                    this.method = method
                    this.log = log
                    this.xtrace = t.getTrace(log)
                    this.args = ['(msg: ' + msg + ')']
                    setup_owner = this
                    this.tagline = t.tagline
                    this.tag = t.tag
                    return t
                }
            })
            return t
        } catch (e) {
            console.log('log4js-route.js error: ' + e.message)
        }
    }

    setOptions({ display, output }) {
        var t = this
        try {
            t.showLine = (typeof display == "undefined") ? [] : display
            if (typeof output == "undefined")
                return
            if (typeof output.to_console == "undefined")
                throw new Error('output.to_console is undefined')
            if (typeof output.to_local_file == "undefined")
                throw new Error('output.to_local_file is undefined')
            if (typeof output.to_datadog == "undefined")
                throw new Error('output.to_datadog is undefined')
            t.to_console = output.to_console
            t.to_local_file = output.to_local_file
            t.to_datadog = output.to_datadog
        } catch (e) {
            e.message = "log4js-tagline app.js setOptions error: " + e.message
            console.log(e.message)
            throw (e)
        }
    }

    getTrace(caller) {
        var t = this
        try {
            var original = Error.prepareStackTrace,
                error = {}
            Error.prepareStackTrace = t.prepareStackTrace
            Error.captureStackTrace(error, caller || getTrace)
            var stack = error.stack
            Error.prepareStackTrace = original
            return stack
        } catch (e) {
            e.message = "log4js-tagline app.js getTrace error: " + e.message
            console.log(e.message)
            throw (e)
        }
    }

    prepareStackTrace(error, structuredStackTrace) {
        var t = this
        var trace = structuredStackTrace[0]
        if (typeof trace == 'undefined')
            return
        if (typeof trace.getFileName == 'undefined')
            return
        return {
            // method name
            name: trace.getMethodName() || trace.getFunctionName() || "<anonymous>",
            // file name
            file: trace.getFileName(),
            // line number
            line: trace.getLineNumber(),
            // column number
            column: trace.getColumnNumber()
        }
    }

    tagline() {
        try {
            var t = setup_owner, color

            var p = parent
            if (owner.to_console.show) 
                console.log(JSON.stringify(t.args)[owner.to_console.color])               
            if (p.showLine.indexOf(t.method) > -1) {
                t._log(t.method, t.args)
            }
            return t
        } catch (e) {
            e.message = "log4js-tagline app.js tagline error: " + e.message
            console.log(e.message.red)
            throw (e)
        }

    }

    tag(o) {
        var t = setup_owner
        try {
            if (typeof o == undefined || typeof o.aname == undefined)
                return t
            if (typeof o.get_output == 'function' && typeof o.tf != 'undefined') {
                if (!o.tf) {
                    t.method = 'do_not_show'
                    return t
                }
            }
            if (!o.parent.to_local_file)
                t.method = 'do_not_show'
            switch (o.aname) {
                case 'displayLine.js':
                    if (!o.getValue())
                        t.method = 'do_not_show'
                    break
                case 'line.js':
                    o.setTrace(t.xtrace)
                    break
                case 'datadog.js':
                    if (o.parent.to_datadog) {
                        o.monitor()
                    }
                    return t
            }
            t.args.push(o.get_output())
            return t
        } catch (e) {
            e.message = "log4js-tagline app.js tag error: " + e.message
            console.log(e.message.red)
            throw (e)
        }
    }

    appender(name) {
        var t = owner
        try {
            var a = t.appenders_dir + name + '.js'
            console.log('tagline appender file loading=' + a.green)
            return require(a)
        } catch (e) {
            e.message = "log4js-tagline app.js appender error: " + e.message
            console.log(e.message)
            throw (e)
        }
    }
}

exports = module.exports = function (log4js, options) {
    return new TagLine(log4js, options)
}