//四桥一隧信息
var planArr = [
	{plano:"0001",name:"厦门大桥",centerLng:118.108759,centerLat:24.563104},
	{plano:"0002",name:"海沧大桥",centerLng:118.077705,centerLat:24.500727},
	{plano:"0003",name:"集美大桥",centerLng:118.136535,centerLat:24.576389},
	{plano:"0004",name:"杏林大桥",centerLng:118.093407,centerLat:24.564484},
	{plano:"0005",name:"翔安隧道",centerLng:118.213403,centerLat:24.543515},
	{plano:"GS10",name:"厦漳高速厦门段",centerLng:118.00779,centerLat:24.593824},
	{plano:"GS20",name:"厦蓉高速厦门段",centerLng:118.023753,centerLat:24.469786}
]
var tollGateAddr = null;
var bmap = null;		//地图对象
var map_opened = false;	//地图是否打开
var RFIDLineIdArr = [];//保存bmap路况画线标注ID集合
var eventMarkerIdArr = [];//报警事件标注ID集合
var LedMarkerIdArr = [];	//LED标注ID集合
var videoMarkerIdArr = [];	//摄像机标注ID集合
var road_MarkerIdArr = [];	//路政车标注ID集合
var CUR_TAB = 'gis_main_group_monitor';
apiready = function(){
	bmap = api.require('bMap');
	if(api.systemType=='ios'){
		openbmap();
	}
	fnQueryAllVideos();
	
	tollGateAddr = [
		{name:'集美大桥收费站（主站）',plano:"0003",plaName:"集美大桥",lng:118.119943,lat:24.588666,icon:api.screenWidth<=640?'widget://image/gis/SFZ.png':'widget://image/gis/64/SFZ.png'},
		{name:'集美大桥收费站（副站）',lng:118.122997,lat:24.589183,icon:api.screenWidth<=640?'widget://image/gis/SFZ.png':'widget://image/gis/64/SFZ.png'},
		{name:'厦门大桥收费站',plano:"0001",plaName:"厦门大桥",lng:118.120648,lat:24.551781,icon:api.screenWidth<=640?'widget://image/gis/SFZ.png':'widget://image/gis/64/SFZ.png'},
		{name:'翔安隧道收费站',plano:"0005",plaName:"翔安隧道",lng:118.234136,lat:24.569746,icon:api.screenWidth<=640?'widget://image/gis/SFZ.png':'widget://image/gis/64/SFZ.png'},
		{name:'杏林大桥收费站',plano:"0004",plaName:"杏林大桥",lng:118.115452,lat:24.55296,icon:api.screenWidth<=640?'widget://image/gis/SFZ.png':'widget://image/gis/64/SFZ.png'},
		{name:'海沧大桥收费站',plano:"0002",plaName:"海沧大桥",lng:118.052485,lat:24.506,icon:api.screenWidth<=640?'widget://image/gis/SFZ.png':'widget://image/gis/64/SFZ.png'},
		{name:'杏林大桥管理中心',lng:118.11664172242,lat:24.550982402435,icon:api.screenWidth<=640?'widget://image/gis/GLZX.png':'widget://image/gis/64/GLZX.png'},
		{name:'集美大桥管理中心',lng:118.11987610269,lat:24.585565663732,icon:api.screenWidth<=640?'widget://image/gis/GLZX.png':'widget://image/gis/64/GLZX.png'},
		{name:'厦门大桥管理中心',lng:118.12177201318,lat:24.550176074814,icon:api.screenWidth<=640?'widget://image/gis/GLZX.png':'widget://image/gis/64/GLZX.png'},
		{name:'海沧大桥管理中心',lng:118.05394409455,lat:24.505883338106,icon:api.screenWidth<=640?'widget://image/gis/GLZX.png':'widget://image/gis/64/GLZX.png'},
		{name:'翔安隧道管理中心',lng:118.23453385974,lat:24.568349943083,icon:api.screenWidth<=640?'widget://image/gis/GLZX.png':'widget://image/gis/64/GLZX.png'},
		{name:'聚洲车检站年费点',lng:118.18168034229,lat:24.485467234771,icon:api.screenWidth<=640?'widget://image/gis/SFWD-1.png':'widget://image/gis/64/SFWD-1.png'},
		{name:'同安车检站年费点',lng:118.17891974195,lat:24.733007563749,icon:api.screenWidth<=640?'widget://image/gis/SFWD-1.png':'widget://image/gis/64/SFWD-1.png'},
		{name:'后溪车管所年费点',lng:118.06860281074,lat:24.642398057746,icon:api.screenWidth<=640?'widget://image/gis/SFWD-1.png':'widget://image/gis/64/SFWD-1.png'},
		{name:'集美大桥年费点',lng:118.119714,lat:24.588563,icon:api.screenWidth<=640?'widget://image/gis/SFWD-1.png':'widget://image/gis/64/SFWD-1.png'},	
		{name:'厦门大桥年费点',lng:118.12023215761,lat:24.552792421359,icon:api.screenWidth<=640?'widget://image/gis/SFWD-1.png':'widget://image/gis/64/SFWD-1.png'},
		{name:'翔安隧道年费点',lng:118.2345384892,lat:24.568349315394,icon:api.screenWidth<=640?'widget://image/gis/SFWD-1.png':'widget://image/gis/64/SFWD-1.png'},
		{name:'杏林大桥年费点',lng:118.11558015196,lat:24.553054785029,icon:api.screenWidth<=640?'widget://image/gis/SFWD-1.png':'widget://image/gis/64/SFWD-1.png'},
		{name:'海沧大桥年费点',lng:118.05394247554,lat:24.505887920241,icon:api.screenWidth<=640?'widget://image/gis/SFWD-1.png':'widget://image/gis/64/SFWD-1.png'}
	];
};

