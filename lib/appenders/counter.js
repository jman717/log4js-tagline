"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class Counter extends app_base{
	constructor() {
		super();
		var t = this;
		//var t = super().getThis();
		t.aname = 'counter.js';
		t.count = 0;
		t.setFormat("count(@count)");
	}	
	
	format_line(){
		var t = this;
		return t.format.split("@count").join(t.input);
	}	
	
	add(v){
		var t = this;
		t.count += v;
		t.setInput(t.count);
		return t;
	}	
	
	subtract(v){
		var t = this;
		t.count -= v;
		t.setInput(t.count);
		return t;
	}	
	
	reset(){
		var t = this;
		t.count = 0;
		return t;
	}	
}

