var yearPositions = {};
_.templateSettings = {
    interpolate: /\{(.+?)\}/g
};
var ArticleModel = Backbone.Model.extend({
    defaults: {
        "title": null,
        "article": "他将手中的诺基亚9300放上支让小贩称，小贩说四两，他说\"扯，这手机167克！\"小贩哑口无言",
        "rel": "《一个数码频道主编是如何炼成的》",
        "time": "2011/01/29 00:00:00"
    }
});

var ArticleView = Backbone.View.extend({
    template: _.template($("#articleTemp").html()),
    tagName: "li",
    render: function() {
        this.setElement(this.template(this.model.attributes));
        return this;
    }


});
var YearModel = Backbone.Model.extend({
    
});

var YearView = Backbone.View.extend({
    template: _.template($("#yearTemp").html()),
    render: function() {
        this.setElement(this.template(this.model.toJSON()));
        return this;
    }

});

var ArticleList = Backbone.Collection.extend({
    url: "_json/getPage",
    modle: ArticleModel,
});
var YearList = Backbone.Collection.extend({
    modle: YearModel,
});
var AppView = Backbone.View.extend({
    initialize: function() {
        var that = this;
        // $.get("_json/diary",{},this.handleInitJson,"json");

        this.articles = new ArticleList();
        this.years = new YearList();
        // this.listenTo(this.collection, 'add', this.addOne);
        // this.listenTo(this.collection, 'reset', this.addAll);
        // this.listenTo(this.collection, 'all', this.render);
        // this.collection.fetch({data: {page: 1}});
        this.articles.on("add", this.renderArticles);
        this.years.on("add", this.renderYears);
        $.get("_json/diary", {} , function (data){
            that.articles.set(data.articles);
            that.years.set(data.years);
            that.end = data.end;
        }, "json");
    },
    event: {
        "mousewheel #line": "handleMousewheel",
        "click #new": "handleNewClick",
        "click #line ul": "handleItemClick"
    },
    renderArticles: function() {
        //console.log("handleInitJson start");
        var collection = this.models;
        var li = "";
        $.each(collection, function (index, item){
            lastLeft = (310)*index + 10;
            lastNumber = index + 1;
            var categories = item.categories || [];
            var categoriesHtml = "";
            $.each(categories, function (i, items) {
                categoriesHtml += '<a>{category}</a>'.subtitle({category:items});
            });
            item.set("left", lastLeft);
            item.set("position", lastNumber);
            item.set("id", lastNumber);
            item.set("categories", categoriesHtml);
            var view = new ArticleView({model: item});
            $("#line ul").append(view.render().el);
            // li += listTemp.subtitle({id: lastNumber, left:lastLeft,position:lastNumber,article:item.article,rel:item.rel,time:item.time,categories:categoriesHtml});
        });
       
        if (collection.length > 0) {
            var time = collection[0].get("time").date();
            computePosition(time);
            //compute maxWidth
            maxWidth = collection.length * 310;
            //timeLineScroll();
        }
        
        $("#line ul").width(maxWidth);
        decideEnd();
    },
    renderYears: function() {
        //console.log("handleInitJson start");
        var collection = this.models;
        var li = "";
        var yearsLi = "";
        
        $.each(collection, function(i, item) {
            var view = new ArticleView({model: item});
            var position = YearView[item] = 300*i;
            yearsLi += yearsListTemp.subtitle({left: position, year: item});
        });

        $("#overView ul").append(yearsLi);
        
        decideEnd();
    },
    
    
    handleMousewheel: function(e,delta) {

        e.stopPropagation();
        e.preventDefault();
        
        var speed=300;
        var marginLeft = marginLeft_old + delta*speed;
        
        timeLineScroll(marginLeft);
    },
    handleNewClick: function(event){
        
        event.preventDefault();
        timeLineScroll(0);
        if ($("#line ul li.input").length > 0) {
            return;
        }
        lastNumber++;
        maxWidth += 310;
        $("#line ul").width(maxWidth)
        var $_li = $(newTemp.subtitle({id: lastNumber, left: lastLeft + 310, position:lastNumber})).prependTo($("#line ul"));
        newPostAnimation($_li);
        lastLeft += 310;
        $("form", $_li).submit(function (event){
            event.preventDefault();
            post(event);
        });
    },
    handleItemClick: function(event){
        var tarEl = event.target;
        if (tarEl.nodeName === "A" && tarEl.parentNode.className === "categories") {
            if (tarEl.className === "add") {
                $(tarEl.parentNode).prepend('<input type="text" name="category" id="category" class="input_category" placeholder="类型" />');
            } else {
                var category = [];
                category.push(tarEl.text);
                query({categories:category,page:1});
            }
        }
    }
});
function decideEnd(){
    if (appView.end) {
        var li = '<li class="item new">' + 
        '<div class="position"><a>&nbsp;</a></div>' +
        '<div class="bg">' +
            '<section id="article{id}">你没有更多内容可看了。</section></div></li>';
        
        maxWidth += 310;
        $("#line ul").width(maxWidth).append(li);
    }
}
//locate currentPosition
function computePosition(time) {
    if (!time instanceof Date) {
        return;
    }
    var currentPositionLeft = 0,
    thisYear = time.getFullYear(),
    month = time.getMonth() + 1;
    currentPositionLeft = yearPositions[thisYear];
    currentPositionLeft += (1 - (time.getMonth() + 1) / 12) * 300;
//    console.log("currentPositionLeft: {currentPositionLeft}, month: {month}, time: {time}"
//    .subtitle({currentPositionLeft:currentPositionLeft,month: time.getMonth() + 1, time: time.str()}));
    if (currentPositionLeft + $("#currentPosition").width() > $("#overViewLine").width()) {
        currentPositionLeft = $("#overViewLine").width() - $("#currentPosition").width();
    }
    $("#currentPosition").text(month);
    $("#overView .on").removeClass("on");
    $("#year" + thisYear).addClass("on");
    $("#currentPosition").css({left: currentPositionLeft + 'px'});
}
var appView = new AppView;