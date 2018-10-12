var mainten_MarkerIdArr = [];//养护车标注ID集合
var mainten_lineIds = [];	//养护车画线ID集合
var mainten_BubbleIdArr = [];
var mainten_curType = '';
var mainten_curOnline = 1;
var mainten_Timer = null;
function mainten_fnQueryCars(online,carType){
	mainten_curOnline = online;		
	mainten_curType = carType;
	mainten_fnUpdateCars(online,carType);
	//获取巡查情况
	mainten_fnQueryDiscover();
}

function mainten_fnQueryDiscover(){
	if(mainten_lineIds.length>0){
		bmap.removeOverlay({
		    ids: mainten_lineIds
		});
		mainten_lineIds = new Array();
	}
	if(mainten_curType==''){
		return;
	}
	
	api.showProgress({
	    title: '提示',
	    text: '正在获取数据...',
	    modal: false
	});		
	var serverUri = $api.getStorage('gmms_url')+'modules/driverecord/gps-count!queryDiscoverInfoForApp.action';		
	api.ajax({
	    url:serverUri, 
	    method: 'get',
	    timeout:15,
	    data: {
	        values: {
	        	lesseeId:$api.getStorage("lesseeId"),
	            carType:mainten_curType
	        }
	    }
	}, function(ret, err) {
		if(ret){
			$.each(ret,function(i,data){
				var baseArr = new Array();					
				$.each(data.baseChildren,function(j,base){
					baseArr.push({lat:base.dwLatitude,lon:base.dwLongitude});
				});					
				if(baseArr.length>0){
					mainten_fnAddLine(baseArr,'#f90303');						
				}
				
				if(data.discoverChildren!=null){
					var discoverArr = new Array();
					$.each(data.discoverChildren,function(j,dis){
						discoverArr.push({lat:dis.dwLatitude,lon:dis.dwLongitude});
					});
					if(discoverArr.length>0){
						window.setTimeout(function(){
							mainten_fnAddLine(discoverArr,'#05a928');
						},2000);																				
					}
				}				
			});
		}else{
			api.toast({
	            msg:'获取工作情况失败!'
            });
		}
		api.hideProgress();
	});
}

function mainten_fnAddLine(lineArr,color){
	var timestamp = getRandomNum();
	bmap.addLine({
	    id: timestamp,
	    styles: {
	        borderColor: color,
	        borderWidth: api.systemType=='ios'?3:10
	     },
	     points: lineArr
	});
	mainten_lineIds.push(timestamp);
}

/**
 *刷新车辆位置 
 */
function mainten_fnUpdateCars(online,carType){		
	var serverUri = $api.getStorage('gmms_url')+'modules/driverecord/gps-cars!queryAllGpsCarsRBA.action';
	api.ajax({
	    url:serverUri, 
	    method: 'get',
	    timeout:10,
	    data: {
	        values: {
	        	lesseeId:$api.getStorage("lesseeId"),
	            online: online,
	            type:carType
	        }
	    }
	}, function(ret, err) {
	    if (ret) {
	    	if(mainten_MarkerIdArr.length>0){
	    		bmap.removeAnnotations({
				    ids: mainten_MarkerIdArr
				});
				mainten_MarkerIdArr = new Array();
	    	}
	    	var annotations = [];
			$.each(ret,function(i,car){
				annotations.push({
					id:car.id,
			    	lon:car.lon,
			    	lat:car.lat
				});
				mainten_MarkerIdArr.push(car.id);
			});
			bmap.addAnnotations({
			    annotations: annotations,
			    icon:api.screenWidth<=640?'widget://image/gis/car-yh.png':'widget://image/gis/64/car-yh.png'
			}, function(rettt) {
			    if (rettt) {		
					mainten_fnOpenCarInfo(rettt.id);
			    }
			});
	    } else {
//		        api.alert({ msg: JSON.stringify(err) });
	    }
	});
}

function mainten_fnCountData(){
	var reportUrl = $api.getStorage("report_url");
	var planInfos = {};
	$.each(planArr,function(i,plan){
		api.ajax({
			url:reportUrl+'gims/gis-new/countDiseaseAndProblem',
			timeout:10,
			data: {
		        values: {
		            zoneName: plan.name
		        }
		    }
		},function(ret,err){
			var diseaseNum = 0,problemNum = 0;
			var timestamp = getRandomNum();
			if(ret&&ret.errcode==0){
				diseaseNum = ret.diseaseNum;
				problemNum = ret.problemNum;
			}
			planInfos[timestamp] = plan;
			bmap.addBillboard({
			    id: timestamp,
			    coords: {
			        lon: plan.centerLng,
			        lat: plan.centerLat
			    },
			    bgImg:'widget://image/gis/160X75_1.png',
			    content: {
			        title: plan.name,
			        subTitle: '病害:'+diseaseNum+'  故障:'+problemNum
			    },
			    styles: {
			        titleColor: '#fff',
			        titleSize: 14,
			        subTitleColor: '#fff',
			        subTitleSize: 11
			    }
			}, function(rett) {
			    if (rett) {
			    	var planInfo = planInfos[rett.id];
			        api.openWin({
						name : 'gis_chart',
						url : './chart/gis_chart.html',
						bounces : false,
						slidBackEnabled:false,
						pageParam:{title:planInfo.name,frameName:'gis_chart_mainten'},
						animation:{
							type:'movein'
						}
					});
			    }
			});
			mainten_BubbleIdArr.push(timestamp);
		});
	});
	
}

function mainten_fnOpenCarInfo(carId){
	api.openWin({
        name: 'car_info',
        url: '../GIS_cars/car_info.html',
        pageParam:{carId:carId},
        animation:{
			type:'movein'
		}
    });
}