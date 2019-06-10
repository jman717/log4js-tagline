"use strict";

/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2018-10-25
*/

const app_base = require('./app_base.js')
      ,estd = require('email-smtp-cron-delivery')

exports = module.exports = class email extends app_base{
	constructor(parent, {smtp_config} = {}) {
    super(parent)
    var t = this
    try{
      t.smtp_config = arguments[0]
      t.aname = 'email.js'
      t.escd = new estd(t.smtp_config).init()
      return t.escd
    }catch(e){
      console.log(t.aname + ' constructor error: ' + e.message);
    }
	}	
}
