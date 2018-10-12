apiready = function() {
	var header = $api.byId('header');
	var pos = $api.offset(header);
	var pageParam = api.pageParam;
	api.openFrame({
		name : 'GIS_information_details',
		url : '../second_frame/GIS_information_details.html',
		rect : {
			x : 0,
			y : pos.h,
			w : 'auto',
			h : 'auto'
		},
		pageParam : pageParam,
		//bounces : false,
		vScrollBarEnabled : false
	});    
}