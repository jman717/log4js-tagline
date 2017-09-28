"use strict";

var app_base = require('./app_base.js')

exports = module.exports = class Organizational extends app_base{
	constructor() {
		super();
		var t = this;
		//var t = super().getThis();
		t.aname = 'organizational.js';
		t.setFormat("org(@org)");
	}	
	
	format_line(){
		var t = this;
		return t.format.split("@org").join(t.input);
	}	
}

