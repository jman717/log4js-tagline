var assert = require('assert');

describe('app', function () {

    describe('require', function () {
        it('colors', function () {
            try {
                colors = require('colors')
                if (typeof colors == 'undefined') {
                    throw new Error('no colors')
                }
            } catch (e) {
                assert(false)
            }
        })

        it('node-dogstatsd', function () {
            try {
                StatsD = require('node-dogstatsd').StatsD
                if (typeof StatsD == 'undefined')
                    throw new Error('no StatsD')
            } catch (e) {
                assert(false)
            }
        })
    })

    describe('functions', function () {
        var app, application
        beforeEach(function () {
            application = require('../app.js')
        })

        it('app.constructor should fail with without parameters', function () {
            assert.throws(() => app = new application(), Error)
        })
    })
})
