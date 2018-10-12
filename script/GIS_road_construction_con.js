apiready = function() {
	if(api.pageParam.pla_no) {
		fnRoad(api.pageParam.pla_no);
	} else {
		fnRoad();
	}	
}
var fluxjson = [];
function fnRoad(pla_no){
	var url = $api.getStorage('gmms_url');
	api.ajax({
//		url : url + 'roadwork',
		url : url + '/modules/mobile/report/colligate-manager!roadwork.action',
		method : 'get',
		timeout : 30000,
		dataType : 'json',
	}, function(ret, err) {
		console.log(JSON.stringify(ret));
		if (ret) {
			if(ret.result) {
				for(var k=0,len=ret.data.length;k<len;k++) {
					if(fluxjson[ret.data[k].plano]) {
						fluxjson[ret.data[k].plano].push(ret.data[k]);
					} else {
						var temparr = [];
						temparr.push(ret.data[k]);
						fluxjson[ret.data[k].plano] = temparr;
					}					
				}
			}
			if(pla_no){
				roadswitch(pla_no);
			}else{
				roadswitch('0001');
			}
		} 
	});
}

function roadswitch(pla_no) {
	if(fluxjson.length<=0){
		$api.html($api.byId('main'), '<div style="margin:0 auto;margin-top:10px;text-align: center;color:#ccc;">暂无数据</div>');
		return false;
	}
	var roadArray = [];
	var data = fluxjson[pla_no];
	var workstatus = {
		'未施工': 'yellow',
		'施工中': 'red'
	};
	for(var k in data) {
		if(workstatus[data[k].workstatus]) {
			roadArray.push('<div class="box '+workstatus[data[k].workstatus]+'" onclick="openNewWindow('+k+',&quot;'+pla_no+'&quot;)">'+
                         '<div class="firsttop">'+
                           '<span class="topleft">方向:<span id="direction">'+data[k].direction+'</span></span>'+
	                       '<span class="topright">施工类型:<span id="worktype">'+data[k].worktype+'</span></span>'+
	                     '</div>'+       
                         '<div class="centetfont">'+
                         	'<div class="flexrow">'+
                         	  '<div>开始日期:'+data[k].startdate+'</div>'+
                         	'</div>'+
                         	'<div class="flexrow">'+
                         	  '<div>结束日期:'+data[k].enddate+'</div>'+
                         	'</div>'+
                         	'<div class="flexrow">'+
                         	  '<div>施工状态:'+data[k].workstatus+'</div>'+
                         	  '<div>占用车道:'+data[k].workplace+'</div>'+
                         	'</div>'+
                         	'<div class="flexrow">'+
                         	  '<div id="workdesc">施工详情:'+data[k].workdesc+'</div>'+                         	
                         	'</div>'+
                         '</div>'+
                       '</div>');
		}
	}
	$api.html($api.byId('main'), roadArray.join(''));
}

function openNewWindow(index,pla_no) {
	var data = fluxjson[pla_no][index];
	api.openWin({
		name : 'GIS_construction_detail',
		url : './GIS_construction_detail.html',
		pageParam : {
			data : data
		},
		delay : 200,
		bounces : false
	});
}     