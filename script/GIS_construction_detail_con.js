apiready = function() {
	showmessage() ;
}
function showmessage() {
	var plano = {'0005':'翔安隧道','0001':'厦门大桥','0002':'海沧大桥','0003':'集美大桥','0004':'杏林大桥'};
    data = api.pageParam['data'];
    if(plano[data.plano]) {
		$api.text($api.byId('plano'), plano[data.plano]);
    } else {
    	$api.text($api.byId('plano'), data.plano);
    }
	$api.text($api.byId('worktype'), data.worktype);
	$api.text($api.byId('direction'), data.direction);
	$api.text($api.byId('workstatus'), data.workstatus);
	$api.text($api.byId('workplace'), data.workplace);
	$api.text($api.byId('startdate'), data.startdate+'~');
	$api.text($api.byId('enddate'), data.enddate);
	$api.text($api.byId('workroad'), data.workroad);
	$api.text($api.byId('workdesc'), data.workdesc);
	$api.text($api.byId('promanager'), data.promanager);
	$api.text($api.byId('prophone'), data.prophone);
	$api.text($api.byId('workmanager'), data.workmanager);
	$api.text($api.byId('workphone'), data.workphone);
}