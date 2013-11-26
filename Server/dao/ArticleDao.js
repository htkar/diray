var collection = require("../node-mongodb-native.js");
collection.find({},"title article rel time").toArray(function(err, results) {
    console.dir(results);
    // Let's close the db
    db.close();
}); 