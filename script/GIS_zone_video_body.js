mui.init();
var cur_plano = null;
var cur_type = '';
var cur_status = '';
var cur_data = [];
var cur_title = '';
var cur_showPic = 'true';
var cur_like = 'false';
var cur_search = '';
var cur_listType = 'list';
var cur_pageNo = 1,cur_pageSize = 10,cur_pageTotal = 0;
var dot1 = null,dot2 = null;
apiready = function(){
	if($api.getStorage("video_showpic")){
		cur_showPic = $api.getStorage("video_showpic");
	}
	cur_plano = api.pageParam.plano;
	cur_type = api.pageParam.bizType==null?'':api.pageParam.bizType;
	fnInitDot();
	fnQueryVideoData(true);
	fnInitPull();
	fnInitPushRefresh();
	
};

function fnLoading(txt){
	$('#list_more').html('<span class="mui-spinner" style="margin-bottom: -5px;"></span>'+(txt==null||txt==undefined)?'加载中...':txt);
	$('#list_more').show();
}

function fnLoaded(txt){
	$('#list_more').html((txt==null||txt==undefined)?'加载更多':txt);
	$('#list_more').show();
}

function fnInitDot(){
	var video_list = $api.byId('video_list');
	var template1 = $api.byId('template');
	dot1 = doT.template(template1.innerHTML);
	var video_list2 = $api.byId('video_list2');
	var template2 = $api.byId('template2');
	dot2 = doT.template(template2.innerHTML);
}

function fnQueryVideoData(isload){
	var reportUrl = $api.getStorage("report_url");
	var picRoot = reportUrl.replace(reportUrl.substring(reportUrl.lastIndexOf(':'),reportUrl.length),':9080');
	if(cur_listType=='list'&&cur_pageNo==1){
		$('#video_list').empty();
		cur_data = [];
	}
	if(cur_listType=='card'&&cur_pageNo==1){
		$('#video_list2').empty();
		cur_data = [];
	}
	if(isload){
		api.showProgress({
			style : 'default',
			title : '努力加载中...',
			modal : false
		});
	}
	isPush = true;
	if(cur_pageNo>1){
		fnLoading();
	}else{
		$('#list_more').hide();
	}
	api.ajax({
		url : reportUrl + '/gims/gis-new/queryVidiconByPage',
		data:{
			values:{
				userId:$api.getStorage("userId"),
				plano:cur_plano,
				type:cur_type,
				areaName:cur_title,
				status:cur_status,
				vidiconName:cur_search,
				pageNo:cur_pageNo,
				pageSize:cur_pageSize
			}
		},
		timeout:10,
	}, function(ret, err) {
		if(ret&&ret.errcode==0&&ret.rows.length>0){
			cur_pageTotal = ret.total;
			var videodata = ret.rows;
			$.each(videodata,function(i,video){
				video.showPic = cur_showPic;
				switch(video.biztype){
				case 1:video.biztypename = '交通视频';break;
				case 2:video.biztypename = '收费视频';break;
				case 3:video.biztypename = '路政视频';break;
				case 4:video.biztypename = '安防视频';break;
				}
				video.picurl2 = picRoot+video.picurl2;
				cur_data.push(video);
			});
			if(cur_listType=='list'){
		    	$('#video_list').append(dot1(videodata));
				$('#video_list2').hide();
				$('#video_list').show();
				$.each(videodata,function(i,data){
		    		if($('#img_'+data.vidiconid).length>0){
		    			fnCacheImage('img_'+data.vidiconid,$('#img_'+data.vidiconid).attr('realUrl'));
		    		}
		    	});
			}
			if(cur_listType=='card'){
		    	$('#video_list2').append(dot2(videodata));
				$('#video_list').hide();
				$('#video_list2').show();
				$.each(videodata,function(i,data){
		    		if($('#div_'+data.vidiconid).length>0){
		    			fnCacheImage2('div_'+data.vidiconid,$('#div_'+data.vidiconid).attr('realUrl'));
		    		}
		    	});
			}
			fnLoaded();
		}else{
			fnLoaded('暂无数据');
		}
		if(isload){
			api.hideProgress();
		}else{
			api.refreshHeaderLoadDone(); //刷新结束
		}
		isPush = false;
	});
}
var isPush = true;
// 下拉刷新
function fnInitPull() {
	api.setRefreshHeaderInfo({
	 	bgColor: '#efeff4',
        dropColor:'#9BA2AC'
	},function(){
		cur_pageNo = 1;
		fnQueryVideoData(false);
	});
};
// 上拉加载更多
function fnInitPushRefresh() {
	api.addEventListener({
		name: 'scrolltobottom',
		extra:{
	        threshold:10            //设置距离底部多少距离时触发，默认值为0，数字类型
	    }
  	}, function(ret, err) {
  		if(isPush){
  			return;
  		}
  		if(cur_listType == 'list'){
  			if($('#video_list li').length>=cur_pageTotal){
	        	isPush = false;
	        	fnLoaded('没有更多了');
	        	return;
  			}
  		}
  		if(cur_listType == 'card'){
  			if($('#video_list2 li').length>=cur_pageTotal){
	        	isPush = false;
	        	fnLoaded('没有更多了');
	        	return;
  			}
  		}
  		cur_pageNo++;
  		fnQueryVideoData(false);
  	});
};


