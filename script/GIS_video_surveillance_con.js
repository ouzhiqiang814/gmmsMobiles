apiready = function() {
	if($api.getStorage('VIDEO_DATA')){
		videoswitch(cur_plano);
	}else{
		fnGetData();
	}
	
	initTabs();
};

var pla_no = ['0001','0002','0003','0004','0005'];
var cur_plano = '0001';
function initTabs(){
	var NVNavigationBar = api.require('NVNavigationBar');
	NVNavigationBar.open({
	    rect: {
	         x: 0,
	         y: 0,
	         w: api.frameWidth,
	         h: 42
	    },
	   styles: {
	         orientation: 'horizontal',
	         bg: '#fff',
	         bgAlpha: 1,
	         font: {
	         size: 14,
	         sizeSelected: 18,
	         color: '#000',
	         colorSelected: '#06f',
	         alpha: 1
	         },
	         itemSize: {
	             w: 80,
	             h: 44
	         }
	   },
	    items: [{
	       title: '厦门大桥',
	       bg: '#FFFFFF'
	       },{
	       title: '海沧大桥',
	       bg: '#FFFFFF'
	       },{
	       title: '集美大桥',
	       bg: '#FFFFFF'
	       },{
	       title: '杏林大桥',
	       bg: '#FFFFFF'
	       },{
	       title: '翔安隧道',
	       bg: '#FFFFFF'
	       }],
	       selectedIndex: 0,
	       fixedOn: api.frameName,
	       id: 'mytab'
	}, function(ret, err) {
		if(ret.eventType=='click'){
			var selIndex = ret.index;
			var cur_plano = pla_no[ret.index];
			videoswitch(cur_plano);
	    }
	});
}

//初始获取数据
function fnGetData(pla_no){
 	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		modal : false
	});
	var url = $api.getStorage('gmms_url');
	api.ajax({
//		url : url + 'video?user_id=' + $api.getStorage("userId"),
		url : url + '/modules/mobile/report/colligate-manager!video.action',
		data:{
			values:{userId:$api.getStorage("userId")}
		},
		method : 'get',
		dataType : 'json',
	}, function(ret, err) {
		if(ret){
			if(ret.result){
				var fluxjson = {};
				$api.setStorage('VIDEO_DATA',ret.data)
				if(pla_no) {
					videoswitch(pla_no);
				} else {
					videoswitch('0001');
				}
			}else{
				api.toast({
	                msg:'暂无数据'
                });
			}
		}else{
			api.toast({
	            msg:err.msg
            });
		}
		api.hideProgress();
	});
}

//tab切换方法
function videoswitch(pla_no){
	var VIDEO_DATA = $api.getStorage('VIDEO_DATA');
	$('#video_list1').empty();
	if(VIDEO_DATA!=null){
		var titleArr = new Array();
		$.each(VIDEO_DATA,function(i,data){
			if(pla_no == data.plazano){
				titleArr.push(data.vidiconareaname);
			}
		});
		titleArr = titleArr.unique();
		if(titleArr.length>0){
			$.each(titleArr,function(i,title){
				var liStr1 = '',liStr2 = '';
				$.each(VIDEO_DATA,function(j,data){
					if(data.vidiconareaname == title&&data.plazano == pla_no){
						liStr1 += '<li class="mui-table-view-cell mui-col-xs-6 mui-col-sm-6" style="padding:25px 5px;">'+
							 	  '	<button type="button" dataNum="'+j+'" class="mui-btn mui-btn-primary my-btn"><i class="mui-icon mui-icon-videocam" style="font-size: 20px;"></i>'+data.vidiconnameshort+'</button>'+
								  '</li>';
						
//						liStr2 += '<li id="video-pic-'+j+'" dataNum="'+j+'" class="mui-table-view-cell mui-col-xs-4 mui-col-sm-6"'+
//								 'style="background-image: url(\'../../image/imgloading.jpg\');background-position: center;background-size: cover;height:28vw;padding:0">'+
//								 '<label class="my-cell-label">'+data.vidiconnameshort+'</label>'+
//								 '</li>';
//						fnCacheImage('video-pic-'+j,data.picurl1);
					}
				});
				var htmlStr1 = 
					'<h5 class="title">'+title+'</h5>'+
					'<ul class="mui-table-view mui-grid-view mui-grid-9">'+
					liStr1+
					'</ul>';
				$('#video_list1').append(htmlStr1);
//				var htmlStr2 = 
//					'<h5 class="title">'+title+'</h5>'+
//					'<ul class="mui-table-view mui-grid-view mui-grid-9">'+
//					liStr2+
//					'</ul>';
//				$('#video_list2').append(htmlStr2);
			});
			
			mui('.mui-table-view').on('tap','button',function(){
				var dataNum = this.getAttribute('dataNum');
				fnOpenVideoWin(VIDEO_DATA[dataNum]);
			});
		}else{
			$('#video_list1').append('<p style="margin-top:20px;width:100%;text-align:center;">暂无数据</p>');
		}
	}
}

//刷新数据
function refresh() {
	fnGetData(cur_plano);
}

//打开具体视频浏览窗口
function fnOpenVideoWin(data){
	api.openWin({
		name : 'monitor',
		url : '../second_frame/GIS_monitor.html',
		delay : 200,
		bounces : false,
		pageParam : {
			data : data
		}
	});
}

//图片缓存
function fnCacheImage(eventId,imgUrl){
	api.imageCache({
	    url: imgUrl,
	    policy:'cache_else_network'		    
	}, function(ret, err) {
	    var url = ret.url;
	    if(url!=imgUrl){
	    	$('#'+eventId).css('background-image','url('+url+')');
	    }else{
	    	$('#'+eventId).css('background-image','url(\'../../image/noimage.gif\')');
	    }
	});
}

//数组去重复
Array.prototype.unique = function(){
 	var res = [];
 	var json = {};
 	for(var i = 0; i < this.length; i++){
  		if(!json[this[i]]){
	   		res.push(this[i]);
	   		json[this[i]] = 1;
  		}
 	}
 	return res;
}