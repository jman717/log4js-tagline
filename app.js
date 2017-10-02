"use strict";

/*
* @author Jim Manton: jrman@risebroadband.com
* @since 2017-10-01
*/

var colors = require('colors');

var owner;
var parent;

class TagLine{
    constructor(log4js, options) {
        var t = this;
        parent = t;
        t.log4js = log4js;
        t.showLine = options.display;
        t.appenders_dir = './lib/appenders/';
        t.setup();
    }

    setup(){
        var t = this;
        try{
            var logger = t.log4js.getLogger();
            ["trace", "debug", "info", "warn", "error", "fatal", "mark"].forEach(function (method) {
                //["warn", "error", "fatal"].forEach(function (method) {
                var original = logger.constructor.prototype[method];
                logger.constructor.prototype[method] = function log(){
                    this.original = original;
                    this.method = method;
                    this.args = [].slice.call(arguments);
                    this.log = log;
                    this.xtrace = t.getTrace(log);
                    owner = this;
                    this.tagline = t.tagline;
                    this.tag = t.tag;
                    //setTimeout(this.tagline, 2);
                    //return original.apply(this, this.args);
                    return t;
                };
            });
            return t;
        }catch(e){
            console.log('log4js-route.js error: ' + e.message);
        }
    }

    getTrace(caller){
        var t = this;
        try{
            var original = Error.prepareStackTrace,
                error = {};
            Error.prepareStackTrace = t.prepareStackTrace;
            Error.captureStackTrace(error, caller || getTrace);
            var stack = error.stack;
            Error.prepareStackTrace = original;
            return stack;
        }catch(e){
            console.log('line.js error: ' + e.message);
        }
    }

    prepareStackTrace(error, structuredStackTrace){
        var t = this;
        var trace = structuredStackTrace[0];
        if(typeof trace == 'undefined')
            return;
        if(typeof trace.getFileName == 'undefined')
            return;
        return {
            // method name
            name: trace.getMethodName() || trace.getFunctionName() || "<anonymous>",
            // file name
            file: trace.getFileName(),
            // line number
            line: trace.getLineNumber(),
            // column number
            column: trace.getColumnNumber()
        };
    }

    tagline(){
        var t = owner;
        var p = parent;
        if(p.showLine.indexOf(t.method) > -1)
            t.original.apply(t, t.args);
        else
            return t;
        return t;

    }

    tag(o){
        var t = owner;
        try{
            if(typeof o == 'undefined' || typeof o.aname == 'undefined')
                return t;
            if(typeof o != 'undefined' && o.aname == 'line.js')
                o.setTrace(t.xtrace);
            t.args.push(o.get_output());
            return t;
        }catch(e){
            console.log('tag error: ' + e.message.bold.red);
        }
    }

    appender(name, config){
        var t = this;
        try{
            var a = t.appenders_dir + name + '.js';
            console.log('tagline appender file loading=' + a.green);
            return require(a);
        }catch(e){
            console.log('appenders error: ' + e.message);
        }
    }
}

exports = module.exports = function (log4js, options) {
    return new TagLine(log4js, options);
};