apiready = function() {
	Weather();
}
var weatherjson = {};
function Weather(){
	var url = $api.getStorage('gmms_url');
	api.ajax({
		url : url + '/modules/mobile/report/colligate-manager!weather.action',
		method : 'get',
		timeout : 30000,
		dataType : 'json',
	}, function(ret, err) {
		if (ret) {
			if(ret.result) {
				for(var k=0,len=ret.data.length;k<len;k++) {
					weatherjson[ret.data[k].plano] = [];
				}
				for(var k=0,len=ret.data.length;k<len;k++) {
					(weatherjson[ret.data[k].plano]).push(ret.data[k]);
				}
				weatherswitch('0001');
			}
		} else {
			//alert(JSON.stringify(err));
		}
	});
}

function weatherswitch(pla_no) {
	var array = weatherjson[pla_no];
	var temparr = [];
	var temperature = '暂无信息';
	var humidity = '暂无信息';
	var wind = '暂无信息';
	var rainfall = '暂无信息';
	var visibility = '暂无信息';
	var windspeed = '暂无信息';
	if (array) {
		for (var k = 0, len = array.length; k < len; k++) {
			temperature = array[k].temperature +'°C';
			humidity = array[k].humidity+'%';
			wind = array[k].wind;
			rainfall = array[k].rainfall+'mm';
			visibility = array[k].visibility+'m';
			windspeed = array[k].windspeed+'m/s';
		}
	}
	$('#temperature').html(temperature);
	$('#humidity').html(humidity);
	$('#wind').html(wind);
	$('#rainfall').html(rainfall);
	$('#visibility').html(visibility);
	$('#windspeed').html(windspeed);
}