apiready = function() {
	fnLoadNotice();
	$('.main-context').css('min-height',api.frameHeight*2/3);
};

function openNewWindow(type) {
	api.openWin({
		name : type,
		url : './' + type + '.html',
		delay : 200,
		bounces : false
	});
}     

function fnLoadNotice(){
	api.ajax({
	    url:$api.getStorage("gmms_url")+'modules/security/notice!queryNotice.action',
	    method:'post',
	    timeout:10,
	    data:{
	    	values:{userId:$api.getStorage("userId"),listNum:3}
	    }	    
    },function(ret,err){
    	if(ret){
    		var htmlStr = '';
    		if(ret.length>0){
	    		$.each(ret,function(i,notice){
	    			var readSpan = '';
	    			if(notice.readed==0)
	    				readSpan = ' <span class="read_span"></span>';
	    			htmlStr += '<div class="information" onclick="fnShowNotice(this,'+notice.id+')">'+
								'	<input type="hidden" name="content" value="'+notice.content+'"/>'+
								'	<div class="content">'+
										notice.name+readSpan+
								'	</div>'+
								'	<div class="time">'+
										notice.createTime+
								'	</div>'+
								'</div>';
	    		});
    		}else{
    			htmlStr = '<div style="color: #CCCCCC;font-size: 14px;text-align:center;width:100%;padding-top:10px;">暂无数据</div>';
    		}
			$('#my_notice_list').html(htmlStr);
    	}else{
    		api.toast({
	            msg:err.msg,
	            duration:2000,
	            location:'bottom'
            });
    	}
    });
}

/**
 * 查看详细公告 
 */
function fnShowNotice(_this,noticeId){
	var content = $(_this).find("input[name='content']").val();
	var name = $(_this).find("div[class='content']").html();
	var createTime = $(_this).find("div[class='time']").html();
	var gmms_url = $api.getStorage('gmms_url');
	var userId = $api.getStorage('userId');
	api.ajax({
	    url:gmms_url+'modules/security/notice!updateNoticeRead.action',
	    method:'post',
	    timeout:10,
	    data:{
	    	values:{userId:userId,noticeId:noticeId}
	    }
    },function(ret,err){
    	//coding...
    	if(ret){
    		$(_this).find("span[class='read_span']").remove();
    	}
    });
	api.openWin({
	    name: 'notice',
	    url: './notice.html',
	    bounces:false,
		pageParam: {"content":content,"name": name,"createTime":createTime}
    });
}
/**
 * 查看更多公告 
 */
function fnShowMoreNotice(){
	api.openWin({
	    name: 'notice_more',
	    url: './notice_more.html',
	    bounces:false
    });
}