function fnOperMap(isshow){
	if(bmap==null){return;}
	if(isshow){
		if(!map_opened){
			openbmap();
		}
	}else{
		closebmap();
	}
}

function fnRectMap(){
	bmap.setRect({
		rect: {
	        x : 0,
			y : 0,
			w : api.frameWidth,
			h : api.frameHeight
	    }
	});
}

/**
 * 初始化地图 
 */
function openbmap() {
	map_opened = true;
	bmap.open({
		rect : {
			x : 0,
			y : 0,
			w : api.frameWidth,
			h : api.frameHeight
		},
		center : {
			lon : 118.1320422160868,
			lat : 24.495868973589435
		},
		zoomLevel : 13,
		showUserLocation : false,
		fixedOn : api.frameName,
		fixed : true
	}, function(ret) {
		if (ret.status) {
			if(is_satellite){
				bmap.setMapAttr({
				    type: 'satellite'
				});
			}
			fnSelectPage(CUR_TAB);
			bmap.addEventListener({
                name: 'viewChange'
            },function(rett,err){
            	if(rett.status){
            		if(CUR_TAB!='gis_main_group_warehouse'){
            			if(rett.zoom>17&&isshow_camera){
							//加载当前中心点300范围内摄像机
							fnShowVideos(rett.lat,rett.lon);
						}else{
							if(videoMarkerIdArr.length>0){
								bmap.removeAnnotations({
					                ids: videoMarkerIdArr
					            });
					            videoMarkerIdArr = [];
							}
						}
            		}
//          		if(CUR_TAB=='gis_main_group_mainten'){
//          			if(rett.zoom>15){
//							if(mainten_BubbleIdArr.length<=0){
//								mainten_fnCountData();
//							}
//						}else{
//							if(mainten_BubbleIdArr.length>0){
//								bmap.removeAnnotations({
//								    ids: mainten_BubbleIdArr
//								});
//								mainten_BubbleIdArr = new Array();
//							}
//						}
//          		}
//          		if(CUR_TAB=='gis_main_group_toll'){
//          			if(rett.zoom>15){
//          				if(toll_BubbleIdArr.length<=0){
//								toll_countMtcFee();
//							}
//          			}else{
//          				if(toll_BubbleIdArr.length>0){
//								bmap.removeAnnotations({
//								    ids: toll_BubbleIdArr
//								});
//								toll_BubbleIdArr = new Array();
//							}
//          			}
//          		}
            	}
            });
		}
	});
}

/**
 * 关闭地图 
 */
