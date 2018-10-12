function fnReady() {
    fnReadyKeyback();
    fnReadyOpenWin();
    fnReadyHeader();
};

function getHeaderHeight() {
    var header = $api.byId('header');
    $api.fixStatusBar(header);
    headerHeight = $api.offset(header).h;
    return headerHeight;
}

function fnReadyKeyback() {
    var keybacks = $api.domAll('.event-back');
    for (var i = 0; i < keybacks.length; i++) {
        $api.attr(keybacks[i], 'tapmode', 'highlight');
        keybacks[i].onclick = function() {
            api.closeWin();
        };
    }
	if(api.systemType!='ios'){
	    api.addEventListener({
	        name:'keyback'
        },function(ret,err){
    	 	api.closeWin();
        });
    }
    api.parseTapmode();
};

function fnReadyKeyback(frameName,closeID){
	var keybacks = $api.domAll('.event-back');
    for (var i = 0; i < keybacks.length; i++) {
        $api.attr(keybacks[i], 'tapmode', 'highlight');
        keybacks[i].onclick = function() {
            api.historyBack({
			    frameName: frameName
			}, function(ret, err) {
			    if (!ret.status) {
			        api.closeWin();
			    }else{
			    	if(closeID!=null){
			    		$('#'+closeID).show();
			    	}
			    }
			});
        };
    };
    if(api.systemType!='ios'){
	    api.addEventListener({
	        name:'keyback'
        },function(ret,err){
    	 	api.historyBack({
			    frameName: frameName
			}, function(rett, errr) {
			    if (!rett.status) {
			        api.closeWin();
			    }else{
			    	if(closeID!=null){
			    		$('#'+closeID).show();
			    	}
			    }
			});
        });
    }
    if(closeID!=null){
    	$api.dom('#'+closeID).onclick = function(){
    		api.closeWin();
    	}
    }

    api.parseTapmode();
	
}

function fnReadyOpenWin() {
    var buttons = $api.domAll('.open-win');
    for (var i = 0; i < buttons.length; i++) {
        $api.attr(buttons[i], 'tapmode', 'highlight');
        buttons[i].onclick = function() {
            var target = $api.closest(event.target, '.open-win');
            var winName = $api.attr(target, 'win'),
                isNeedLogin = $api.attr(target, 'register_mobile'),
                param = $api.attr(target, 'param');

            if (isNeedLogin && !$api.getStorage('loginInfo')) {
                winName = 'register_mobile';
            }

            if (param) {
                param = JSON.parse(param);
            }

            api.openWin({
                name: winName,
                url: './' + winName + '.html',
                pageParam: param
            });
        };
    }
    api.parseTapmode();
};

var header, headerHeight = 0;

function fnReadyHeader() {
    header = $api.byId('header');
    if (header) {
        $api.fixStatusBar(header);
        headerHeight = $api.offset(header).h;
    }
};

function fnReadyFrame() {
    var frameName = api.winName + '_body';
    api.openFrame({
        name: frameName,
        url: './' + frameName + '.html',
        bounces: true,
        rect: {
            x: 0,
            y: headerHeight,
            w: 'auto',
            h: 'auto'
        },
        vScrollBarEnabled: false
    });
};

function fnReadyHeader2() {
    header = $api.byId('header');
    if (header) {
        $api.fixStatusBar(header);
        headerHeight = $api.offset(header).h;
    }
};