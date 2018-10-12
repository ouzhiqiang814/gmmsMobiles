var urlArr = [];
var videoData = null;
var videoPlayer = null;
var isMax = false;		//是否全屏
var playHandle = false;//播放句柄
apiready = function() {
	$('#sliderimage').height(api.frameWidth*9/16);
	$('.bmap').height(api.frameHeight-$('#sliderimage').height()-$('.box_center').height());
	videoData = api.pageParam.data;
	//获取大华服务器信息
	var dhServer = $api.getStorage('dhServer');
	if(dhServer==null||dhServer==undefined||dhServer.videoserverid!=videoData.videoserverid){
		window.setTimeout(function(){
			fnGetDHServer(videoData.videoserverid);
		},300);
	}else{
		window.setTimeout(function(){
			openVideo();
		},300);
	}
	Video_img();
    api.openFrame({
	    name: 'playtool',
	    url: './playtool/playtool.html',
	    rect: {
		    x: 0,
            y: api.pageParam.headerHeight,
            w: api.frameWidth,
            h: $('#sliderimage').height()
	    },
	    pageParam:{frameName:api.frameName},
	    bounces:false
    });
}

function fnGetDHServer(videoserverid){
	api.showProgress({
		style : 'default',
		title : '获取视频服务中...',
		modal : false
	});
	var reportUrl = $api.getStorage("report_url");
	api.ajax({
		url : reportUrl + '/gims/gis-new/getVideoServer',
		data:{
			values:{videoServerId:videoserverid}
		},
		timeout:10,
	}, function(ret, err) {
		if(ret&&ret.errcode==0&ret.data!=null){
			$api.setStorage('dhServer',ret.data);
			openVideo();
		}else{
			api.toast({
	            msg:'获取视频服务失败，请检查网络'
            });
		}
		api.hideProgress();
	});
}


//最大化播放
function fnMaxVideo(){
	api.setScreenOrientation({
	    orientation: api.systemType=='ios'?'landscape_right':'landscape_left'
	});
	api.setFrameAttr({
	    name: api.frameName,
	    rect:{
	    	x : 0,
			y : 0,
			w : 'auto',
			h : 'auto'
	    }
    });
    $('#sliderimage').height(api.frameHeight);
    $('.box_center').hide();
    $('.bmap').hide();
    window.setTimeout(function(){
    	videoPlayer.reset({
    		x: 0,
		    y: 0,
		    w: api.winWidth,
		    h: api.winHeight,
            fixedOn: api.frameName
    	});
    	api.setFrameAttr({
		    name: 'playtool',
		    rect:{
		    	x: 0,
	            y: 0,
	            w: 'auto',
			    h: 'auto'
		    }
		});
	},api.systemType=='ios'?300:500);
	isMax = true;
}

//普通播放
function fnNormalVideo(){
	api.setScreenOrientation({
	    orientation: 'auto_portrait'
	});
	api.setFrameAttr({
	    name: api.frameName,
	    rect:{
	    	x : 0,
			y : api.pageParam.headerHeight,
			w : 'auto',
			h : 'auto'
	    }
    });
    $('.box_center').show();
    $('.bmap').show();
	window.setTimeout(function(){
		$('#sliderimage').height(api.frameWidth*9/16);
		videoPlayer.reset({
    		x: 0,
            y: 0,
            w: api.frameWidth,
            h: $('#sliderimage').height(),
            fixedOn: api.frameName
    	});
        api.setFrameAttr({
		    name: 'playtool',
		    rect:{
		    	x: 0,
	            y: api.pageParam.headerHeight,
	            w: api.frameWidth,
	            h: $('#sliderimage').height()
		    }
		});
	},api.systemType=='ios'?300:500);
	isMax = false;
}

function Video_img() {
	$api.text($api.byId('vidiconname'), videoData.vidiconnameshort==null?videoData.vidiconname:videoData.vidiconnameshort);
	$api.text($api.byId('status'), videoData.status=="1"?'正常':'异常');
	var latlng = null;
	if(videoData.longititude!=null&&videoData.longititude!=''){
		latlng = videoData.longititude+','+videoData.latitude;
		$api.text($api.byId('latlng'), latlng);
	}
	//获取百度地图位置
	var imgw = $('.bmap').width();
	var imgh = $('.bmap').height();
	if(latlng!=null){
		$('.bmap').html('<img src="http://api.map.baidu.com/staticimage/v2?ak=0XYFYwIKdjHF1BXa1G6KGTNNlh00nhw8&width='+imgw+'&height='+imgh+'&center='+latlng+'&markers='+latlng+'&zoom=16&markerStyles=l,,blue&dpiType=ph"/>')
	}else{
		api.toast({
            msg:'暂无位置信息'
        });
	}
	
}


function openVideo() {
	//关闭已经打开的地图避免视频层被地图层遮挡
	api.execScript({
	    name:'gis_main',
	    frameName:'gis_main_body',
	    script: 'closebmap();'
    });
	if(playHandle){return;}
	if(videoPlayer==null){
		var dhServer = $api.getStorage('dhServer');
		videoPlayer = api.require('dhvideo');
		videoPlayer.login({
	        ip: dhServer.extranetipaddress,//serveripinnet
	        port: dhServer.port,
	        userName: dhServer.outnetuser,
	        password: dhServer.outnetpwd
	    }, function (ret) {
	        if (ret.success) {
	            videoPlayer.open({
	                x: 0,
	                y: 0,
	                w: api.frameWidth,
	                h: $('#sliderimage').height(),
	                fixedOn: api.frameName
	            });
	            videoPlayer.start({
	                deviceId: videoData.hkvidiconid//大华的摄像机ID目前写在海康字段上
	            });
	        }else{
	        	api.toast({
	                msg:'失败，请检查网络是否正常'
	            });
	        }
	    });
    }else{
    	if(!isMax){
	    	videoPlayer.open({
	            x: 0,
	            y: 0,
	            w: api.frameWidth,
	            h: $('#sliderimage').height(),
	            fixedOn: api.frameName
	        });
	        videoPlayer.start({
	            deviceId: videoData.hkvidiconid
	        });
        }else{
        	videoPlayer.open({
			    x: 0,
			    y: 0,
			    w: api.winWidth,
			    h: api.winHeight,
	            fixedOn: api.frameName
			});
			videoPlayer.start({
	            deviceId: videoData.hkvidiconid
	        });
        }
    }
    playHandle = true;
}

function stopVideo(){
	if(!playHandle){return;}
	videoPlayer.stop(function(ret){
		playHandle = false;
	});
}


function videoDestroy(){
	if(videoPlayer!=null){
		if(playHandle){
			videoPlayer.stop(function(ret){
				playHandle = false;
				videoPlayer.destroy();
			});
		}else{
			videoPlayer.destroy();
		}
	}
}