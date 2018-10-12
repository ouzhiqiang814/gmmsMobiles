function tranTime(timeStr) {
	var curTime = new Date();
	var time = new Date(Date.parse(timeStr.replace(/-/g, "/"))); 
	var timeAgo = (curTime.getTime() - time.getTime()) / 1000;
	var str;

	if (timeAgo < 60) {
		str = '刚刚';
	} else if (timeAgo < 60 * 60) {
		min = parseInt(timeAgo/60);
		str = min + '分钟前';
	} else if (timeAgo < 60 * 60 * 24) {
		h = parseInt(timeAgo/(60*60));
		str = h + '小时前 ';
	} else if (timeAgo < 60 * 60 * 24 * 2) {    
		str = '昨天';
	} else if (timeAgo < 60 * 60 * 24 * 3) {
		str = '前天';
	} else if (timeAgo < 60 * 60 * 24 * 7) {
		str = showDay(time);
	} else if (timeAgo < 60 * 60 * 24 * 365){
		str = (time.getMonth() + 1) + "/" + time.getDate();
	} else
		str = time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate();
	return str;
}

function showDay(time){
	var show_day = new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
	return show_day[time.getDay()];
}
