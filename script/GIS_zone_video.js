var myPopup = null;
var NVNavigationBar = null;
apiready = function(){
	var header = $api.byId('my-header');
    if (header) {
        $api.fixStatusBar(header);
        headerHeight = $api.offset(header).h;
    }
	fnReadyKeyback();
	var pageParam = api.pageParam;
	$('#header h1').html(pageParam.planame+"&nbsp;&nbsp;");
	if($api.getStorage("video_showpic")&&$api.getStorage("video_showpic")=='false'){
		$('.list-tab[field="showPic"]').find('em').hide();
		$('.list-tab[field="showPic"]').attr('val','false');
	}
	myPopup = api.require('MNPopups');
	//视图切换
	initViewChange();
	//过滤条件按钮事件
	$('.list-tab').on('tap',function(){
		if($(this).attr('disabled')){
			return;
		}
		if($(this).attr('field')=='type'){
			initTypePopup();
		}
		else if($(this).attr('field')=='status'){
			initStatusPopup();
		}else{
			if($(this).attr('val')=='false'){
				$(this).find('em').show();
				$(this).attr('val','true');
			}else{
				$(this).find('em').hide();
				$(this).attr('val','false');
			}
			fnReloadData($(this).attr('field'),$(this).attr('val'));
		}
	});
	if(pageParam.bizType!=null){
		$(".list-tab[field='type']").attr('disabled',true);
		$(".list-tab[field='type']").attr('val',pageParam.bizType);
		if(pageParam.bizType==3){
			$(".list-tab[field='type']").find('h5').html('路政视频');
		}
		if(pageParam.bizType==2){
			$(".list-tab[field='type']").find('h5').html('收费视频');
		}
	}
	
	
	//打开iframe
	api.openFrame({
        name: 'GIS_zone_video_body',
        url: './GIS_zone_video_body.html',
        rect: {
	        x:0,
	        y:headerHeight+42,
	        w:'auto',
	        h:'auto'
        },
        bounces: true,
        vScrollBarEnabled:true,
        pageParam:{
        	plano:pageParam.plano,
        	bizType:pageParam.bizType
        }
    });
    
    api.addEventListener({
	    name:'viewappear'
	}, function(ret, err){        
	   	$('#my-search').blur();
	   	api.setStatusBarStyle({
			style : 'dark'
		});
	});
	api.addEventListener({
	    name:'viewdisappear'
	}, function(ret, err){        
	   	api.setStatusBarStyle({
			style : 'light'
		});
	});
	//加载摄像机区域tab
	fnGetAreaNameList(pageParam.plano);
};


function fnGetAreaNameList(plano){
	var reportUrl = $api.getStorage("report_url");
	api.ajax({
		url : reportUrl + '/gims/gis-new/queryVidiconAreaName',
		data:{
			values:{plano:plano}
		},
		timeout:10,
	}, function(ret, err) {
		if(ret&&ret.errcode==0&&ret.data.length>0){
			titleArr = new Array();
			$.each(ret.data,function(i,areaname){
				titleArr.push({title:areaname,bg:'#FFFFFF'});
			});
			titleArr = titleArr.Myunique();
			initNavBar(titleArr);
		}
	});
}
function initNavBar(items){
	if(NVNavigationBar==null){
		NVNavigationBar = api.require('NVNavigationBar');
		NVNavigationBar.open({
		    rect: {
		         x: 0,
		         y: headerHeight,
		         w: api.frameWidth,
		         h: 42
		    },
		   	styles: {
		         orientation: 'horizontal',
		         bg: '#fff',
		         bgAlpha: 0.8,
		         font: {
		         size: 16,
		         sizeSelected: 16,
		         color: '#000',
		         colorSelected: '#06f',
		         alpha: 1
		         },
		         itemSize: {
		             w: 85,
		             h: 44
		         }
		   	},
	    	items: items,
	       	fixedOn: api.frameName,
	       	selectedIndex: -1,
	       	id: 'mytab'
		}, function(ret, err) {
			if(ret.eventType=='click'){
				var selIndex = ret.index;
				api.execScript({
	                frameName:'GIS_zone_video_body',
	                script: 'fnSetParam(\'title\',\''+titleArr[ret.index].title+'\');'
                });
		    }
		});
	}else{
		NVNavigationBar.update({
			id:'mytab',
			items:items
		});
	}
}

