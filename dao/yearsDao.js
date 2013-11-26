var mongodb = require("../models/db");
exports.get = function (callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection("years", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find().sort({year:-1}).toArray(function(err, results) {
                db.close();
                var result = [];
                results.forEach(function(item,i) {
                	result.push(item.year);
                });
                callback(err, result);
            });
        });
    });
};