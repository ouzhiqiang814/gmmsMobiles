var data = '';
var tempmap = {};
apiready = function() {
	var header = $api.byId('header');
	$api.fixStatusBar(header);
	var main = $api.byId('main');
	var mainPos = $api.offset(main);
	$api.css($api.byId('TBTstatue'), 'height:' + (mainPos.h - 5) + 'px');
	$api.css($api.byId('TBTstatue'), 'width:' + api.winWidth + 'px');
	var width = mainPos.w;
	var Xpr = width / 1440;
	var Ypr = (2560 * Xpr - mainPos.h) / 2
	api.readFile({
		path : 'widget://res/TBTsettings.json'
	}, function(ret, err) {
		if (ret.status) {
			data = ret.data;
			console.log(Xpr, Ypr, mainPos.t);
			GetPaths(Xpr, Ypr, mainPos.t);
		}
	});
};

function GetPaths(Xpr, Ypr, t) {
	var json = eval('(' + data + ')');
	tempmap = json.xiamenmap;
	var x = 1;
	for(var k in tempmap) {
		//path
		var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		pathput = [];
		for (var i = 0; i < tempmap[k].path.length; i++) {
			if ( typeof (tempmap[k].path[i]) == "string") {
				pathput.push(tempmap[k].path[i])
			}
			if ( typeof (tempmap[k].path[i]) == "number" && x == 1) {
				pathput.push(' ' + (tempmap[k].path[i] * Xpr));
				x = 0;
			} else if ( typeof (tempmap[k].path[i]) == "number" && x == 0) {
				pathput.push(' ' + (tempmap[k].path[i] * Xpr - Ypr));
				x = 1;
			}
		}
		var $path = $api.attr(path, 'd', pathput.join(''));
		$('svg').append($path);
		//$api.append($api.byId('footer'), $path);
	}
	getTraffic(Xpr,Ypr);
}

function getTraffic(Xpr,Ypr){
	url = $api.getStorage('traffic');
	api.ajax({
	    url: url + 'GetSpeedInfo',
	    method: 'get',
	    timeout: 30000,
	    dataType: 'json',
	    returnAll: false,
	},function(ret, err){
		console.log('ret:'+JSON.stringify(ret), 'err:'+JSON.stringify(err));
	    if(ret) {
	    	var x = 1;
			var temparray = [];
			for(var k in ret) {
				temparray = tempmap['r'+ ret[k].Roadid]['b'+ ret[k].Blockid];
				var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				pathput = [];
				if (temparray != undefined) {
					for (var i = 0; i < temparray.length; i++) {
						if ( typeof (temparray[i]) == "string") {
							pathput.push(temparray[i]);
						}
						if ( typeof (temparray[i]) == "number" && x == 1) {
							pathput.push(' ' + (temparray[i] * Xpr));
							x = 0;
						} else if ( typeof (temparray[i]) == "number" && x == 0) {
							pathput.push(' ' + (temparray[i] * Xpr - Ypr));
							x = 1;
						}
					}
					var $path = $(path).attr({
						d : pathput.join(''),
						class : 'Speedclass' + ret[k].Speedclass
					});
					$('svg').append($path);
				}
			}
	    } else {
	         //alert( JSON.stringify( err) );
	    }
	});
}

