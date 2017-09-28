"use strict";

var app_base = require('./app_base.js')

exports = module.exports = class Counter extends app_base{
	constructor() {
		super();
		var t = this;
		//var t = super().getThis();
		t.aname = 'counter.js';
		t.count = 0;
		t.setFormat("stw(@start - @stop = @elapsed)");
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