/**
 * 视图切换 
 */
function initViewChange(){
	var addbtn = $api.byId('top_other_btn');
 	addbtn.onclick = function() {
 		var listType = "list";
 		if($(this).find('em').hasClass('icon-list')){
 			$(this).find('em').removeClass('icon-list');
 			$(this).find('em').addClass('icon-list1');
 		}else{
 			$(this).find('em').removeClass('icon-list1');
 			$(this).find('em').addClass('icon-list');
 			listType = "card";
 		}
 		api.execScript({
			frameName:'GIS_zone_video_body',
	        script: 'fnSetListView(\''+listType+'\');'
        });
    };
	api.parseTapmode();
}

function initTypePopup(){
	initMyPopup('type');
	myPopupDatas = new Array();
	myPopupDatas.push({value:'',title:'全部类型'});
	myPopupDatas.push({value:'1',title:'交通视频'});
	myPopupDatas.push({value:'2',title:'收费视频'});
	myPopupDatas.push({value:'3',title:'路政视频'});
	myPopupDatas.push({value:'4',title:'安防视频'});
	myPopup.reloadData({
	    datas: myPopupDatas
	});
	myPopup.show();
}

function initStatusPopup(){
	initMyPopup('status');
	myPopupDatas = new Array();
	myPopupDatas.push({value:'',title:'全部状态'});
	myPopupDatas.push({value:'1',title:'在线'});
	myPopupDatas.push({value:'0',title:'离线'});
	myPopup.reloadData({
	    datas: myPopupDatas
	});
	myPopup.show();
}

/**
 * 初始化弹窗 
 */
function initMyPopup(field){		
	myPopup.open({
	    rect: {
	        w: api.frameWidth,
	        h: 180
	    },
	    position: {
	        x: 0,
	        y: headerHeight
	    },
	    styles: {
	        mask: 'rgba(0,0,0,0.2)',
	        bg: '#eee',
	        cell: {
	            bg: {
	                normal: '',
	                highlight: ''
	            },
	            h: 45,
	            title: {
	                marginL: 30,
	                color: '#636363',
	                size: 14,
	            },
	            separateLine: {
		            hideLastSeparateLine: true //(可选项)布尔类型；是否隐藏最后一条分割线，默认false                    
		        }
	        },
	        pointer: {
	            size: 7,
	            xPercent: field=='type'?15:40,
	            yPercent: 0,
	            orientation: 'downward'
	        }
	    },
	    datas: [{
	        title: '添加朋友'
	    }],
	    animation: false
	}, function(ret) {
	    if (ret.eventType=='click') {	    		
    		$(".list-tab[field='"+field+"']").find('h5').html(myPopupDatas[ret.index].title);
	    	$(".list-tab[field='"+field+"']").attr('val',myPopupDatas[ret.index].value);
	    	fnReloadData(field,myPopupDatas[ret.index].value);
	    }
	});
}

function fnReloadData(field,val){
	api.execScript({
		frameName:'GIS_zone_video_body',
        script: 'fnSetParam(\''+field+'\',\''+val+'\');'
    });
}

function fnSearchInfo(){
	api.openWin({
        name: 'GIS_zone_video_search',
        url: './GIS_zone_video_search.html',
        bounces : false,
		animation:{
			type:'movein'
		}
    });
}

function fnSearch(val){
	$('#my-search').val(val);
	api.execScript({
		frameName:'GIS_zone_video_body',
        script: 'fnSearch(\''+val+'\');'
    });
}

//数组去重复
Array.prototype.Myunique = function(){
 	var res = [];
 	var title = null;
 	for(var i = 0; i < this.length; i++){
  		if(title==null||this[i].title!=title){
	   		res.push(this[i]);
	   		title = this[i].title;
  		}
 	}
 	return res;
}