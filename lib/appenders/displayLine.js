"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class displayLine extends app_base{
	constructor() {
		super();
		var t = this;
		//var t = super().getThis();
		t.aname = 'displayLine.js';
		t.tf = true;
		t.setFormat("display(@display)");
	}	
	
	format_line(){
		var t = this;
		return t.format.split("@display").join(t.input);
	}	
	
	getValue(){
		return this.tf;
	}	
	
	show(v){
		var t = this;
		t.tf = v;
		return t;
	}	
}
