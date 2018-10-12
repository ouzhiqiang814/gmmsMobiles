apiready = function() {
	var header = $api.byId('my-header');
    if (header) {
        $api.fixStatusBar(header);
        headerHeight = $api.offset(header).h;
    }
	fnReadyKeyback();
	
	var pageParam = api.pageParam;
	api.openFrame({
		name : 'GIS_video_count',
		url : './GIS_video_count.html',
		rect : {
			x : 0,
			y : headerHeight,
			w : 'auto',
			h : 'auto'
		},
		pageParam : pageParam,
		//bounces : false,
		vScrollBarEnabled : false
	});
}
function closeWin() {
	api.closeWin();
}

//
////选择翔安隧道，集美下穿隧道，集美
//function Selecttype(type, el) {
//	if ($api.hasCls(el, 'active')) {
//		return false;
//	}
//	var pla_no = {
//		'one' : '0001',
//		'two' : '0002',
//		'three' : '0003',
//		'four' : '0004',
//		'five' : '0005'
//	};
//	var pla_css = {
//		'one' : 'margin-left:1%',
//		'two' : 'margin-left:21%',
//		'three' : 'margin-left:41%',
//		'four' : 'margin-left:61%',
//		'five' : 'margin-left:81%'
//	}
//	var thisTab = $api.dom('.btn');
//	var activeli = $api.dom('li.active');
//	$api.removeCls(activeli, 'active');
//
//	$api.css(thisTab, pla_css[type]);
//
//	$api.addCls(el, 'active');
//	var jsfun = 'videoswitch("' + pla_no[type] + '");';
//	api.execScript({
//		frameName : 'GIS_video_surveillance_con',
//		script : jsfun
//	});
//
//}

function refreshclick() {
	var jsfun = 'refresh();';
	api.execScript({
		script : jsfun,
		frameName : 'GIS_video_count'
	});
}   