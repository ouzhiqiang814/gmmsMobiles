apiready = function() {
	Lane();
}
var fluxjson = {};
function Lane() {
	var url = $api.getStorage('gmms_url');
	api.ajax({
		url : url + '/modules/mobile/report/colligate-manager!roadlamp.action',
		method : 'get',
		timeout : 30000,
		dataType : 'json',
	}, function(ret, err) {
		if (ret) {
			if (ret.result) {
				for (var k = 0, len = ret.data.length; k < len; k++) {
					fluxjson[ret.data[k].plano] = ret.data[k];
				}
				Laneswitch('0002');
			}
		} else {
			//alert(JSON.stringify(err));
		}
	});
}

function Laneswitch(pla_no) {
	if(!fluxjson[pla_no]) {
		$api.html($api.byId('enter'), '');
		$api.html($api.byId('leave'), '');
		return false;
	}
	if(pla_no=='0002') {
		$api.html($api.byId('direction1'), '方向:主站');
		$api.html($api.byId('direction2'), '方向:副站');
	} else {
		$api.html($api.byId('direction1'), '方向:进岛');
		$api.html($api.byId('direction2'), '方向:出岛');
	}
	var inlamparr = fluxjson[pla_no].inroadlamp.split('');
	var intemparr = [];
	for (var k = 0, len = inlamparr.length; k < len; k++) {
		if (inlamparr[k] == '1') {
			intemparr.push('<div tapmode="test" class="second_left"></div>');
		} else {
			intemparr.push('<div tapmode="test" class="second_right"></div>');
		}
	}
   $api.html($api.byId('enter'),intemparr.join(''));
   
   var outlamparr = fluxjson[pla_no].outroadlamp.split('');
	var outtemparr = [];
	for (var k = 0, len = outlamparr.length; k < len; k++) {
		if (outlamparr[k] == '1') {
			outtemparr.push('<div tapmode="test" class="second_left"></div>');
		} else {
			outtemparr.push('<div tapmode="test" class="second_right"></div>');
		}
	}
   $api.html($api.byId('leave'),outtemparr.join(''));

}