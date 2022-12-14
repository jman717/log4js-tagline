"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2022-12-13
*/

exports = module.exports = class app_base{
	constructor(parent) {
		var t = this
		t.parent = parent
		t.aname = ''
		t.config = {}
		t.output = ''
		t.format = ''
		t.replace = ''
		t.aname = ''
		t.file = ''
		t.line = ''
		t.column = ''
		t.input = ''
		t.count = 0
		t.countUse = true
	}
	
	ping(){
		return;
	}
	
	get_output(){		
		try{
			return this.format_line();			
		}catch(e){
			console.log('get_output error: ' + e.message);
		}
	}
	
	setInput(v){
		var t = this;
		t.input = v;
		t.stack = ''
		t.count++;
		return t;
	}
	
	getCount(){
		return this.count;
	}
	
	useCounter(v){
		var t = this;
		if(typeof v == 'undefined')
			return t.countUse;
		t.countUse = v;
		return t;
	}

	setFormat(v){
		var t = this;
		t.format = v;
		return t;
	}

	setReplace(v){
		var t = this;
		t.replace = v;
		return t;
	}
	
	setConfig({ format }){
		try{
			var t = this
			t.config = format
			t.setFormat(format)
			if(typeof format.replace != 'undefined')
				t.setReplace(format.replace)
			return t
		}catch(e){
			e.message = 'datadog.js app_base.js setConfig error: ' + e.message
			throw (e)
		}
	}
}