function closebmap(){
	bmap.close();
	map_opened = false;
	if(road_MarkerIdArr.length>0){
        road_MarkerIdArr = [];
	}
	if(mainten_Timer!=null){
		window.clearInterval(mainten_Timer);
		mainten_Timer = null;
	}
	if(mainten_MarkerIdArr.length>0){
        mainten_MarkerIdArr = [];
	}
	if(mainten_lineIds.length>0){
		mainten_lineIds = [];
	}
	if(mainten_BubbleIdArr.length>0){
        mainten_BubbleIdArr = [];
	}
	
	if(toll_MarkerIdArr.length>0){
        toll_MarkerIdArr = [];
	}
	if(toll_BubbleIdArr.length>0){
		toll_BubbleIdArr = [];
	}
	if(warehouse_MarkerIdArr.length>0){
        warehouse_MarkerIdArr = [];
	}
	if(warehouse_BubbleIdArr.length>0){
        warehouse_BubbleIdArr = [];
	}
	if(RFIDLineIdArr.length>0 ){
		RFIDLineIdArr = [];
	}
	if(videoMarkerIdArr.length>0){
		videoMarkerIdArr = [];
	}
	if(LedMarkerIdArr.length>0){
		LedMarkerIdArr = [];
	}
	if(eventMarkerIdArr.length>0){
		eventMarkerIdArr = [];
	}
}


/**
 * 查询路况信息 
 */
function fnQueryKFRFIDBlockInfo(){
	RFIDLineIdArr = [];
	var reportUrl = $api.getStorage("report_url");
	api.ajax({
        url:reportUrl+'gims/gis-new/ajaxKFRFIDBlockInfo',
    },function(ret,err){
    	if(ret&&ret.errcode==0){
    		var data = ret.data;
    		var obj;
  			for (var k=0;k<data.length;k++) {
  				obj = data[k];
	  			if (obj.points) {
	  				var polylineArr = [];
		        	var x, y;
		        	var arr = $.trim(obj.points).split("|");
		        	var pArr, point;
		        	for (var i=0;i<arr.length;i++) {
		        		pArr = arr[i].split(",");
		        		x = $.trim(pArr[0]);
		        		y = $.trim(pArr[1]);
		        		polylineArr.push({lon:x,lat:y});
		        	}
		        	var lineColor = '#01ce33';
		        	switch(obj.speedclass){
			        	case 1:lineColor='#01ce33';break;	//绿色
			        	case 2:lineColor='#f5b604';break;//黄色
			        	case 3:lineColor='#f50b0b';break;//红色
			        	case 4:lineColor='#c70909';break;//深红色
			        	default:lineColor='#01ce33';break;
		        	}
		        	var timestamp = getRandomNum();
		        	bmap.addLine({
					    id: timestamp,
					    styles: {
					        borderColor: lineColor,
					        borderWidth: api.systemType=='ios'?2:5
					     },
					     points: polylineArr
					});
					RFIDLineIdArr.push(timestamp);
	  			}
  			}
    	}
    });
}


/**
 *	查询三类报警事件
 */
function fnQueryAlarmEvents(){
	if(eventMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: eventMarkerIdArr
        });
        eventMarkerIdArr = [];
	}
	var reportUrl = $api.getStorage("report_url");
	api.ajax({
        url:reportUrl+'gims/gis-new/queryAlarmEvents',
    },function(ret,err){
    	if(ret){
    		//交通事件
			var eventDetectionDatas = ret.eventDetectionDatas;
			//安保事件
			var eventLogDatas = ret. eventLogDatas;
			//入侵事件
			var invEventDatas = ret.invEventDatas;
			var annotations = [];
			var eventMapInfo = {};
			if(eventDetectionDatas!=null&&eventDetectionDatas.length>0){
				$.each(eventDetectionDatas,function(i,ed){
					var timestamp = getRandomNum();
					annotations.push({
						id:timestamp,
						lon:ed.lng,
						lat:ed.lat,
						icon: api.screenWidth<=640?'widget://image/gis/JTSG.png':'widget://image/gis/64/JTSG.png'
					});
					eventMarkerIdArr.push(timestamp);
					eventMapInfo[timestamp] = {'type':1,'eventInfo':ed};
				});
			}
			if(eventLogDatas!=null&&eventLogDatas.length>0){
				$.each(eventLogDatas,function(i,ed){
					var timestamp = getRandomNum();
					annotations.push({
						id:timestamp,
						lon:ed.lng,
						lat:ed.lat,
						icon: api.screenWidth<=640?'widget://image/gis/AFSJ.png':'widget://image/gis/64/AFSJ.png'
					});
					eventMarkerIdArr.push(timestamp);
					eventMapInfo[timestamp] = {'type':2,'eventInfo':ed};
				});
			}
			if(invEventDatas!=null&&invEventDatas.length>0){
				$.each(invEventDatas,function(i,ed){
					var timestamp = getRandomNum();
					annotations.push({
						id:timestamp,
						lon:ed.lan,
						lat:ed.lat,
						icon: api.screenWidth<=640?'widget://image/gis/YJRQ.png':'widget://image/gis/64/YJRQ.png'
					});
					eventMarkerIdArr.push(timestamp);
					eventMapInfo[timestamp] = {'type':3,'eventInfo':ed};
				});
			}
			bmap.addAnnotations({
			    annotations: annotations,
			}, function(ret) {
			    if (ret) {
			    	var eventInfo = eventMapInfo[ret.id];
			        fnOpenInfoFrame('eventInfo',eventInfo);
			    }
			});
    	}
    });
}


