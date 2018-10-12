var warehouse_MarkerIdArr = [];//无人仓库标注ID集合
var warehouse_BubbleIdArr = [];	//仓库布告牌ID集合
function warehouse_search(){
	var serverUri = $api.getStorage('gmms_url')+'modules/mobile/device/store-house!list.action';
	api.ajax({
	    url:serverUri,
	    method: 'get',
	    timeout:10,
	    data: {
	        values: {
	        	userId:$api.getStorage("userId")
	        }
	    }
	}, function(ret, err) {
		if(ret){
			var alarmMap = [];
			var annotations = [];
			var markInfos = {};
			var redImg = api.screenWidth<=640?'widget://image/gis/storehouse_red.png':'widget://image/gis/64/storehouse_red.png';
			var blueImg = api.screenWidth<=640?'widget://image/gis/storehouse_blue.png':'widget://image/gis/64/storehouse_blue.png';
			$.each(ret,function(i,sh){
				var timestamp = getRandomNum();
				annotations.push({
					id:timestamp,
					lon:sh.lon,
					lat:sh.lat,
					icon:sh.infoId!=null?redImg:blueImg
				});
				if(sh.infoId!=null){
					alarmMap.push(sh);
				}
				markInfos[timestamp] = sh;
				warehouse_MarkerIdArr.push(timestamp);
			});
			bmap.addAnnotations({
			    annotations: annotations
			}, function(rett) {
				if(rett){
					var sh = markInfos[rett.id];
					warehouse_fnOpenVideoWin(sh.id,sh.name);
				}
			});
			var warehouseInfos = {};
			$.each(ret,function(i,sh){
				//添加布告牌
				var timestamp = getRandomNum();
				warehouseInfos[timestamp] = sh;
				bmap.addBillboard({
				    id: timestamp,
				    coords: {
				        lon: sh.lon,
				        lat: sh.lat
				    },
				    bgImg:'widget://image/gis/160X75_2.png',
				    content: {
				        title: sh.name,
				        subTitle: '查看实时视频'
				    },
				    styles: {
				        titleColor: '#fff',
				        titleSize: 14,
				        subTitleColor: '#fff',
				        subTitleSize: 12
				    }
				}, function(rett) {
				    if (rett) {
				    	var warehouseInfo = warehouseInfos[rett.id];
						warehouse_fnOpenVideoWin(warehouseInfo.id,warehouseInfo.name);
				    }
				});
				warehouse_BubbleIdArr.push(timestamp);
			});
			
			warehouse_fnOpenMsgframe(alarmMap);
		}else{
			api.toast({ msg: '获取仓库信息失败!'});
		}
	});
}

function warehouse_fnOpenVideoWin(houseId,houseName){
    api.openWin({
        name: 'warehouse_alarm',
        url: '../warehouse/warehouse_alarm.html',
        bounces : false,
        slidBackEnabled:false,
        pageParam:{
        	name:houseName,
        	houseId:houseId
        }
    });
}

function warehouse_fnOpenMsgframe(alarmMap){
	api.closeFrame({
        name: 'warehouse_msg'
    });
	if(alarmMap.length<=0){
		return;
	}
	api.openFrame({
        name: 'warehouse_msg',
        url: '../warehouse/warehouse_msg.html',
        rect: {
	        x:0,
	        y:api.winHeight-100,
	        w:'auto',
	        h:100
        },
        pageParam: {
	        alarmMap:alarmMap
	    },
	    animation:{
	    	type:'movein',
	    	subType:'from_bottom'
	    },
        bounces: false,
        vScrollBarEnabled:true,
        hScrollBarEnabled:false
    });
}