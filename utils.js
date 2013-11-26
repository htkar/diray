/**
 * method
 */
Function.prototype.method = function(name, func) {
	if (!this.prototype[name])
		this.prototype[name] = func;
	return this;
};

/**
 * inherits
 */
Function.method('inherits', function(Clazz) {
	this.prototype = new Clazz();
	return this;
});

//Array.method('flatten', function(func) {
//	/**
//	 * Flatten array.
//	 * Example:
//	 * 		[1,2,[3,4,[5]]].flatten(); result is [1,2,3,4,5];
//	 * 		[1,2,[3,4,[5]]].flatten(function(obj){if(obj>2) return obj});
//	 * 			result is [3,4,5].
//	 */
//	func = func || function(arg) {return arg;};
//	var flat = [];
//	for (var i = 0; i < this.length; i++) {
//		var atom = this[i] instanceof Array ? this[i].flatten(func) : func(this[i]);
//		if (atom) flat = flat.concat(atom);
//	}
//	return flat;
//}).method('last', function(obj){
//	/**
//	 * Replace or return last object in array.
//	 * Example : 
//	 * 		[1,2,3].last() result is 3;
//	 * 		[1,2,3].last(4) result is [1,2,4].
//	 */
//	if (!obj) return this[this.length - 1];
//	else {
//		this[this.length - 1] = obj;
//		return this;
//	}
//}).method('squeeze', function(obj) {
//	/**
//	 * Add an object to the last position, and remove the first object of the array.
//	 * Array's length isn't changed.
//	 * Example : 
//	 * 		[1,2,3].squeeze(4); result is [2,3,4].
//	 */
//	if (obj) {
//		this.push(obj);
//		this.shift();
//	}
//	return this;
//});

String.method('subtitle', function(obj) {
	/**
	 * '{lang} is {whose} fav. language'.subtitle({lang : 'javascript', whose : 'my'});
	 * The result is 'javascrit is my fav. language.'.
	 */
	return new String(this).replace(/\{([^{}]+)\}/g, function(match, key) {
		var value = obj[key];
		return (value !== undefined) ? '' + value : match;
	});
}).method('date', function(){
	/**
	 * 
	 */
	if (this.match(/^\d{4}[\/]\d{2}[\/]\d{2}[\s]\d{2}:\d{2}:\d{2}/)) {
		var date = new Date();
		date.setFullYear(parseInt(this.substring(0,4)), 
				parseInt(this.substring(5,7), 10) - 1 , 
				parseInt(this.substring(8,10), 10));
		date.setHours(parseInt(this.substring(11,13), 10), 
				parseInt(this.substring(14,16), 10), 
				parseInt(this.substring(17,19), 10), 0);
		return date;
	}
});

Date.method('str', function() {
	/**
	 * 
	 */
	var str = '{yyyy}/{MM}/{dd} {HH}:{mm}:{ss}';
	var digits = function(num) {
		if (num < 10) return '0' + num; 
		else return '' + num;
	};
	return str.subtitle({
		yyyy : this.getFullYear(), MM : digits(this.getMonth() + 1), 
		dd : digits(this.getDate()), HH : digits(this.getHours()),
		mm : digits(this.getMinutes()), ss : digits(this.getSeconds())
	});
}).method('add', function(delta){
	if (!delta) return this; 
	var tmp = new Date();
	tmp.setTime(this.getTime() + delta);
	return tmp;
});
Date.prototype.toJSON = function () {
	var str = '{yyyy}/{MM}/{dd} {HH}:{mm}:{ss}';
	var digits = function(num) {
		if (num < 10) return '0' + num; 
		else return '' + num;
	};
	return str.subtitle({
		yyyy : this.getFullYear(), MM : digits(this.getMonth() + 1), 
		dd : digits(this.getDate()), HH : digits(this.getHours()),
		mm : digits(this.getMinutes()), ss : digits(this.getSeconds())
	});
};
if (!Object.keys) Object.keys = function(o) {
	if (o !== Object(o)){
		throw new TypeError('Object.keys called on a non-object');
	}
	var k=[],p,hasOwnProperty=Object.prototype.hasOwnProperty;
	for (p in o) if (hasOwnProperty.call(o,p)) k.push(p);
	return k;
}