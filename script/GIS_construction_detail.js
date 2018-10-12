
apiready = function() {
	var header = $api.byId('header');
	var pos = $api.offset(header);
	var title = $api.byId('title');
	var postitle = $api.offset(title);
	var pageParam = api.pageParam;
	api.openFrame({
		name : 'GIS_construction_detail_con',
		url : './GIS_construction_detail_con.html',
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