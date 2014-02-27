var settings = require("../Settings");
var Mongodb = require("mongodb");
var Db = Mongodb.Db;
var Connection = Mongodb.Connection;
var Server = Mongodb.Server;
var MongoClient = Mongodb.MongoClient

// var mongodb = new Db(settings.db, new Server(settings.host, settings.port, {auto_reconnect: true}));
var reuseDb = null;
// mongodb.open(function(err, db) {
// 		if (err) {
// 			console.log("connect " + settings.host + ":" + " faild.\n" + err);
// 		}
// 		reuseDb = db;
// 	});
//two way connect
exports.init = function (callback) {
	MongoClient.connect(settings.url, {
		db: {
			timeout: 50
		}
	}, function(err, db) {
		if (err) {
			console.log("connect " + settings.url + " faild.\n" + err);
		}
		reuseDb = db;
		console.log("connection is ready");
		callback();
	});
}

exports.getConnection = function (callback) {
	callback(null, reuseDb);
}
exports.db = function (callback) {
	mongodb.open(function(err, db) {
		if (err) {
			console.log("connect " + settings.host + ":" + " faild.\n" + err);
			callback(err, db);
		}
		callback(err, db);
	});
}