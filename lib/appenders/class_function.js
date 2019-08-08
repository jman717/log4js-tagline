"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class stack extends app_base {
	constructor(parent) {
		super(parent)
		var t = this
		t.aname = 'stack.js'
		t.stack = ''
		t.setFormat("class/function name(@object)")
	}

	setStack(s) {
		var t = this
		t.stack = s
		return t
	}

	setError(e) {
		var t = this
		t.count++;
		t.setStack(e.stack)
		return t
	}

	format_line() {
		var t = this, e1, e2 = 'msg'

		try {
			throw new Error('here')
		} catch (e) {
			t.setError(e)
		} finally {
			if (t.stack != '') {
				e1 = t.stack.split('at ')
				e2 = e1[4].split(' ')[0]
			}
			return t.format
				.split("@object").join(e2)
		}
	}
}
