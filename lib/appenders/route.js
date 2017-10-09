"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class Route extends app_base{
	constructor() {
		super();
		var t = this;
		//var t = super().getThis();
		t.aname = 'route.js';
		t.setFormat("route(@route)");
	}	
	
	format_line(){
		var t = this;
		return t.format.split("@route").join(t.input);
	}	
}


