function parseField(field) {
	return field.split(/\[|\]/).filter((s)=>{return s});
}

function getField(reg,field){
	let val = reg.body;
	field.forEach(prop =>{ val = val[prop]});
	return val;
}

exports.required = (field)=>{
	let _field = parseField(field);			//解析输入域
	return function(req,res,next){
		if(getField(req,_field)){
			next();
		}else{
			res.error(_field.join(' ')+'is required');
			res.redirect('back');
		}
	}
};

exports.lengthAbove = (field,len)=>{
	let _field = parseField(field);
	return function (req,res,next){
		if(getField(req,_field).length > len ){
			next();
		}else{
			res.error(_field.join(' ')+'must have more than'+len+'characters');
			res.redirect('back');
		}
	}
}