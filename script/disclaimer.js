apiready = function() {
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		//operation
		api.closeWidget({
		});
	});
};

// 接受条款， 登陆键为蓝色
function Monit() {
	if ($api.byId('check').checked) {
		$api.addCls($api.byId('next'), 'activenext');
	} else {
		$api.removeCls($api.byId('next'), 'activenext');
	}
}

//打开登录页面
function next() {
	if ($api.byId('check').checked) {
		$api.setStorage("nextstep", 1);
		api.openWin({
			name : 'login',
			url : '../html/login.html',
			rect : {
				x : 0,
				y : 0,
				w : 'auto',
				h : 'auto',
				marginLeft : 0, //相对父 window 左外边距的距离
				marginTop : 0, //相对父 window 上外边距的距离
				marginBottom : 0, //相对父 window 下外边距的距离
				marginRight : 0 //相对父 window 右外边距的距离
			},
			bounces : false,
			bgColor : 'rgba(0,0,0,0)',
			vScrollBarEnabled : true,
			hScrollBarEnabled : true,
			slidBackEnabled : false
		});
	};
}