var maxWidth = 0;
var lastLeft = 0;
var lastNumber = 0;
var marginLeft_old = 0;
var years = [];
var yearPositions = {};
var currentPage = 1;
var end = false;
window.onload= handleLoad;
function handleLoad() {
    $("#line").mousewheel(handleMousewheel);
    $.post("_json/diary",{},handleInitJson,"json");
    $("#new").click(function(event){
    	
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
    });
    $("#line ul").click(function(event){
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
    });
}
function handleInitJson(data) {
    //console.log("handleInitJson start");
    var resultArray = data.articles;
    var li = "";
    years = data.years;
    end = data.end;
    $.each(resultArray, function (index, item){
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
}

function requestNewPage() {
    if($("#line ul li.new").length  > 0){
        return;
    }
   console.log("load new page...");
    var li = '<li class="item new">' + 
            '<div class="position"><a>&nbsp;</a></div>' +
            '<div class="bg">' +
                '<section id="article{id}">load ...</section></div></li>';
    maxWidth += 310;
    $("#line ul").width(maxWidth).append(li);
    timeLineScroll();
//    newPostAnimation($("#line ul li.new"));
    currentPage++;
    $.post("_json/page",{page:currentPage},newPage,"json");
}
function newPage(data) {
    var resultArray = data.articles;
    var li = "";
    end = data.end;
    $.each(resultArray, function (index, item){
        lastLeft += 310;
        lastNumber = lastNumber + 1;
        // console.log("lastNumber: " + lastNumber + ", lastLeft: " + lastLeft);
        var categories = item.categories || [];
        var categoriesHtml = "";
        $.each(categories, function (i, items) {
            categoriesHtml += '<a>{category}</a>'.subtitle({category:items});
        });
        li += listTemp.subtitle({id: lastNumber, left:lastLeft,position:lastNumber,article:item.article,rel:item.rel,time:item.time,categories:categoriesHtml});
    });

    if (resultArray.length > 0) {
        // var time = resultArray[0].time.date();
        // computePosition(time);
        //compute maxWidth
        maxWidth += resultArray.length * 310;
        //timeLineScroll();
    }
    $("#line ul li.new").remove();
    maxWidth -= 310;
    $("#line ul").width(maxWidth).append(li);
    decideEnd();
}
function query(param) {
	$.post("_json/page",param,function (data) {
		var resultArray = data.articles;
	    var li = "";
	    end = data.end;
	    $("#line ul").empty();
	    lastNumber = 0;
	    lastLeft = 10;
	    maxWidth = 0;
	    $.each(resultArray, function (index, item){
	        lastLeft += 310;
	        lastNumber = lastNumber + 1;
	        //console.log("lastNumber: " + lastNumber + ", lastLeft: " + lastLeft);
	        var categories = item.categories || [];
	        var categoriesHtml = "";
	        $.each(categories, function (i, items) {
	            categoriesHtml += '<a>{category}</a>'.subtitle({category:items});
	        });
	        li += listTemp.subtitle({id: lastNumber, left:lastLeft,position:lastNumber,article:item.article,rel:item.rel,time:item.time,categories:categoriesHtml});
	    });

	    if (resultArray.length > 0) {
	         var time = resultArray[0].time.date();
	         computePosition(time);
	        //compute maxWidth
	        maxWidth += resultArray.length * 310;
	        //timeLineScroll();
	    }
	    $("#line ul").width(maxWidth).append(li);
	    decideEnd();
	},"json")
}
function decideEnd(){
	if (end) {
		var li = '<li class="item new">' + 
        '<div class="position"><a>&nbsp;</a></div>' +
        '<div class="bg">' +
            '<section id="article{id}">你没有更多内容可看了。</section></div></li>';
		
		maxWidth += 310;
		$("#line ul").width(maxWidth).append(li);
	}
}
function handleMousewheel(e,delta) {

    e.stopPropagation();
    e.preventDefault();
    
    var speed=300;
    var marginLeft = marginLeft_old + delta*speed;
    
    timeLineScroll(marginLeft);
}
function timeLineScroll(marginLeft){
	if (maxWidth < $("#overViewLine").width()) {
		return;
	}
    if (typeof marginLeft === "undefined") {
        marginLeft = -maxWidth;
    }
    if (marginLeft>=0) {   //stop when left
        marginLeft = 0 ;
    } else if (Math.abs(marginLeft) + $("#overViewLine").width() > maxWidth) {//stop when right
        marginLeft = -(maxWidth - $("#overViewLine").width())
        !end && requestNewPage();
    }
//    console.log("scroll to :{marginLeft}".subtitle({marginLeft:marginLeft}));
    $("#line").css({"margin-left": marginLeft + "px"});

    //compute currentArticle
    var currentArticle = 0;
    if (Math.abs(marginLeft) % 310) {
        currentArticle = Math.ceil(Math.abs(marginLeft) / 310) + 1;
    } else {
        currentArticle = Math.abs(marginLeft) / 310 + 1;
    }
    var time = $("#article" + currentArticle + " time").attr("datetime").date();
    //console.log("#article" + currentArticle + " time" + time.str());
    computePosition(time);
    marginLeft_old = marginLeft;
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
function post (event) {
    event.preventDefault();
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
    $.post(url, param, function(data) {
        if (data.success) {
            //alert("success");
            var result = data.result;
            console.dir(result);
            var categories = result.categories || [];
	        var categoriesHtml = "";
	        $.each(categories, function (i, items) {
	            categoriesHtml += '<a>{category}</a>'.subtitle({category:items});
	        });
            var wrapListTemp = 
                    '<section id="article{id}">' +
                         '<article>{article}</article>' +
                         '<figcaption class="categories">{categories}</figcaption>' +
                         '<time datetime="{time}">{time}</time></section>';
            //$("#line ul li.input").css({"position": "absolute", "z-index": "-1"});
            $("#line ul li.input form").css({"position": "absolute", "z-index": "-1"});
            $("#line ul li.input .wrap").append(wrapListTemp.subtitle({id:lastNumber,article:result.article,rel:result.rel,time:result.time,categories:categoriesHtml}));
            //$_list.prependTo($("#line ul"));
            newPostAnimation($("#line ul li.input section:eq(1)"), 286);
            $("#line ul li.input").removeClass("input");
        } else {
            alert("false");
        }
    }, "json");
    return false;
}
function newPostAnimation($_list, width) {
    $_list.width(0);
    setTimeout(function () {
        $_list.width(width||300);
    },10);
}
var listTemp = '<li class="item" style="left: {left}px;">' + 
            '<div class="position"><a href="">{position}</a></div>' +
            '<div class="bg">' +
                '<section id="article{id}">' +
                    '<article>{article}</article>' +
                    '<figcaption class="categories">{categories}</figcaption>' +
                    '<time datetime="{time}">{time}</time></section></div></li>';

var newTemp = '<li class="item input" style="left: {left}px;">' + 
    '<div class="position"><a href="">{position}</a></div>' +
    '<div class="bg">' +
        '<div class="wrap">' +
        '<form action="/post" method="post">' +
            '<section id="article{id}">' +
                '<textarea name="article" id="article" class="input_article" range="0&0" placeholder="article" required ></textarea><br />' +
                '<figcaption class="categories"><input type="text" name="category" id="category" class="input_category" placeholder="类型" /><a class="add">+</a></figcaption>' +
                '<input type="submit" id="btn_submit" class="btn_submit" value="POST" /></section></form></div></div></li>';

var yearsListTemp = '<li class="item" style="left: {left}px;"><div id="year{year}" class="position"><div class="flicker"></div><a href="">{year}</a></div></li>';
var li = "";
var yearsLi = "";