/**
 * 获取情报板 
 */
function fnQueryLedList(){
	LedMarkerIdArr = [];
	var reportUrl = $api.getStorage("report_url");
	api.ajax({
        url:reportUrl+'gims/gis-new/queryLedInfoAll',
    },function(ret,err){
    	if(ret&&ret.errcode==0){
    		LedList_All = ret.data;
    		var annotations = [];
    		$.each(ret.data,function(i,led){
				if(led.longititude!=null&&led.latitude!=null){
					var timestamp = getRandomNum();
					annotations.push({
						id:timestamp,
						lon:Number(led.longititude),
						lat:Number(led.latitude),
						icon: api.screenWidth<=640?'widget://image/gis/QBB.png':'widget://image/gis/64/QBB.png'
					});
					LedMarkerIdArr.push(timestamp);
				}
			});
			bmap.addAnnotations({
			    annotations: annotations,
			}, function(ret) {
			    if (ret) {
			        api.toast({
	                    msg:'暂无情报板信息'
                    });
			    }
			});
    	}
    });
}
/**
 * 获取所有摄像机信息 
 */
function fnQueryAllVideos(){
//	var videoList = $api.getStorage("gis_videos_all");
//	if(videoList!=null&&videoList.length>0){
//		return;
//	}
	api.showProgress({
		title: '初始化数据中...',
	    text: '请稍后',
	    modal: false
    });
	var reportUrl = $api.getStorage("report_url");
	api.ajax({
        url:reportUrl+'gims/gis-new/queryVidiconByPlano',
        method:'GET',
        cache:false,
        data:{
        	values:{userId:$api.getStorage("userId")}
        },
        timeout:15
    },function(ret,err){
    	if(ret){
    		if(ret.errcode==0){
    			$api.setStorage("gis_videos_all",ret.data);
    		}
    	}else{
    		api.toast({
                msg:'获取数据超时'
            });
    	}
    	api.hideProgress();
    });
}

var isshow_camera = true,isshow_rfid = true,isshow_led = true;
var is_satellite = false;//是否卫星地图
/**
 * 隐藏显示标注 
 */
function fnOperMarker(label,showhide){
	if(showhide=='show'){
		if(label=='rfid'){
			fnQueryKFRFIDBlockInfo();
			isshow_rfid = true;
		}
		if(label=='camera'){
			bmap.getZoomLevel(function(ret) {
			    if(ret.level>17){
			    	bmap.getCenter(function(rett) {
					    fnShowVideos(rett.lat,rett.lon);
					});
			    }
			});
			isshow_camera = true;
		}
		if(label=='led'){
			fnQueryLedList();
			isshow_led = true;
		}
		if(label=='layer'){
			//切换为标准地图
			bmap.setMapAttr({
			    type: 'standard'
			});
			is_satellite = false;
		}
	}
	if(showhide=='hide'){
		if(label=='rfid'){
			if(RFIDLineIdArr.length>0){
				bmap.removeOverlay({
	                ids: RFIDLineIdArr
                });
                RFIDLineIdArr = [];
            }
            isshow_rfid = false;
		}
		if(label=='camera'){
			if(videoMarkerIdArr.length>0){
				bmap.removeAnnotations({
	                ids: videoMarkerIdArr
	            });
	            videoMarkerIdArr = [];
			}
			isshow_camera = false;
		}
		if(label=='led'){
			if(LedMarkerIdArr.length>0){
				bmap.removeAnnotations({
	                ids: LedMarkerIdArr
                });
                LedMarkerIdArr = [];
            }
            isshow_led = false;
		}
		if(label=='layer'){
			//切换为卫星地图
			bmap.setMapAttr({
			    type: 'satellite'
			});
			is_satellite = true;
		}
	}
}

