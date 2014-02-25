var settings = require("../Settings");
var Mongodb = require("mongodb");
var Db = Mongodb.Db;
var Connection = Mongodb.Connection;
var Server = Mongodb.Server;
var MongoClient = Mongodb.MongoClient

var mongodb = new Db(settings.db, new Server(settings.host, settings.port, {auto_reconnect: true}));
//two way connect
exports.getConnection = function (callback) {
	MongoClient.connect(settings.url, function(err, db) {
		if (err) {
			console.log("connect " + settings.url + " faild.\n" + err);
			callback(err, db);
		}
		callback(err, db);
	});
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