apiready = function() {
	getledinfo();
}
function titlemessage(data) {
	$api.text($api.byId('ledid'), data.ledid);
	$api.text($api.byId('ledname'), data.ledname);
	var url = data.playfileurl;
	var maintype = {
		'.jpg': '<img src="'+ url +'" width="100%">',
		'.bmp': '<img src="'+ url +'" width="100%">',
		'*.bmp': '<img src="'+ url +'" width="100%" >',
		'.mp4': '<video src="'+ url +'"></video>',
		'.wmv': '<video src="'+ url +'"></video>',
		'.avi': '<video src="'+ url +'"></video>',
	};
	if(maintype[data.urltype]) {
		$api.append($api.byId('main'), maintype[data.urltype]);
	}
}


function getledinfo() {
	var data = api.pageParam['data'];	
	var url = $api.getStorage('gmms_url');
	api.ajax({
		url : url+'/modules/mobile/report/colligate-manager!ledSendDataInfo.action',
		data: {
	        values: {
	            plano: data.plano,
	            ledrank: data.ledrank,
	            ledid: data.ledid
	        }
	    },
		method : 'get',
		timeout : 30000,
		dataType : 'json',
	}, function(ret, err) {
		if (ret) {
			//alert(JSON.stringify(ret));
			if (ret.result) {
				console.log(JSON.stringify(ret.data));
				var datatype = {
					'.jpg': 1,
					'.bmp': 1,
					'*.bmp': 1,
				};
				var imgflag = false;
				var variablearr = [];
				for(var k=0,len=ret.data.length;k<len;k++) {
					if(datatype[ret.data[k].urltype]) {
						imgflag = true;
						titlemessage(ret.data[k]);
					} else {
						variablearr.push(ret.data[k]);
					}
				}
				if(!imgflag) {
					for(var k=0,len=variablearr.length;k<len;k++) {
						titlemessage(variablearr[k]);
					}
				}	
			} else {
				$api.text($api.byId('ledid'), data.ledid);
				$api.text($api.byId('ledname'), data.ledname);
			}
		} else {
			//alert(JSON.stringify(err));
		}
	});
}