apiready = function() {
	variable();
}
var fluxjson = {};
function variable() {
	var url = $api.getStorage('gmms_url');
	api.ajax({
		url : url + '/modules/mobile/report/colligate-manager!ledinfo.action',
		method : 'get',
		timeout : 30000,
		dataType : 'json',
	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
			if (ret.result) {
				var variablearr = ret.data
				for (var k = 0, len = variablearr.length; k < len; k++) {
					if (!fluxjson[variablearr[k].plano]) {
						var temparr = [variablearr[k]];
						fluxjson[variablearr[k].plano] = temparr;
					} else {
						fluxjson[variablearr[k].plano].push(variablearr[k]);
					}
				}
				//alert(JSON.stringify(fluxjson));
				variableswitch('0002');
			}
		} else {
			//alert(JSON.stringify(err));
		}
	});
}

function variableswitch(pla_no) {
	if (!fluxjson[pla_no]) {
		$api.html($api.byId('oneid'), '');
		$api.html($api.byId('twoid'), '');
		return false;
	}
	var bizjson = {
		'龙门架式情报板' : "",
		'F型情报板' : "",
		'限速板' : ""};
	var array = fluxjson[pla_no];
	//alert(JSON.stringify(array));
	for (var k = 0, len = array.length; k < len; k++) {
		if (array[k].ledrankname == "龙门架式情报板") {
			bizjson[array[k].ledrankname] += '<div class="main-center" onclick="openNewWindow('+k+',&quot;'+pla_no+'&quot;)">' + array[k].ledid + '#' + array[k].ledname + '</div>';
		} else if (array[k].ledrankname == "F型情报板") {
			bizjson[array[k].ledrankname] += '<div class="main-center" onclick="openNewWindow('+k+',&quot;'+pla_no+'&quot;)">' + array[k].ledid + '#' + array[k].ledname + '</div>';
		}else if (array[k].ledrankname == "限速板") {
			bizjson[array[k].ledrankname] += '<div class="main-center" onclick="openNewWindow('+k+',&quot;'+pla_no+'&quot;)">' + array[k].ledid + '#' + array[k].ledname + '</div>';
		}
	}
		$api.html($api.byId('oneid'), bizjson['龙门架式情报板']);
		$api.html($api.byId('twoid'), bizjson['限速板']);
		$api.html($api.byId('threeid'), bizjson['F型情报板']);

}

function openNewWindow(index,pla_no) {
	var data = fluxjson[pla_no][index];
	api.openWin({
		name : 'GIS_information_details_con',
		url : '../second_frame/GIS_information_details_con.html',
		delay : 200,
		bounces : false,
		pageParam: {
	         data: data
	    }
	});
	//alert($api.text(el));
}   