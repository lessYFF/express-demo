let User = require('../user');

module.exports= (req,res,next)=>{
	let uid = req.session.uid;		//从会话中取出已登录用户ID
	if(!uid) return next(err);
	User.get(uid,(err,user)=>{		//从Redis中取出已登录用户的数据
		if(err) return next(err);
		req.user = res.locals.user = user;
		next();
	});
};

module.exports= (req,res,next)=>{
	if(req.remoteUser){
		res.locals.user = req.remoteUser;
	}
	let uid = req.session.uid;
	if(!uid) return next();
	User.get(uid,(err,user)=>{
		if(err) return next(err);
		req.user = res.locals.user =user;
		next();
	});
}