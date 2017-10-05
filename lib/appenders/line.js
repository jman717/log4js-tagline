"use strict";

var app_base = require('./app_base.js')

exports = module.exports = class Line extends app_base{
	constructor() {
		super();
		var t = this;
		t.aname = 'line.js';
		t.xname = '';
		t.file = '';
		t.line = '';
		t.column = '';
		t.setFormat("line(@name: @file:@line:@column)");
	}	
	
	format_line(){
		var t = this;
		try{
			return t.format
				.split("@name").join(t.xname)
				.split("@file").join(t.file)
				.split("@line").join(t.line)
				.split("@column").join(t.column);
		}catch(e){
			console.log('format_line error: ' + e.message);
		}
	}

    setTrace(v){
        var t = this; //new change
		var fs, n, vn, f, p;
        try{
            n = v.name.split('.');
            vn = n.pop();
            fs = v.file;
            if(v.file.indexOf('\\')>-1)
            	fs = v.file.split('\\');
            if(v.file.indexOf('/')>-1)
                fs = v.file.split('/');
            f = fs.pop();
            p = fs.pop();
            t.xname = vn;
            t.file = p + '/' + f;
            t.line = v.line;
            t.column = v.column;
        }catch(e){
            return;
        }
    }
}
