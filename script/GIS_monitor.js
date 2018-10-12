apiready = function() {
	var header = $api.byId('my-header');
    if (header) {
        $api.fixStatusBar(header);
        headerHeight = $api.offset(header).h;
    }
	fnMyReadyKeyback();
//	initLikeChange();
	var pageParam = api.pageParam;
	pageParam.headerHeight = headerHeight;
	api.openFrame({
		name : 'GIS_img_con',
		url : './GIS_img_con.html',
		rect : {
			x : 0,
			y : headerHeight,
			w : 'auto',
			h : 'auto'
		},
		pageParam : pageParam,
		bounces : false,
		vScrollBarEnabled : false
	});
}

function fnMyReadyKeyback() {
    var keybacks = $api.domAll('.event-back');
    for (var i = 0; i < keybacks.length; i++) {
        $api.attr(keybacks[i], 'tapmode', 'highlight');
        keybacks[i].onclick = function() {
            closeWin();
            api.setScreenOrientation({
			    orientation: 'portrait_up'
			});
        };
    }
	if(api.systemType!='ios'){
	    api.addEventListener({
	        name:'keyback'
        },function(ret,err){
    	 	closeWin();
    	 	api.setScreenOrientation({
			    orientation: 'portrait_up'
			});
        });
    }
    api.parseTapmode();
};
function initLikeChange(){
	var vidiconid = api.pageParam.data.vidiconid;
	var likeArr = $api.getStorage('LIKE_DATA');
	if(likeArr!=undefined&&likeArr!=null){
		$.each(likeArr,function(i,like){
			if(like == vidiconid){
				$('#top_other_btn').find('a').removeClass('mui-icon-extra-heart');
				$('#top_other_btn').find('a').addClass('mui-icon-extra-heart-filled');
				return;
			}
		});
	}
	var addbtn = $api.byId('top_other_btn');
 	addbtn.onclick = function() {
 		var likeArr = $api.getStorage('LIKE_DATA');
		var islike = $(this).find('a').hasClass('mui-icon-extra-heart');
		if(islike){
			if(likeArr==undefined||likeArr==null){
				likeArr = new Array();
			}
			likeArr.push(vidiconid);
			$(this).find('a').removeClass('mui-icon-extra-heart');
			$(this).find('a').addClass('mui-icon-extra-heart-filled');
			api.toast({
	            msg:'已收藏'
            });
		}
		if(!islike){
			if(likeArr!=undefined&&likeArr!=null){
				var newArr = [];
				$.each(likeArr,function(i,like){
					if(like != vidiconid){
						newArr.push(like);
					}
				});
				likeArr = newArr;
			}
			$(this).find('a').removeClass('mui-icon-extra-heart-filled');
			$(this).find('a').addClass('mui-icon-extra-heart');
			api.toast({
	            msg:'已取消收藏'
            });
		}
		$api.setStorage('LIKE_DATA',likeArr);
    };
	api.parseTapmode();
}

function closeWin() {
	api.execScript({
		frameName:'GIS_img_con',
        script: 'videoDestroy();'
    });
    api.closeWin();
}

