let User = require('../lib/user');

//render form module
exports.form = (req,res) =>{
	res.render('login',{'title':'Login'});
};

//submit module
exports.submit = (req,res,next)=>{
	let data = req.body.user;
	User.authenticate(data.name,data.pass,(err,user)=>{   //检测凭证
		if(err) return next(err);
		if(user){										  //处理凭证有效用户
			req.session.uid = user.id;
			res.redirect('/');
		}else{											  //处理无效用户
			res.error('Sorry! invalid credentials.');
			res.redirect('back');
		}
	});
};

//logout module
exports.logout = (req,res)=>{
	req.session.destroy((err)=>{
		if(err) throw err;
		res.redirect('/');
	});
};