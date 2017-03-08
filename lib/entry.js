let redis = require('redis');
let db    = redis.createClient();		//创建redis客户端实例

class Entry {
	constructor(obj){					//合并值
		for(let key in obj){
			this[key] = obj[key];
		}
	}

	//保存数据
	save(fn){
		let entryJSON =JSON.stringify(this);

		db.lpush(						//将JSON字符串保存到Redis列表中
				'entries',
				entryJSON,
				(err)=>{
					if(err) return fn(err);
					fn();
				}
			);
	}
};

Entry.getRange = (from,to,fn)=>{
	db.lrange('entries',from,to,(err,items)=>{
		if(err) return fn(err);
		let entries = [];

		items.forEach((item)=>{
			entries.push(JSON.parse(item));
		});
		fn(null,entries);
	});
};	

Entry.count = (fn)=>{
	db.llen('entries',fn);
}


module.exports = Entry;


