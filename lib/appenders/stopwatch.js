"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

exports = module.exports = class Stopwatch extends app_base{
	constructor(parent) {
		super(parent)
		var t = this
		t.aname = 'stopwatch.js'
		t.start = {"string":"", "time": null}
		t.stop = {"string":"", "time": null}
		t.elapsed = {"string":"", "time": null}
		t.setFormat("stopwatch(@stop - @start = @elapsed/mili)")
		t.setStart()
	}	
	
	format_line(){
		var t = this
		try{
			return t.format
				.split("@start").join(t.start.string)
				.split("@stop").join(t.stop.string)
				.split("@elapsed").join(t.elapsed.string)
		}catch(e){
			console.log('format_line error: ' + e.message)
		}
	}	
	
	setStart(){
		var t = this
		t.start.time = new Date()
		t.start.string = t.start.time.toLocaleString()
		return t
	}
	
	setStop(){
		var t = this
		try{
			t.stop.time = new Date()
			t.stop.string = t.stop.time.toLocaleString()
			t.elapsed.time = (t.stop.time.getTime() - t.start.time.getTime()) / 1000
			t.elapsed.string = t.elapsed.time.toLocaleString()
			return t
		}catch(e){
			console.log('setStop error: ' + e.message)
		}
	}
}

