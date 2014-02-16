var diaryDao = require("../dao/ArticleDao");
var yearsDao = require("../dao/yearsDao");
function get(param, callback) {
    
    diaryDao.get(param, function (err, docs, end){
        if (!err) {
            yearsDao.get(function (err,results) {
            	if (!err) {
            		var result = {articles:docs,years:results,end:end};
            		callback(err, result);
            	}
            })
        } else {
        	callback(err, docs);
        }
    });
}
function save(data, callback) {
    var time = data.time && data.time.date();
    if (!time) {
        data.time = (new Date()).str();
    }
    diaryDao.save(data, callback);
}
function getPage(param, callback) {
    
    diaryDao.get(param, function (err, docs, end){
        if (!err) {
            callback(err, docs);
            
        } else {
            callback(err, docs);
        }
    });
}

module.exports.get = get;
module.exports.save = save;
module.exports.getPage = getPage;