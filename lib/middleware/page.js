module.exports = (fn,perpage)=>{
	perpage = perpage || 10;
	return function (req,res,next) {
		let page = Math.max(parseInt(req.param('page') || '1' ,10),1)-1;//每页记录条数默认值为10

		fn((err,total)=>{
			if(err) return next(err);

			req.page = res.locals.page = {		//保存page属性以便引用
				number :page,
				perpage:perpage,
				from   :page*perpage,
				to     :page*perpage+perpage-1,
				total  :total,
				count  :Math.ceil(total/perpage)
			};
			next();						//将控制权交给下一个中间件
		});
	}
};