/**
 * 查询中心点范围内摄像机 
 */
function fnShowVideos(centerLat,centerLng){
	if(videoMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: videoMarkerIdArr
        });
        videoMarkerIdArr = [];
	}
	var VidiconList_All = $api.getStorage("gis_videos_all");
	if(VidiconList_All!=null){
		var annotations = [];
		var videoMap = {};
		$.each(VidiconList_All,function(i,video){
			//查找中心点300米范围内的摄像头
			if(fnDistance(centerLat,centerLng,Number(video.latitude),Number(video.longititude))<=300){
				var icon = api.screenWidth<=640?'widget://image/gis/camara.png':'widget://image/gis/64/camara.png';
				if(video.iscloudterrace==1){
					icon = api.screenWidth<=640?'widget://image/gis/QJ.png':'widget://image/gis/64/QJ.png';
				}
				var timestamp = getRandomNum();
				annotations.push({
					id:timestamp,
					lon:Number(video.longititude),
					lat:Number(video.latitude),
					icon: icon
				});
				videoMarkerIdArr.push(timestamp);
				videoMap[timestamp] = video;
			}
		});
		bmap.addAnnotations({
		    annotations: annotations,
		}, function(ret) {
		    if (ret) {
		        var video = videoMap[ret.id];
		        api.openWin({
					name : 'monitor',
					url : '../GIS_monitor.html',
					delay : 200,
					bounces : false,
					pageParam : {
						data : video
					}
				});
		    }
		});
	}
}

function fnOpenInfoFrame(type,data){
	api.openFrame({
		name : 'gis_common_info',
		url : './gis_common_info.html',
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : 'auto'
		},
		bgColor:'rgba(0, 0, 0, 0.6)',
		pageParam: {
			type:type,
	        data:data
	    },
		bounces : false,
		vScrollBarEnabled : false,
		hScrollBarEnabled : false
	});
}

/**
 * tab切换事件 
 */
function fnSelectPage(tabName){
	CUR_TAB = tabName;
	if(tabName == 'gis_main_group_monitor'){
		fnLoadMonitorMarkers();
	}
	if(tabName == 'gis_main_group_road'){
		fnLoadRoadMarkers();
	}
	if(tabName == 'gis_main_group_mainten'){
		fnLoadMaintenMarkers();
	}
	if(tabName == 'gis_main_group_toll'){
		fnLoadTollMarkers();
	}
	if(tabName == 'gis_main_group_warehouse'){
		fnLoadWarehouseMarkers();
	}
}


function fnLoadMonitorMarkers(){
	//---以下先清理不属于监控的标注
	if(road_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: road_MarkerIdArr
        });
        road_MarkerIdArr = [];
	}
	
	if(mainten_Timer!=null){
		window.clearInterval(mainten_Timer);
		mainten_Timer = null;
	}
	if(mainten_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: mainten_MarkerIdArr
        });
        mainten_MarkerIdArr = [];
	}
	if(mainten_lineIds.length>0){
		bmap.removeOverlay({
		    ids: mainten_lineIds
		});
		mainten_lineIds = [];
	}
	if(mainten_BubbleIdArr.length>0){
		bmap.removeAnnotations({
            ids: mainten_BubbleIdArr
        });
        mainten_BubbleIdArr = [];
	}
	
	if(toll_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: toll_MarkerIdArr
        });
        toll_MarkerIdArr = [];
	}
	if(toll_BubbleIdArr.length>0){
		bmap.removeAnnotations({
		    ids: toll_BubbleIdArr
		});
		toll_BubbleIdArr = new Array();
	}
	if(warehouse_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: warehouse_MarkerIdArr
        });
        warehouse_MarkerIdArr = [];
	}
	if(warehouse_BubbleIdArr.length>0){
		bmap.removeAnnotations({
		    ids: warehouse_BubbleIdArr
		});
        warehouse_BubbleIdArr = [];
	}
	
	//--以下加载监控的标注信息
	if(RFIDLineIdArr.length<=0 && isshow_rfid){
		fnQueryKFRFIDBlockInfo();
	}
	if(videoMarkerIdArr.length<=0 && isshow_camera){
		bmap.getZoomLevel(function(ret) {
		    if(ret.level>17){
		    	bmap.getCenter(function(rett) {
				    fnShowVideos(rett.lat,rett.lon);
				});
		    }
		});
	}
	if(LedMarkerIdArr.length<=0 && isshow_led){
		fnQueryLedList();
	}
	if(eventMarkerIdArr.length<=0){
		fnQueryAlarmEvents();
	}
}

