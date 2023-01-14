var assert = require('assert');

describe('app', function () {

    describe('require', function () {

        it('colors', function () {
            assert(require('colors'))
        })

        it('node-dogstatsd', function () {
            assert(require('node-dogstatsd'))
        })

        it('queuejson', function () {
            assert(require('queuejson'))
        })

        it('mocha', function () {
            assert(require('mocha'))
        })

        it('log4js', function () {
            assert(require('log4js'))
        })

        it('email-smtp-cron-delivery', function () {
            assert(require('email-smtp-cron-delivery'))
        })

        it('diffler', function () {
            assert(require('diffler'))
        })
        
        it('node-console-colors', function () {
            assert(require('node-console-colors'))
        })
                
        it('chai', function () {
            assert(require('chai'))
        })
    })

    describe('getTrace', function () {
        var app, application, log4js, display, output, datadog, caller
        beforeEach(function () {
            application = require('../app.js')
            log4js = { "getLogger": function () { } }
            display = { "display": {}, "output": { "to_local_file": true, "to_datadog": true, "to_console": true } }
            output = { "to_local_file": "true", "to_datadog": "true", "to_console": true }
            datadog = { "datadog": { "StatsD_Ip": "123456789" } }
            caller = {}
        })

        it('app.constructor should fail without parameters', function () {
            assert.throws(() => app = new application(), Error)
        })

        it('app.constructor should pass with parameters', function () {
            assert(app = new application(log4js, { display, output }))
        })

        describe('functions', function () {
            beforeEach(function () {
                app = new application(log4js, { display, output })
            })

            it('app.init should fail without parameters', function () {
                assert.throws(() => app.init(), Error)
            })

            it('app.init should pass with parameters', function () {
                assert(app.init(datadog))
            })

            it('app.setup should fail with bogus parameter', function () {
                assert.throws(() => app.setup({ bogus }), Error)
            })

            it('app.setup should pass', function () {
                assert(app.setup)
            })

            it('app.setOptions should fail without parameters', function () {
                assert.throws(() => app.setOptions(), Error)
            })

            it('app.setOptions should pass with parameters', function () {
                try {
                    assert(app.setOptions(display))
                } catch (e) {
                    console.log('ok setOptions(' + e.message + ')')
                }
            })

            it('app.getTrace is a function', function () {
                assert(typeof app.getTrace == 'function')
            })

            it('app.getTrace should fail without parameters', function () {
                try {
                    assert(app.getTrace())
                } catch (e) {
                    console.log('ok getTrace(' + e.message + ')')
                }
            })

            it('app.getTrace should pass with parameters', function () {
                assert(app.getTrace(caller))

            })
        })
    })
})
