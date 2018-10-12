apiready = function() {
	var data = api.pageParam.data;
	//	api.alert({
	//		msg : JSON.stringify(data)
	//	});
	console.log(JSON.stringify(data));
	controlurl = (data.url.split(":"))[0] + (data.url.split(":"))[1];
	cameraid = (data.hkappvidiconid.split("$"))[0];
	//alert(controlurl + cameraid);
	var sysType = api.systemType;
	playVideo(data);
	//videoinfo();
	if (api.systemType == 'android') {
		api.execScript({
			name : 'GIS_con',
			frameName : 'GIS_bmap',
			script : 'closebmap()'
		});
	}

};
function playVideo(data) {
	var videoPlayer = api.require('videoPlayer');
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		modal : false
	});
	videoPlayer.open({
		rect : {
			x : 0,
			y : 0,
			w : api.frameWidth,
			h : (api.frameWidth * 30 / 40)
		},
		fixedOn : 'GIS_monitor_con',
		path : data.url
	}, function(ret, err) {
		api.hideProgress();
	});

}

//
//function playRtsp(data) {
//	var obj = api.require('aplayer');
//	//alert(data.url);
////	api.showProgress({
////		style : 'default',
////		animationType : 'fade',
////		title : '努力加载中...',
////		modal : false
////	});
//	obj.play({
//		rect : {
//			x : 0,
//			y : 0,
//			w : api.frameWidth,
//			h : (api.frameWidth * 31 / 40),
//		},
//		fixedOn : 'GIS_monitor_con',
//		url : data.url,
//		defaultBtn : false,
//		enableFull : false
//	}, function(ret, err) {
//		if (ret) {
//			//api.hideProgress();
//		}
//	});
//}

var
controlurl;
var cameraid;
function sendOrder(type) {

	var stopurl = 'http://117.29.161.210:20001/ptz/control?deviceId=1000023&no=0&type=' + type + '&stepX=2&stepY=2&stop=1';
	//alert(data);
	api.ajax({
		url : stopurl,
		method : 'get',
	}, function(ret, err) {
		if (ret) {
			//api.alert({ msg: JSON.stringify(ret) });
		} else {

		}
	});
	var starturl = 'http://117.29.161.210:20001/ptz/control?deviceId=1000023&no=0&type=' + type + '&stepX=2&stepY=2&stop=0';
	//alert(data);
	api.ajax({
		url : starturl,
		method : 'get',
	}, function(ret, err) {
		if (ret) {
			//api.alert({ msg: JSON.stringify(ret) });
		} else {

		}
	});

}

function sendZoom(type, value) {
	var data = 'http://117.29.161.210:20001/camera/operation?deviceId=1000023&no=0&type=' + type + '&value=' + value + '&step=2&stop=0';
	//alert(data);
	api.ajax({
		url : data,
		method : 'get',
	}, function(ret, err) {
		if (ret) {
			//api.alert({ msg: JSON.stringify(ret) });
		} else {

		}
	});

}

function videoinfo() {
	var plano = {
		'0001' : '厦门大桥',
		'0002' : '海沧大桥',
		'0003' : '集美大桥',
		'0004' : '杏林大桥',
		'0005' : '翔安隧道'
	};
	data = api.pageParam['data'];
	console.log(JSON.stringify(data));
	if (plano[data.plazano]) {
		$api.text($api.byId('plano'), plano[data.plazano]);
	} else {
		$api.text($api.byId('plano'), data.plazano);
	}
	$api.text($api.byId('vidiconname'), data.vidiconname);
	$api.text($api.byId('status'), data.status);
	$api.text($api.byId('labellng'), data.labellng);
	$api.text($api.byId('labellat'), data.labellat);
}

