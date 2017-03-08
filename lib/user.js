let redis = require('redis'); //引入redis数据库模块
let bcrypt = require('bcryptjs'); //引入bcrypt加密模块
let db = redis.createClient(); //创建数据库客户端

class User {
	constructor(obj) { //合并值
			for (let key in obj) {
				this[key] = obj[key];
			}
		}
		//save data fn
	save(fn) {
			if (this.id) { //用户存在就更新数据
				this.update(fn);
			} else {
				let user = this;
				db.incr('user:ids', (err, id) => { //创建唯一ID
					if (err) return fn(err);
					user.id = id;
					user.hashPassword((err) => {
						if (err) return fn(err);
						user.update(fn); //保存用户属性
					});
				});
			}
		}
		//update data fn
	update(fn) {
			let user = this,
				id = user.id;

			db.set('user:id:' + user.name, id, (err) => { //用名称索引用户ID
				if (err) return fn(err);
				db.hmset('user:' + id, user, (err) => { //redis哈希存储数据
					fn(err);
				});
			});
		}
		//password the data fn
	hashPassword(fn) {
			let user = this;
			bcrypt.genSalt(12, (err, salt) => { //生成12个字符的盐
				if (err) return fn(err);
				user.salt = salt; //设定盐以便保存
				bcrypt.hash(user.pass, salt, (err, hash) => {
					if (err) return fn(err);
					user.pass = hash; //设定哈希以便保存
					fn();
				});
			});
		}
		//transform the data to json
	toJSON() {
		return {
			id: this.id,
			name: this.name
		}
	}
};
//find user id by name fn
User.getByName = (name, fn) => { //根据名称查找用户ID
	User.getId(name, (err, id) => {
		if (err) return fn(err);
		User.get(id, fn); //用ID抓取用户
	});
};
//find by id fn
User.getId = (name, fn) => {
	db.get('user:id:' + name, fn); //取得名称索引ID
};
//get object hash fn
User.get = (id, fn) => {
	db.hgetall('user:' + id, (err, user) => { //获取普通对象哈希
		if (err) return fn(err);
		fn(null, new User(user)); //将普通对象转换为新的User对象
	});
};
//check the name and password fn
User.authenticate = (name, pass, fn) => {
	User.getByName(name, (err, user) => { //通过名称查找用户
		if (err) return fn(err);
		if (!user.id) return fn();
		bcrypt.hash(pass, user.salt, (err, hash) => { //对给出的密码做处理
			if (err) return fn(err);
			if (hash == user.pass) return fn(null, user); //匹配发现项
			fn();
		});
	});
};

module.exports = User;