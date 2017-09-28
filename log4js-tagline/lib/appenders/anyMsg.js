"use strict";

var app_base = require('./app_base.js')

exports = module.exports = class anyMsg extends app_base{
	constructor() {
		super();
		var t = this;
		//var t = super().getThis();
		t.aname = 'anyMsg.js';
		t.setFormat("msg(@msg)");
		return t;
	}	
	
	format_line(){
		var t = this;
		return t.format.split(t.replace).join(t.input);
	}	
}
