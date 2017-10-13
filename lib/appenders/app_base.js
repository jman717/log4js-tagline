"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

exports = module.exports = class app_base{
	constructor() {
		var t = this;
		t.aname = '';
		t.config = {};
		t.output = '';
		t.format = '';
		t.replace = '';
		t.aname = '';
		t.file = '';
		t.line = '';
		t.column = '';
		t.input = '';
		t.count = 0;
		t.countUse = true;
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
	
	setConfig(jo){
		try{
			var t = this;
			t.config = jo;
			t.setFormat(jo.format);
			if(typeof jo.replace != 'undefined')
				t.setReplace(jo.replace);
			return t;
		}catch(e){
			console.log('error: ' + e.message);
			
		}
	}
}

