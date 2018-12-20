"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2018-10-25
*/

const app_base = require('./app_base.js')
      //,esdd = require('email-smtp-design-delivery')
      ,estd = require('email-smtp-cron-delivery')

exports = module.exports = class email extends app_base{
	constructor({smtp_config} = {}) {
    super()
    var t = this
    try{
      t.smtp_config = arguments[0]
      t.aname = 'email.js'
      t.escd = new estd(t.smtp_config).init()
      return t
    }catch(e){
      console.log(t.aname + ' constructor error: ' + e.message);
    }
	}	

  appender({type} = {}){
    var t = this
    try{
      return t.escd.appender(arguments[0])
    }catch(e){
       console.log('appender error: ' + e.message);
    }
  }
}
