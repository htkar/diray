// var collection = require("../node-mongodb-native.js");
// collection.find({},"title article rel time").toArray(function(err, results) {
//     console.dir(results);
//     // Let's close the db
//     db.close();
// }); 
var mongodb = require("../models/db");
function Diary(diary) {
    this.title = diary.title;
    this.article = diary.article;
    this.rel = diary.rel;
    this.time = diary.time;
}
Diary.get = function (param, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection("test", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // collection.findOne({"time": "2013/05/29 00:00:00"}, function(err, doc){
            //     mongodb.close();
            //     if (doc) {
            //         callback(err, doc);
            //     } else {
            //         callback(err, null);
            //     }
            // });
            var skip = 0;
            pageSize = 25;
            var categories = [];
            var query = {};
            if (typeof param.page !== "undefined") {
            	skip = (param.page - 1) * pageSize;
            }
            if (typeof param.categories !== "undefined" && param.categories.length > 0) {
            	categories = param.categories;
            	query.categories = {$in:categories};
            }
            var cursor = collection.find(query).sort({time:-1});
            var length = 0;
            cursor.count(function(err, count) {
            	if (!err) {
            		length = count;
            		var end = false;
                    console.log("skip + pageSize=" + (skip + pageSize) + ", length:" + length);
                    if (skip + pageSize >= length) {
                    	end = true;
                    }
                    cursor.skip(skip).limit(pageSize).toArray(function(err, results) {
                        // console.dir(results);
                        // Let's close the db
                        db.close();
                        callback(err, results, end);
                    });
            	}
            });
            
        });
    });
};
Diary.save = function (data, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection("test", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // collection.findOne({"time": "2013/05/29 00:00:00"}, function(err, doc){
            //     mongodb.close();
            //     if (doc) {
            //         callback(err, doc);
            //     } else {
            //         callback(err, null);
            //     }
            // });
            collection.save(data, function (err, result) {
                db.close();
//                console.log(result);
                callback(err, result);
            });
        });
    });
}
module.exports = Diary;