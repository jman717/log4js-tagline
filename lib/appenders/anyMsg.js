"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class anyMsg extends app_base{
	constructor(parent) {
		super(parent)
		var t = this
		t.aname = 'anyMsg.js'
		t.setFormat("msg(@msg)")
		return t
	}	
	
	format_line(){
		var t = this
		return t.format.split("@msg").join(t.input)
	}	
}
