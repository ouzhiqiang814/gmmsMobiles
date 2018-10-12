var toll_MarkerIdArr = [];	//收费站信息标注ID集合
var toll_BubbleIdArr = [];	//收费站布告牌ID集合
function toll_loadTollMarkers(){
	if(toll_MarkerIdArr.length<=0){
		var annotations = [];
		var markInfos = {};
		$.each(tollGateAddr,function(i,toll){
			var timestamp = getRandomNum();
			annotations.push({
				id:timestamp,
		    	lon:toll.lng,
		    	lat:toll.lat,
		    	icon:toll.icon
			});
			toll_MarkerIdArr.push(timestamp);
			markInfos[timestamp] = toll;
		});
		bmap.addAnnotations({
		    annotations: annotations,
		}, function(ret) {
		    if (ret) {		
				var toll = markInfos[ret.id];
				if(toll.plano!=null){
					api.openWin({
						name : 'gis_chart',
						url : './chart/gis_chart.html',
						bounces : false,
						slidBackEnabled:false,
						pageParam:{title:toll.plaName,frameName:'gis_chart_toll_detail',plano:toll.plano},
						animation:{
							type:'movein'
						}
					});
				}else{
					api.toast({
	                    msg:'暂无信息'
                    });
				}
		    }
		});
	}
}

function toll_countMtcFee(){
	var reportUrl = $api.getStorage("report_url");
	api.ajax({
	    url:reportUrl+'gims/gis-new/countMtcFeeByPlano',
	    timeout:10
    },function(ret,err){
    	var xmdqFee = '暂无',jmdqFee = '暂无',xldqFee = '暂无',hcdqFee = '暂无',xasdFee = '暂无';
    	if(ret&&ret.errcode==0&&ret.data.length>0){
    		$.each(ret.data,function(i,data){
    			if(data.PlaName=='厦门大桥'){
    				xmdqFee = data.totalFee;
    			}
    			if(data.PlaName=='集美大桥'){
    				jmdqFee = data.totalFee;
    			}
    			if(data.PlaName=='海沧大桥'){
    				hcdqFee = data.totalFee;
    			}
    			if(data.PlaName=='杏林大桥'){
    				xldqFee = data.totalFee;
    			}
    			if(data.PlaName=='翔安隧道'){
    				xasdFee = data.totalFee;
    			}
    		});
    	}
    	var tollgateInfo = {};
    	$.each(tollGateAddr,function(i,toll){
    		var isdata = false;
    		var dataFee = 0;
    		if(toll.name=='集美大桥收费站（主站）'){
    			dataFee = jmdqFee;
    			isdata =true;
    		}
    		if(toll.name=='厦门大桥收费站'){
    			dataFee = xmdqFee;
    			isdata =true;
    		}
    		if(toll.name=='翔安隧道收费站'){
    			dataFee = xasdFee;
    			isdata =true;
    		}
    		if(toll.name=='杏林大桥收费站'){
    			dataFee = xldqFee;
    			isdata =true;
    		}
    		if(toll.name=='海沧大桥收费站'){
    			dataFee = hcdqFee;
    			isdata =true;
    		}
    		if(isdata){
    			var timestamp = getRandomNum();
    			tollgateInfo[timestamp] = toll;
				bmap.addBillboard({
				    id: timestamp,
				    coords: {
				        lon: toll.lng,
				        lat: toll.lat
				    },
				    bgImg:'widget://image/gis/160X75_2.png',
				    content: {
				        title: toll.name,
				        subTitle: '累计金额￥'+formatMoney(dataFee,0)
				    },
				    styles: {
				        titleColor: '#fff',
				        titleSize: 14,
				        subTitleColor: '#fff',
				        subTitleSize: 11
				    }
				}, function(rett) {
				    if (rett) {
				    	var tollinfo = tollgateInfo[rett.id];
						api.openWin({
							name : 'gis_chart',
							url : './chart/gis_chart.html',
							bounces : false,
							pageParam:{title:tollinfo.plaName,frameName:'gis_chart_toll_detail',plano:tollinfo.plano},
							animation:{
								type:'movein'
							}
						});
				    }
				});
				toll_BubbleIdArr.push(timestamp);
    		}
    	});
    });
}