function fnSetListView(listType){
	cur_listType = listType;
	cur_pageNo = 1;
	fnQueryVideoData(true);
}

function fnSearch(val){
	cur_search = val;
	cur_pageNo = 1;
	fnQueryVideoData(true);
}

function fnSetParam(field,val){
	if(field=='type'){
		cur_type = val;
		cur_pageNo = 1;
		fnQueryVideoData(true);
	}
	if(field=='status'){
		cur_status = val;
		cur_pageNo = 1;
		fnQueryVideoData(true);
	}
	if(field=='showPic'){
		cur_showPic = val;
		$api.setStorage('video_showpic',val);
		fnShowPic(val);
	}
	if(field == 'title'){
		cur_title = val;
		cur_pageNo = 1;
		fnQueryVideoData(true);
	}
}

function fnShowPic(isShow){
	cur_showPic = isShow;
	if(isShow=='true'){
		$('#video_list li').each(function(){
			var imgUrl = $(this).find('.mui-media-object').attr('imgUrl');
			var imgId = $(this).find('.mui-media-object').attr('imgId');
			if(imgUrl!=undefined&&imgUrl!=null){
				$(this).find('.mui-media-object').remove();
				$(this).find('a').prepend('<img id="'+imgId+'" src="../../image/imgloading.jpg" realUrl="'+imgUrl+'" class="mui-media-object mui-pull-left"/>');
				fnCacheImage(imgId,imgUrl);
			}
		});
		
	}else{
		$('#video_list li').each(function(){
			var imgUrl = $(this).find('.mui-media-object').attr('realUrl');
			var imgId = $(this).find('.mui-media-object').attr('id');
			if(imgUrl!=undefined&&imgUrl!=null){
				$(this).find('.mui-media-object').remove();
				$(this).find('a').prepend(
					'<div class="mui-media-object mui-pull-left no-pic" style="height:85px;" imgId="'+imgId+'" imgUrl="'+imgUrl+'" onclick="showPic(this)">'+
					'	<em class="icon iconfont icon-video"></em>'+
					'	<p>点击显示图片</p>'+
					'</div>'
				);
			}
		});
	}
}

function showPic(_this){
	var imgUrl = $(_this).attr('imgUrl');
	var imgId = $(_this).attr('imgId');
	$(_this).parent().prepend('<img id="'+imgId+'" src="../../image/imgloading.jpg" realUrl="'+imgUrl+'" class="mui-media-object mui-pull-left"/>');
	$(_this).remove();
	fnCacheImage(imgId,imgUrl);
}

//打开具体视频浏览窗口
function fnOpenVideoWin(vidiconid){
	var vdata = null;
	$.each(cur_data,function(i,data){
		if(data.vidiconid==vidiconid){
			vdata = data;
		}
	});
	api.openWin({
		name : 'monitor',
		url : './GIS_monitor.html',
		delay : 200,
		bounces : false,
		pageParam : {
			data : vdata
		}
	});
}

//图片缓存
function fnCacheImage(imgEl,imgUrl){
	api.imageCache({
	    url: imgUrl,
	    policy:'no_cache'		    
	}, function(ret, err) {
	    var url = ret.url;
	    if($('#'+imgEl).length>0){
		    if(url!=imgUrl){
		    	$('#'+imgEl).attr('src',url);
		    }else{
		    	$('#'+imgEl).attr('src','../../image/noimage.png');
		    }
	    }
	});
}
//图片缓存2
function fnCacheImage2(imgEl,imgUrl){
	api.imageCache({
	    url: imgUrl,
	    policy:'no_cache'		    
	}, function(ret, err) {
	    var url = ret.url;
	    if($('#'+imgEl).length>0){
		    if(url!=imgUrl){
		    	$('#'+imgEl).css('background-image','url('+url+')');
		    }else{
		    	$('#'+imgEl).css('background-image','url(../../image/noimage.png)');
		    }
	    }
	});
}