function fnLoadRoadMarkers(){
	//---以下清理不属于路政的标注--
	if(mainten_Timer!=null){
		window.clearInterval(mainten_Timer);
		mainten_Timer = null;
	}
	if(mainten_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: mainten_MarkerIdArr
        });
        mainten_MarkerIdArr = [];
	}
	if(mainten_lineIds.length>0){
		bmap.removeOverlay({
		    ids: mainten_lineIds
		});
		mainten_lineIds = [];
	}
	if(mainten_BubbleIdArr.length>0){
		bmap.removeAnnotations({
            ids: mainten_BubbleIdArr
        });
        mainten_BubbleIdArr = [];
	}
	
	if(toll_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: toll_MarkerIdArr
        });
        toll_MarkerIdArr = [];
	}
	if(toll_BubbleIdArr.length>0){
		bmap.removeAnnotations({
		    ids: toll_BubbleIdArr
		});
		toll_BubbleIdArr = new Array();
	}
	if(warehouse_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: warehouse_MarkerIdArr
        });
        warehouse_MarkerIdArr = [];
	}
	if(warehouse_BubbleIdArr.length>0){
		bmap.removeAnnotations({
		    ids: warehouse_BubbleIdArr
		});
        warehouse_BubbleIdArr = [];
	}
	if(LedMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: LedMarkerIdArr
        });
        LedMarkerIdArr = [];
	}
	if(eventMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: eventMarkerIdArr
        });
        eventMarkerIdArr = [];
	}
	if(mainten_lineIds.length>0){
		bmap.removeOverlay({
		    ids: mainten_lineIds
		});
		mainten_lineIds = [];
	}
	//------以下加载路政的标注-------
	if(RFIDLineIdArr.length<=0 && isshow_rfid){
		fnQueryKFRFIDBlockInfo();
	}
	if(videoMarkerIdArr.length<=0 && isshow_camera){
		bmap.getZoomLevel(function(ret) {
		    if(ret.level>17){
		    	bmap.getCenter(function(rett) {
				    fnShowVideos(rett.lat,rett.lon);
				});
		    }
		});
	}
	if(road_MarkerIdArr.length<=0){
		//-todo加载路政车辆信息
		
	}
}

function fnLoadMaintenMarkers(){
	//---以下先清理不属于监控的标注
	if(road_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: road_MarkerIdArr
        });
        road_MarkerIdArr = [];
	}
	if(toll_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: toll_MarkerIdArr
        });
        toll_MarkerIdArr = [];
	}
	if(toll_BubbleIdArr.length>0){
		bmap.removeAnnotations({
		    ids: toll_BubbleIdArr
		});
		toll_BubbleIdArr = new Array();
	}
	if(warehouse_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: warehouse_MarkerIdArr
        });
        warehouse_MarkerIdArr = [];
	}
	if(warehouse_BubbleIdArr.length>0){
		bmap.removeAnnotations({
		    ids: warehouse_BubbleIdArr
		});
        warehouse_BubbleIdArr = [];
	}
	if(LedMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: LedMarkerIdArr
        });
        LedMarkerIdArr = [];
	}
	if(eventMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: eventMarkerIdArr
        });
        eventMarkerIdArr = [];
	}
	if(RFIDLineIdArr.length>0){
		bmap.removeOverlay({
            ids: RFIDLineIdArr
        });
        RFIDLineIdArr = [];
    }
    //--以下加载养护的标注信息
    if(videoMarkerIdArr.length<=0 && isshow_camera){
		bmap.getZoomLevel(function(ret) {
		    if(ret.level>17){
		    	bmap.getCenter(function(rett) {
				    fnShowVideos(rett.lat,rett.lon);
				});
		    }
		});
	}
	if(mainten_MarkerIdArr.length<=0){
		//-todo加载养护车辆信息
		mainten_fnQueryCars(1,'');
		mainten_Timer = window.setInterval(function(){
			mainten_fnUpdateCars(mainten_curOnline,mainten_curType);
		},10000);
		api.execScript({
			frameName:'gis_common_footer',
	        script: 'fnGetMainInfo();'
        });
	}
