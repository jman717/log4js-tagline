"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class Organizational extends app_base{
	constructor(parent) {
		super(parent)
		var t = this
		t.aname = 'organizational.js'
		t.setFormat("org(@org)")
	}	
	
	format_line(){
		var t = this
		return t.format.split("@org").join(t.input)
	}	
}

