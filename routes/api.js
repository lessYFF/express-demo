let express = require('express');
let User    = require('../lib/user');
let Entry   = require('../lib/entry');

exports.auth = express.basicAuth(User.authenticate);

exports.user = (req,res,next)=>{
	User.get(req.params.id,(err,user)=>{
		if(err) return next(err);
		if(!user.id) return res.send(404);
		res.json(user);
	});
}

exports.entries = (req,res,next)=>{
	let page = req.page;
	Entry.getRange(page.from,page.to,(err,entries)=>{
		if(err) return next(err);
		res.format({
			'application/json':function(){
				res.send(entries);
			},
			'application/xml':function(){
				res.render('xml',{entries:entries});
			}
		});
	});
}