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
            t.to_console = true
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
                    //this.xtrace = t.getTrace(log)  jrm debug does little good in this context, try to find the file it's coming from
                    this.args = [`(msg: ${msg})`]
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

    // getTrace(caller) {   jrm debug
    //     var t = this
    //     try {
    //         var original = Error.prepareStackTrace,
    //             error = {}
    //         Error.prepareStackTrace = t.prepareStackTrace
    //         Error.captureStackTrace(error, caller || getTrace)
    //         var stack = error.stack
    //         Error.prepareStackTrace = original
    //         return stack
    //     } catch (e) {
    //         e.message = "log4js-tagline app.js getTrace error: " + e.message
    //         console.log(e.message)
    //         throw (e)
    //     }
    // }

    // prepareStackTrace(error, structuredStackTrace) {
    //     var t = this
    //     var trace = structuredStackTrace[0]
    //     if (typeof trace == 'undefined')
    //         return
    //     if (typeof trace.getFileName == 'undefined')
    //         return
    //     return {
    //         // method name
    //         name: trace.getMethodName() || trace.getFunctionName() || "<anonymous>",
    //         // file name
    //         file: trace.getFileName(),
    //         // line number
    //         line: trace.getLineNumber(),
    //         // column number
    //         column: trace.getColumnNumber()
    //     }
    // }

    tagline() {
        const colorize = (...args) => ({
            black: `\x1b[30m${args.join(" ")}\x1b[0m`,
            red: `\x1b[31m${args.join(" ")}\x1b[0m`,
            green: `\x1b[32m${args.join(" ")}\x1b[0m`,
            yellow: `\x1b[33m${args.join(" ")}\x1b[0m`,
            blue: `\x1b[34m${args.join(" ")}\x1b[0m`,
            magenta: `\x1b[35m${args.join(" ")}\x1b[0m`,
            cyan: `\x1b[36m${args.join(" ")}\x1b[0m`,
            white: `\x1b[37m${args.join(" ")}\x1b[0m`,
            bgBlack: `\x1b[40m${args.join(" ")}\x1b[0m`,
            bgRed: `\x1b[41m${args.join(" ")}\x1b[0m`,
            bgGreen: `\x1b[42m${args.join(" ")}\x1b[0m`,
            bgYellow: `\x1b[43m${args.join(" ")}\x1b[0m`,
            bgBlue: `\x1b[44m${args.join(" ")}\x1b[0m`,
            bgMagenta: `\x1b[45m${args.join(" ")}\x1b[0m`,
            bgCyan: `\x1b[46m${args.join(" ")}\x1b[0m`,
            bgWhite: `\x1b[47m${args.join(" ")}\x1b[0m`
        })
        try {
            var t = setup_owner, xcolor
            var p = parent
            if (owner.to_console.show) {
                //jrm debug work here https://labex.io/tutorials/colorful-console-output-with-javascript-28200
                t.args.forEach(function (xline) {
                    if (owner.to_local_file) {
                        //console.log(`method: ${t.method}`)
                        switch (owner.to_console.color[t.method].toLowerCase()) {
                            case "black":
                                console.log(colorize(xline).black)
                                break
                            case "red":
                                console.log(colorize(xline).red)
                                break
                            case "green":
                                console.log(colorize(xline).green)
                                break
                            case "yellow":
                                console.log(colorize(xline).yellow)
                                break
                            case "magenta":
                                console.log(colorize(xline).magenta)
                                break
                            case "blue":
                                console.log(colorize(xline).blue)
                                break
                            case "cyan":
                                console.log(colorize(xline).cyan)
                                break
                            case "bggreen":
                                console.log(colorize(xline).bgGreen)
                                break
                            case "bgblue":
                                console.log(colorize(xline).bgBlue)
                                break
                            case "bgblack":
                                console.log(colorize(xline).bgBlack)
                                break
                            case "bgred":
                                console.log(colorize(xline).bgRed)
                                break
                            case "bgyellow":
                                console.log(colorize(xline).bgYellow)
                                break
                            case "bgmagenta":
                                console.log(colorize(xline).bgMagenta)
                                break
                            case "bgcyan":
                                console.log(colorize(xline).bgCyan)
                                break
                            default:
                                console.log(colorize(xline).white)
                        }
                    }
                })
            }
            if (p.showLine.indexOf(t.method) > -1)
                t._log(t.method, t.args)

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