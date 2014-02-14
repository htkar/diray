
/**
 * Module dependencies.
 */
require("./utils/prototype");

var express = require("express")
  , routes = require("./routes")
  , user = require("./routes/user")
  , _json = require("./routes/_json")
  , http = require("http")
  , path = require("path")
  , MongoStore = require("connect-mongo")
  , settings = require("./Settings")
  ;

var app = express();

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.bodyParser());
app.use(express.methodOverride());
// app.use(express.cookieParser());
// app.use(express.session({
//     secret: settings.cookieSecret,
//     store: new MongoStore({
//         db:settings.db
//     })
// }));
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

// development only
if ("development" == app.get("env")) {
  app.use(express.errorHandler());
}

app.get("/", routes.index);
app.get("/admin", routes.admin);
app.get("/_json/:apiName", function (req,res) {
    _json[req.params.apiName](req, res);
});
app.post("/post", _json.post);
app.post("/page", _json.page);

http.createServer(app).listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
});
