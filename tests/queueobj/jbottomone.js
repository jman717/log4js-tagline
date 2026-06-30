"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2026-06-26
*/

var queue = require("queueobj")

const base = require('./t_base')

var file_data = [
    { props: { id: 100, name: "all", absolute_path: __filename, check: false } },
    { props: { id: 101, name: "func_all", absolute_path: __filename, check: false } },
    { props: { id: 102, name: "top_one", absolute_path: __filename, check: false } },
    { props: { id: 103, name: "bottom_one", absolute_path: __filename, check: false } },
    { props: { id: 104, name: "sync_all", absolute_path: __filename, check: false } },
    { props: { id: 105, name: "status", absolute_path: __filename, check: false } },
    { props: { id: 106, name: "name", absolute_path: __filename, check: false } },
    { props: { id: 107, name: "version", absolute_path: __filename, check: false } }
]

var file_object = class file_obj {
    constructor(props) {
        let t = this, fname = "file_obj.constructor"
        try {
            t.id = props.id
            t.log = props.log
            t.name = props.name
            t.path = props.relative_path
            t.absolute_path = props.absolute_path
            t.status = 'init'
            t.errors = false
            t.error_msg = 'none'

            // if (t.id == 104) {
            //     t.errors = true
            //     t.error_msg = `some sort of error here`    
            // }

            t.process = t.process.bind(t)
            t.do_checks = t.do_checks.bind(t)

            if (props.check) {
                t.do_checks()
            }
        } catch (e) {
            e.message = `${fname} error: ${e.message}`
            throw e
        }

        return t
    }

    do_checks() {
        let t = this, path_to_check,
            last_item = t.absolute_path.split("\\").pop(),
            check_file = t.absolute_path.split(last_item)[0], check_path = t.path.split('/')

        check_file = check_file.replace(/\\/g, "/");
        path_to_check = validPath(t.path);

        if (!path_to_check.valid) {
            t.errors = true
            t.error_msg = `id = ${t.id} name(${t.name}) Error in ${path_to_check.data.input}: ${path_to_check.error})`
        }

        check_path.map((dat, i) => {
            if (/^[a-zA-Z._]+$/.test(dat)) {
                if (dat != '.')
                    check_file += dat + '/'
            }
        })
        check_file = check_file.slice(0, -1)
        try {
            if (!fs.existsSync(check_file)) {
                t.errors = true
                t.error_msg = `id = ${t.id} name(${t.name}) file (${check_file} does not exist)`
            }
        } catch (e) {
            e.message = "file_obj do_checks error: " + e.message
            throw (e)
        }
    }

    process(callback) {
        let t = this
        t.log({ msg: `processing object id ${t.id}. Do a bunch of stuff here.`, type: "info" })
            try {
                if (t.errors)
                    throw new Error(t.error_msg)
            } catch (e) {
                callback({ error: { 'msg': e.message, 'stack': e.stack } })
            }
        callback({ success: { msg: `id = ${t.id} name(${t.name})` } })
    }
}

var tobj = class top_one extends base {
    constructor() {
        super()
        var t = this
        var qObj = new queue()
        qObj.init().process({
            appender: "json_bottom_one",
            xlog: { appender: "log4js-tagline", logger: t.logger },
            exclude_logMsg: [],   /* default [] */
            process_objects: [file_object],
            data_to_process_array: file_data
        }).then((success) => {
            qObj.logMsg({ msg: `test success: {msg: "all objects processed with no errors"}`, type: "success" })
        }, (error) => {
            if (typeof error == "string") {
                qObj.logMsg({ msg: `error: ${error}`, type: "error" })
            } else {
                let add_s = (error.error_count > 1) ? 's' : ''
                qObj.logMsg({ msg: `${error.error_count} error${add_s} detected`, type: "error" })
            }
            var err = new Error('promise failed')
            qObj.logMsg({ msg: err.message, 'stack': err.stack, 'type': "error" })
        })
    }
}

var tst = new tobj()

/* Expected output in my.log
[2026-06-29T22:00:07.005] [debug] myLog - (msg: "BaseQueue.load loading appender(./appenders/json_bottom_one.js)")
[2026-06-29T22:00:07.013] [debug] myLog - (msg: "base.constructor")
[2026-06-29T22:00:07.016] [debug] myLog - (msg: "json_bottom_one.constructor")
[2026-06-29T22:00:07.021] [debug] myLog - (msg: "BaseQueue.process status(init) process_count(0) process array size(0)")
[2026-06-29T22:00:07.023] [debug] myLog - (msg: "json_bottom_one.init")
[2026-06-29T22:00:07.023] [debug] myLog - (msg: "base.init")
[2026-06-29T22:00:07.028] [debug] myLog - (msg: "BaseQueue.process status(process) process_count(0) process array size(1)")
[2026-06-29T22:00:07.029] [debug] myLog - (msg: "json_bottom_one.process length(1)")
[2026-06-29T22:00:07.030] [debug] myLog - (msg: "base.process")
[2026-06-29T22:00:07.031] [debug] myLog - (msg: "base.process status(process) count(1) main objects(1)")
[2026-06-29T22:00:07.039] [trace] myLog - (msg: "processing object id 107. Do a bunch of stuff here.")
[2026-06-29T22:00:07.040] [debug] myLog - (msg: "BaseQueue.process status(process) process_count(1) process array size(1)")
[2026-06-29T22:00:07.040] [debug] myLog - (msg: "json_bottom_one.process length(1)")
[2026-06-29T22:00:07.043] [debug] myLog - (msg: "base.process")
[2026-06-29T22:00:07.045] [debug] myLog - (msg: "BaseQueue.process status(done) process_count(2) process array size(1)")
[2026-06-29T22:00:07.046] [info] myLog - (msg: "id = 107 name(version)")
[2026-06-29T22:00:07.047] [debug] myLog - (msg: "BaseQueue.process status(done) process_count(2) process array size(1)")
[2026-06-29T22:00:07.055] [info] myLog - (msg: "test success: {msg: \"all objects processed with no errors\"}")
*/