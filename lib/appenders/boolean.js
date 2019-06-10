"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class Boolean extends app_base{
	constructor(parent) {
		super(parent)
		var t = this
		t.aname = 'boolean.js'
		t.tf = false;
		t.setFormat("bool(@boolean)")
		return t
	}	
	
	format_line(){
		var t = this
		return t.format.split("@boolean").join(t.input)
	}	

	getValue(){
		return this.tf;
	}	
	
	setTrue(){
		var t = this;
		t.tf = true;
		return t;
	}	
	
	setFalse(){
		var t = this
		t.tf = false
		return t
	}	
	
	show(v){
		var t = this
		t.tf = v
		return t
	}
}
