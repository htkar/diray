_.templateSettings = {
    interpolate: /\{(.+?)\}/g
};
var ArticleModel = Backbone.Model.extend({
    defaults: {
        "title": null,
        "article": "他将手中的诺基亚9300放上支让小贩称，小贩说四两，他说\"扯，这手机167克！\"小贩哑口无言",
        "rel": "《一个数码频道主编是如何炼成的》",
        "time": "2011/01/29 00:00:00",
        "categories": [],
        "left": 0
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
    defaults: {
        "year": null
    }
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
    el: "body",
    lastLeft: 0,
    lastNumber: 0,
    marginLeft_old :0,
    maxWidth: 0,
    end: false,
    currentPage: 1,
    yearPositions: {},
    $overViewLine: $("#overViewLine"),
    $line_ul: $("#line ul"),
    $overView_ul: $("#overView ul"),
    $line: $("#line"),
    newTemp: _.template($("#newTemp").html()),
    endTemp: _.template($("#endTemp").html()),
    currentArticle: $(),
    initialize: function() {
        var that = this;
        // $.get("_json/diary",{},this.handleInitJson,"json");

        this.articles = new ArticleList();
        this.years = new YearList();
        // this.listenTo(this.collection, 'add', this.addOne);
        // this.listenTo(this.collection, 'reset', this.addAll);
        // this.listenTo(this.collection, 'all', this.render);
        // this.collection.fetch({data: {page: 1}});
        this.articles.on("sync", this.renderArticles, this);
        this.years.on("sync", this.renderYears, this);
        $.get("_json/diary", {} , function (data){
            that.articles.set(data.articles);
            that.years.set(data.years);
            that.end = data.end;
            that.articles.trigger('sync', data.articles);
            that.years.trigger('sync', data.articles);
        }, "json");
    },
    events: {
        "mousewheel #line": "handleMousewheel",
        "click #new": "handleNewClick",
        "click #line ul": "handleItemClick"
    },
    renderArticles: function() {
        var that = this;
        //console.log("handleInitJson start");
        var collection = this.articles.models;
        var li = "";
        $("#line ul li.new").remove();
        $.each(collection, function (index, item){
            var lastLeft = that.lastLeft = (310)*that.lastNumber + 10;
            that.lastNumber++
            var categories = item.attributes.categories || [];
            var categoriesHtml = "";
            $.each(categories, function (i, items) {
                categoriesHtml += '<a>{category}</a>'.subtitle({category:items});
            });
            item.set("left", lastLeft);
            item.set("position", item.get("time").date().getMonth() + 1);
            item.set("id", that.lastNumber);
            item.set("categories", categoriesHtml);
            var view = new ArticleView({model: item});
            that.$line_ul.append(view.render().el);
            // li += listTemp.subtitle({id: lastNumber, left:lastLeft,position:lastNumber,article:item.article,rel:item.rel,time:item.time,categories:categoriesHtml});
        });
        this.computePosition(collection[0].get("time").date());
        if (collection.length > 0) {
            var time = collection[0].get("time").date();
            this.computePosition(time);
            //compute maxWidth
            this.maxWidth = that.lastNumber * 310;
            //timeLineScroll();
        }
        
        this.$line_ul.width(this.maxWidth);
        this.decideEnd();
    },
    renderYears: function() {
        var that = this;
        //console.log("handleInitJson start");
        var collection = this.years.models;
        // var li = "";
        // var yearsLi = "";
        
        $.each(collection, function(i, item) {
            var view = new YearView({model: item});
            var position = that.yearPositions[item.get("year")] = 300*i;
            item.set("left",position);
            that.$overView_ul.append(view.render().el);
            // yearsLi += yearsListTemp.subtitle({left: position, year: item});
        });
        
        this.decideEnd();
    },
    
    
    handleMousewheel: function(e,delta) {

        e.stopPropagation();
        e.preventDefault();
        
        var speed=300;
        var marginLeft = this.marginLeft_old + delta*speed;
        
        this.timeLineScroll(marginLeft);
    },

    handleNewClick: function(event){
        var that = this;
        event.preventDefault();
        var lastLeft = this.lastLeft;
        this.timeLineScroll(0);
        if ($("#line ul li.input").length > 0) {
            return;
        }
        this.lastNumber++;
        this.maxWidth += 310;
        this.$line_ul.width(this.maxWidth)
        var $_li = $(this.newTemp({id: this.lastNumber, left: lastLeft + 310, position:this.lastNumber})).prependTo(this.$line_ul);
        this.newPostAnimation($_li);
        this.lastLeft += 310;
        $("form", $_li).submit(function (event){
            event.preventDefault();
            that.post(event);
        });
    },
    handleItemClick: function(event){
        var that = this;
        var tarEl = event.target;
        if (tarEl.nodeName === "A" && tarEl.parentNode.className === "categories") {
            if (tarEl.className === "add") {
                $(tarEl.parentNode).prepend('<input type="text" name="category" id="category" class="input_category" placeholder="类型" />');
            } else {
                var category = [];
                category.push(tarEl.text);
                that.query({categories:category,page:1});
            }
        }
    },
    newPostAnimation: function($_list, width) {
        $_list.width(0);
        setTimeout(function () {
            $_list.width(width||300);
        },10);
    },
    post: function(event) {
        event.preventDefault();
        var that = this;
        var form = document.forms[0];
        form.checkValidity();
        var url = form.action;
        //var title = form.title.value;
        var article = form.article.value;
    //    var rel = form.rel.value;
        //var time = form.time.value;
        var categories = form.category;
        var param = {};
        param.categories = [];
        if (categories.length) {
            for (var i = 0, len = categories.length; i < len; i++) {
                param.categories.push(categories[i].value || "");
            }
        } else {
            param.categories.push(categories.value || "");
        }
        ///param.title = title || "";
        param.article = article || "";
    //    param.rel = rel || "";
        //param.time = time || "";
        console.log(url);
        // var formData = new FormData(document.forms[o]);
        console.dir(param);
        var model = new ArticleModel(param);
        $.post(url, param, function(data) {
            if (data.success) {
                //alert("success");
                var result = data.result;
                console.dir(result);
                var model = new ArticleModel(result);

                var categories = result.categories || [];
                var categoriesHtml = "";
                $.each(categories, function (i, items) {
                    categoriesHtml += '<a>{category}</a>'.subtitle({category:items});
                });

                model.set("categories", categoriesHtml);
                $("#line ul li.input form").css({"position": "absolute", "z-index": "-1"});
                
                model.set("position", that.lastNumber);
                model.set("id", that.lastNumber);
                var view = new ArticleView({model: model});
                $("#line ul li.input .wrap").append(view.render().$el.find("section"));
                
                that.newPostAnimation($("#line ul li.input section:eq(1)"), 286);
                $("#line ul li.input").removeClass("input");
            } else {
                alert("false");
            }
        }, "json");
        return false;
    },
    query: function(param) {
        var that = this;
        this.timeLineScroll(0);
        $.get("_json/page", param , function (data){
            that.lastNumber = 0;
            that.lastLeft = 10;
            that.maxWidth = 0;
            that.$line_ul.empty();
            that.articles.set(data.articles);
            that.end = data.end;
            that.articles.trigger('sync', data.articles);
        }, "json");
    },
    timeLineScroll: function(marginLeft){
        if (this.maxWidth < this.$overViewLine.width()) {
            return;
        }
        if (typeof marginLeft === "undefined") {
            marginLeft = -this.maxWidth;
        }
        if (marginLeft>=0) {   //stop when left
            marginLeft = 0 ;
        } else if (Math.abs(marginLeft) + this.$overViewLine.width() > this.maxWidth) {//stop when right
            marginLeft = -(this.maxWidth - this.$overViewLine.width())
            !this.end && this.requestNewPage();
        }
    //    console.log("scroll to :{marginLeft}".subtitle({marginLeft:marginLeft}));
        this.$line.css({"margin-left": marginLeft + "px"});

        //compute currentArticle
        var currentArticleNo = 0;
        if (Math.abs(marginLeft) % 310) {
            currentArticleNo = Math.ceil(Math.abs(marginLeft) / 310) + 1;
        } else {
            currentArticleNo = Math.abs(marginLeft) / 310 + 1;
        }
        this.currentArticle.addClass("hidden");
        this.currentArticle = $(".allItem li:eq(" + (currentArticleNo -1) + ") .hidden").removeClass("hidden");

        var time = $("#article" + currentArticleNo + " time").attr("datetime").date();
        //console.log("#article" + currentArticle + " time" + time.str());
        this.computePosition(time);
        this.marginLeft_old = marginLeft;
    },
    requestNewPage: function() {
        var that = this;
        //one by one
        if($("#line ul li.new").length  > 0){
            return;
        }
        console.log("load new page...");
        this.maxWidth += 310;
        this.$line_ul.width(this.maxWidth).append(this.endTemp({id: this.lastNumber + 1, article: "loading..."}));
        this.timeLineScroll();
    //    newPostAnimation($("#line ul li.new"));
        this.currentPage++;

        // this.articles.fetch({data:{page:this.currentPage}});
        $.get("_json/page", {page:this.currentPage} , function (data){
            that.articles.set(data.articles);
            that.end = data.end;
            that.articles.trigger('sync', data.articles);
        }, "json");
    },

    decideEnd: function(){
        if (this.end) {
            
            this.maxWidth += 310;
            this.$line_ul.width(this.maxWidth).append(this.endTemp({id: this.lastNumber + 1, article: "你没有更多内容可看了。"}));
        }
    },
    //locate currentPosition
    computePosition: function(time) {
        if (!time instanceof Date) {
            return;
        }
        var currentPositionLeft = 0,
        thisYear = time.getFullYear(),
        month = time.getMonth() + 1;
        currentPositionLeft = this.yearPositions[thisYear];
        currentPositionLeft += (1 - (time.getMonth() + 1) / 12) * 300;
    //    console.log("currentPositionLeft: {currentPositionLeft}, month: {month}, time: {time}"
    //    .subtitle({currentPositionLeft:currentPositionLeft,month: time.getMonth() + 1, time: time.str()}));
        if (currentPositionLeft + $("#currentPosition").width() > this.$overViewLine.width()) {
            currentPositionLeft = this.$overViewLine.width() - $("#currentPosition").width();
        }
        $("#currentPosition").text(month);
        $("#overView .on").removeClass("on");
        $("#year" + thisYear).addClass("on");
        $("#currentPosition").css({left: currentPositionLeft + 'px'});
    }
    });

var appView = new AppView();