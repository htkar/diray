var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
// console.log(db);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  
    console.log("open success");
    
});
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title    : String
  , article     : String
  , rel      : String
  , time      : String
},{collection:"test"});
// ArticleSchema.methods.findAll = function () {
//     return this.model("test").find({},console.log);
//     console.log(this.model);
// };
ArticleSchema.methods.findSimilarTypes = function(cb){
    return this.model('test').find({time:this.time},cb);
}

var ArticleModel = db.model("test", ArticleSchema);

var article = new ArticleModel({title:"yujun", time:"2013/01/29 00:00:00",rel:"null", article:"hello world"});
// article.findSimilarTypes(function(err, item){
//     console.log(item);
// });
// article.save(function(){
//     console.log("save success");
// });
// ArticleModel.findOne({"time":"2013/01/29 00:00:00"},"title", function(err,article){
//     if (err) console.log(err);
//     console.log(article);
// });
// ArticleModel.find({time:"2013/01/29 00:00:00"},function(err, item){
//     if (err) console.log(err);
//     console.log(item);
// });
ArticleModel.count({time:"2013/01/29 00:00:00"},function(err, item){
    if (err) console.log(err);
    console.log(item);
});
article.model("test").findById("51e5fbb0bcb2add80e000001", function(err,item){
    if (err) console.log(err);
    globl.item = iterm;
});
// var globl = {};
// console.log(globl.item);
mongoose.disconnect(function(){
    console.log("connection close");
});