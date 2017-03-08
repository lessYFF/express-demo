let User = require('../lib/user');

//render form module
exports.form = (req,res) =>{
	res.render('register',{'title':'Register'});
};

//submit form module
exports.submit = (req,res,next)=>{
	let data = req.body.user;
	User.getByName(data.name,(err,user)=>{		//检测用户名是否唯一
		if(err) return next(err);				//数据库连接错误或者其他错误
		if(user.id){							//用户名已经占用
			res.error('Username already taken！');
			res.redirect('back');
		}else{
			let _user = new User({				//创建新用户
					name:data.name,
					pass:data.pass
				});
			_user.save((err)=>{					//保存新用户
				if(err) return next(err);
				req.session.uid = _user.id;		//保存认证uid
				res.redirect('/');
			});
		}
	});
};