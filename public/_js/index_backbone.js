var ItemModel = Backbone.Model.extend({
    defaults: {
        "title": null,
        "article": "他将手中的诺基亚9300放上支让小贩称，小贩说四两，他说\"扯，这手机167克！\"小贩哑口无言",
        "rel": "《一个数码频道主编是如何炼成的》",
        "time": "2011/01/29 00:00:00"
    }
});

var ItemView = Backbone.View.extend({
    termplate: _.template($("#listTemp").html()),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }


});
var ItemList = Backbone.Collection.extend({
    url: "_json/getPage",
    modle: ItemModel,
});

var AppView = Backbone.View.extend({
    initialize: function() {
        var that = this;
        // $.get("_json/diary",{},this.handleInitJson,"json");

        this.collection = new ItemList();
        
        // this.listenTo(this.collection, 'add', this.addOne);
        // this.listenTo(this.collection, 'reset', this.addAll);
        // this.listenTo(this.collection, 'all', this.render);
        this.collection.fetch({data: {page: 1}});
        this.collection.on("add", this.render);
    },
    event: {
        "mousewheel #line": "handleMousewheel",
        "click #new": "handleNewClick",
        "click #line ul": "handleItemClick"
    },
    render: function() {
        //console.log("handleInitJson start");
        var collection = this.collection;
        var data = collection.models;
        var resultArray = data.articles;
        var li = "";
        years = data.years;
        end = data.end;
        $.each(data, function (index, item){
            lastLeft = (310)*index + 10;
            lastNumber = index + 1;
            var categories = item.categories || [];
            var categoriesHtml = "";
            $.each(categories, function (i, items) {
                categoriesHtml += '<a>{category}</a>'.subtitle({category:items});
            });
            li += listTemp.subtitle({id: lastNumber, left:lastLeft,position:lastNumber,article:item.article,rel:item.rel,time:item.time,categories:categoriesHtml});
        });
        $.each(years, function(i, item) {
            var position = yearPositions[item] = 300*i;
            yearsLi += yearsListTemp.subtitle({left: position, year: item});
        });

        $("#overView ul").append(yearsLi);
        if (resultArray.length > 0) {
            var time = resultArray[0].time.date();
            computePosition(time);
            //compute maxWidth
            maxWidth = resultArray.length * 310;
            //timeLineScroll();
        }
        
        $("#line ul").width(maxWidth).append(li);
        decideEnd();
    },
    handleInitJson: function (data) {
        //console.log("handleInitJson start");
        var resultArray = data.articles;
        var li = "";
        years = data.years;
        end = data.end;
        var model = new ItemModel();
        model.parse(resultArray);
        $.each(resultArray, function (index, item){
            var model = new ItemModel();
            model.parse(item);
            lastLeft = (310)*index + 10;
            lastNumber = index + 1;
            var categories = item.categories || [];
            var categoriesHtml = "";
            $.each(categories, function (i, items) {
                categoriesHtml += '<a>{category}</a>'.subtitle({category:items});
            });
            li += listTemp.subtitle({id: lastNumber, left:lastLeft,position:lastNumber,article:item.article,rel:item.rel,time:item.time,categories:categoriesHtml});
        });
        $.each(years, function(i, item) {
            var position = yearPositions[item] = 300*i;
            yearsLi += yearsListTemp.subtitle({left: position, year: item});
        });

        $("#overView ul").append(yearsLi);
        if (resultArray.length > 0) {
            var time = resultArray[0].time.date();
            computePosition(time);
            //compute maxWidth
            maxWidth = resultArray.length * 310;
            //timeLineScroll();
        }
        
        $("#line ul").width(maxWidth).append(li);
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

new AppView;