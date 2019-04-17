"use strict"

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
*/

var app_base = require('./app_base.js')

module.exports = class datadog extends app_base {
	constructor(parent) {
		super(parent)
		var t = this
		t.aname = 'datadog.js'
		t.dogstatsd = parent.dogstatsd
		t.data = 'data goes here'
		t.tags = 'default:tag'
		t.rate = 1
		t.value = 1
		t.setFormat("increment(@data, @simple_rate, @tags)")
		return t
	}

	format_line() {
		var t = this
		try {
			return t.format
			/*
			return t.format.split("@data").join("'" + t.data + "'")
				.split("@simple_rate").join(t.rate)
				.split("@value").join(t.value)
				.split("@tags").join(t.tags)
				*/
		} catch (e) {
			e.message = 'logging.datadog.increment: ' + e.message
			console.log(e.message)
			throw (e)
		}
	}

	monitor() {
		var t = this, line, funcN, data, rate
		try {
			line = t.get_output()
			funcN = line.split('(')[0].toLowerCase()
			switch (funcN) {
				case 'increment':
					t.increment(t.data, t.rate, t.tags)
					break
				case 'incrementby':
					t.incrementBy(t.data, t.value, t.rate, t.tags)
					break
				case 'gauge':
					t.gauge(t.data, t.value, t.rate, t.tags)
					break
				case 'histogram':
					t.histogram(t.data, t.value, t.rate, t.tags)
					break
				case 'set':
					t.set(t.data, t.value, t.rate, t.tags)
					break
				default:
					throw new Error('no funcN(' + funcN + ') to process')
			}
			return t
		} catch (e) {
			e.message = 'logging.datadog.monitor: ' + e.message
			throw (e)
		}
	}
	
	setData(v) {
		var t = this
		t.data = v
		return t
	}

	setRate(v) {
		var t = this
		t.rate = v
		return t
	}

	setValue(v) {
		var t = this
		t.value = v
		return t
	}

	setTags(v) {
		var t = this
		t.tags = v
		return t
	}

	increment(stats, sample_rate, tags) {
		var t = this
		try {
			if (typeof stats != 'string')
				throw new Error('stats is not a string')
			t.dogstatsd.increment(stats, sample_rate, tags)
		} catch (e) {
			e.message = 'logging.datadog.increment: ' + e.message
			throw (e)
		}
	}

	incrementBy(stats, value, tags) {
		var t = this
		try {
			if (typeof stats != 'string')
				throw new Error('stats is not a string')
			t.dogstatsd.incrementBy(stats, value, tags)
		} catch (e) {
			e.message = 'logging.datadog.incrementBy: ' + e.message
			throw (e)
		}
	}

	gauge(stat, value, sample_rate, tags) {
		var t = this
		try {
			if (typeof stat != 'string')
				throw new Error('stat is not a string')
			t.dogstatsd.gauge(stat, value, sample_rate, tags)
		} catch (e) {
			e.message = 'logging.datadog.gauge: ' + e.message
			throw (e)
		}
	}

	histogram(stat, value, sample_rate, tags) {
		var t = this
		try {
			if (typeof stat != 'string')
				throw new Error('stat is not a string')
			t.dogstatsd.histogram(stat, value, sample_rate, tags)
		} catch (e) {
			e.message = 'logging.datadog.histogram: ' + e.message
			throw (e)
		}
	}

	set(stat, value, sample_rate, tags) {
		var t = this
		try {
			if (typeof stat != 'string')
				throw new Error('stat is not a string')
			t.dogstatsd.set(stat, value, sample_rate, tags)
		} catch (e) {
			e.message = 'logging.datadog.set: ' + e.message
			throw (e)
		}
	}

	update_stats(stat, value, sample_rate, tags) {
		var t = this
		try {
			if (typeof stat != 'string')
				throw new Error('stat is not a string')
			t.dogstatsd.update_stats(stat, value, sample_rate, tags)
		} catch (e) {
			e.message = 'logging.datadog.update_stats: ' + e.message
			throw (e)
		}
	}
}


