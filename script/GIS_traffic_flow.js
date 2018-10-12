apiready = function() {
	var header = $api.byId('my-header');
    if (header) {
        $api.fixStatusBar(header);
        headerHeight = $api.offset(header).h;
    }
	fnReadyKeyback();
	api.openFrame({
		name : 'GIS_traffic_flow_con',
		url : './GIS_traffic_flow_con.html',
		rect : {
			x : 0,
			y : headerHeight+1,
			w : 'auto',
			h : 'auto'
		},
		vScrollBarEnabled : false
	});
	mui('#segmentedControl').on('tap','a',function(){
		var type = this.getAttribute('field');
		api.execScript({
			frameName:'GIS_traffic_flow_con',
		    script: "fnChange('"+type+"');"
	    });
	});
	
	var shuaxinbtn = $api.byId('top_other_btn');
 	shuaxinbtn.onclick = function() {
 		var el = document.getElementsByClassName('mui-active');
 		var type = null;
 		for(var i=0;i<el.length;i++){
 			type = el[i].getAttribute('field');
 		}
        api.execScript({
		    script: "refresh('"+type+"');",
		    frameName: 'GIS_traffic_flow_con'
	    });
    };
    api.parseTapmode();
};
