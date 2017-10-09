"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class Error extends app_base{
	constructor() {
		super();
		var t = this;
		//var t = super().getThis();
		t.aname = 'error.js';
		t.setFormat("error(@error)");
	}	
	
	
	format_line(){
		var t = this;
		return t.format.split("@error").join(t.input);
	}	
}
