var mongodb = require("../models/db");
var settings = require("../Settings");
exports.get = function (callback) {
    mongodb.getConnection(function(err, db){
        if (err) {
            return callback(err);
        }
        db.collection("years", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // collection.find({}).toArray(function(err, result) {
            //     console.log("years:" + result);
            // });
            collection.find({}).sort({year:-1}).toArray(function(err, results) {
                var result = [];
                results.forEach(function(item,i) {
                    result.push({year:item.year});
                });
                callback(err, result);
            });
        });
    });
};