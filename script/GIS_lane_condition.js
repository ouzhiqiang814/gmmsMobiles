apiready = function() {
	var header = $api.byId('header');
	var pos = $api.offset(header);
	var title = $api.byId('title');
	var postitle = $api.offset(title);
	var pageParam = api.pageParam;
	api.openFrame({
		name : 'GIS_lane_condition_con',
		url : './GIS_lane_condition_con.html',
		rect : {
			x : 0,
			y : pos.h+postitle.h,
			w : 'auto',
			h : 'auto'
		},
		pageParam : pageParam,
		//bounces : false,
		vScrollBarEnabled : false
	});    
	var thisTab = $api.dom('.btn');
	$api.css(thisTab, 'margin-left:21%');
}

//选择翔安隧道，集美下穿隧道，集美
function Selecttype(type,el) {
	if($api.hasCls(el, 'active')) {
		return false;
	}
	var pla_no = {'one': '0001','two': '0002','three': '0003','four': '0004','five': '0005'};
	var pla_css = {'one': 'margin-left:1%',
					'two': 'margin-left:21%',
					'three': 'margin-left:41%',
					'four': 'margin-left:61%',
					'five': 'margin-left:81%'}
	var thisTab = $api.dom('.btn');
	var activeli = $api.dom('li.active');
	$api.removeCls(activeli, 'active');

	$api.css(thisTab, pla_css[type]);

	$api.addCls(el, 'active');
	var jsfun = 'Laneswitch("'+pla_no[type]+'");';
	api.execScript({
	    frameName: 'GIS_lane_condition_con',
	    script: jsfun
	});

}