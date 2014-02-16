var diaryService = require("../service/DiaryService");

exports.diary = function(req, res){
	diaryService.get({}, function (err, result) {
		// console.dir(data);
    	res.send(JSON.stringify(result));
	});
};

exports.post = function (req, res){
	var title = req.body.title;
	var article = req.body.article;
	var rel = req.body.rel;
	var time = req.body.time;
	var categories = req.body.categories;
	console.log("post param: " +JSON.stringify(req.body));
	var data = {title:title, article:article, rel:rel,time: time,categories:categories };
	diaryService.save(data, function(err, result){
		//console.dir(err);
		if (err) {
			res.send({success:0});
		} else {
			
			res.send(JSON.stringify({success:1,result:result}));
		}
	})
};
exports.page = function (req, res){
	// var param = JSON.parse(req.body);
	var page = req.query.page;
	// console.log("reques: ");
	// console.dir(param)
	if (typeof page === "undefined" || !parseInt(page)) {
		res.send("page 错误");
		return;
	}
	diaryService.get({page:page,categories:req.body.categories}, function(err, result){
		console.dir(err);
		if (err) {
			res.send({success:0});
		} else {
			res.send(JSON.stringify(result));
		}
	})
};

exports.getPage = function (req, res){
	// var param = JSON.parse(req.body);
	var page = req.query.page;
	// console.log("reques: ");
	// console.dir(param)
	if (typeof page === "undefined" || !parseInt(page)) {
		res.send("page 错误");
		return;
	}
	diaryService.getPage({page:page,categories:req.body.categories}, function(err, result){
		console.dir(err);
		if (err) {
			res.send({success:0});
		} else {
			res.send(result);
		}
	})
};