//	bmap.getZoomLevel(function(ret) {
//	    if(ret.level>15){
	    	mainten_fnCountData();
//	    }
//	});
}

function fnLoadTollMarkers(){
	//---以下先清理不属于监控的标注
	if(road_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: road_MarkerIdArr
        });
        road_MarkerIdArr = [];
	}
	if(mainten_Timer!=null){
		window.clearInterval(mainten_Timer);
		mainten_Timer = null;
	}
	if(mainten_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: mainten_MarkerIdArr
        });
        mainten_MarkerIdArr = [];
	}
	if(mainten_lineIds.length>0){
		bmap.removeOverlay({
		    ids: mainten_lineIds
		});
		mainten_lineIds = [];
	}
	if(mainten_BubbleIdArr.length>0){
		bmap.removeAnnotations({
            ids: mainten_BubbleIdArr
        });
        mainten_BubbleIdArr = [];
	}
	
	if(warehouse_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: warehouse_MarkerIdArr
        });
        warehouse_MarkerIdArr = [];
	}
	if(warehouse_BubbleIdArr.length>0){
		bmap.removeAnnotations({
		    ids: warehouse_BubbleIdArr
		});
        warehouse_BubbleIdArr = [];
	}
	if(LedMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: LedMarkerIdArr
        });
        LedMarkerIdArr = [];
	}
	if(eventMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: eventMarkerIdArr
        });
        eventMarkerIdArr = [];
	}
	if(RFIDLineIdArr.length>0){
		bmap.removeOverlay({
            ids: RFIDLineIdArr
        });
        RFIDLineIdArr = [];
    }
    if(mainten_lineIds.length>0){
		bmap.removeOverlay({
		    ids: mainten_lineIds
		});
		mainten_lineIds = [];
	}
    //--以下加载收费的标注信息
    if(videoMarkerIdArr.length<=0 && isshow_camera){
		bmap.getZoomLevel(function(ret) {
		    if(ret.level>17){
		    	bmap.getCenter(function(rett) {
				    fnShowVideos(rett.lat,rett.lon);
				});
		    }
		});
	}
	if(toll_MarkerIdArr.length<=0){
		//-todo加载收费标注信息
		toll_loadTollMarkers();
	}
//	bmap.getZoomLevel(function(ret) {
//	    if(ret.level>15){
	    	toll_countMtcFee();
//	    }
//	});
}

function fnLoadWarehouseMarkers(){
	//---以下先清理不属于监控的标注
	if(road_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: road_MarkerIdArr
        });
        road_MarkerIdArr = [];
	}
	if(mainten_Timer!=null){
		window.clearInterval(mainten_Timer);
		mainten_Timer = null;
	}
	if(mainten_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: mainten_MarkerIdArr
        });
        mainten_MarkerIdArr = [];
	}
	if(mainten_lineIds.length>0){
		bmap.removeOverlay({
		    ids: mainten_lineIds
		});
		mainten_lineIds = [];
	}
	if(mainten_BubbleIdArr.length>0){
		bmap.removeAnnotations({
            ids: mainten_BubbleIdArr
        });
        mainten_BubbleIdArr = [];
	}
	
	if(toll_MarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: toll_MarkerIdArr
        });
        toll_MarkerIdArr = [];
	}
	if(toll_BubbleIdArr.length>0){
		bmap.removeAnnotations({
		    ids: toll_BubbleIdArr
		});
		toll_BubbleIdArr = [];
	}
	if(LedMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: LedMarkerIdArr
        });
        LedMarkerIdArr = [];
	}
	if(eventMarkerIdArr.length>0){
		bmap.removeAnnotations({
            ids: eventMarkerIdArr
        });
        eventMarkerIdArr = [];
	}
	if(RFIDLineIdArr.length>0){
		bmap.removeOverlay({
            ids: RFIDLineIdArr
        });
        RFIDLineIdArr = [];
    }
    if(videoMarkerIdArr.length>0){
    	bmap.removeAnnotations({
            ids: videoMarkerIdArr
        });
        videoMarkerIdArr = [];
    }
    if(mainten_lineIds.length>0){
		bmap.removeOverlay({
		    ids: mainten_lineIds
		});
		mainten_lineIds = [];
	}
    //--以下加载仓库的标注信息
    if(warehouse_MarkerIdArr.length<=0){
    	//-todo加载仓库标注信息
    	warehouse_search();
    }
}