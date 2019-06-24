"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class Error extends app_base {
	constructor(parent) {
		super(parent)
		var t = this
		t.aname = 'error.js'
		t.stack = ''
		t.setFormat("error(@object: @error)")
	}

	setStack(s) {
		var t = this
		t.stack = s
		return t
	}

	setError(e) {
		var t = this
		t.count++;
		t.setInput(e.message)
		t.setStack(e.stack)
		return t
	}

	format_line() {
		var t = this, e1, e2 = 'msg'
		try {
			if (t.stack != '') {
				e1 = t.stack.split('at ')
				e2 = e1[1].split(' ')[0]
			}
		} catch (e) {
			//do nothing
		}
		return t.format
			.split("@error").join(t.input)
			.split("@object").join(e2)
	}
}
