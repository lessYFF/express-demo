let express = require('express'),
	res     = express.response;

res.message = function(msg,type){		//重定向会重置数据，故把数据放在会话中
	let	_type = type || 'info';
	let sess  = this.req.session;
	sess.messages = sess.messages || [];
	sess.messages.push({type:_type,string:msg});
}

res.error   = function (msg){		//响应的错误处理
	return this.message(msg,'error');
}

module.exports = (req,res,next)=>{	//让messages和removeMessages()可以在任何视图使用
	res.locals.messages = req.session.messages || [];
	res.locals.removeMessages = ()=>{
		req.session.messages = [];
	};
	next();
};