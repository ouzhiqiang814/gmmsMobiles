var weekjson = {
	'1' : {
		title : '厦门大桥',
		subtitle:'全长6599米',
		domid : 'linexiamen_w',
		max : 50000,
		seriesarray : [[], []],
		chart:null
	},
	'2' : {
		title : '海沧大桥',
		subtitle:'全长5927米',
		domid : 'linehaicang_w',
		max : 108000,
		seriesarray : [[], []],
		chart:null
	},
	'3' : {
		title : '集美大桥',
		subtitle:'全长9057米',
		domid : 'linejimei_w',
		max : 100000,
		seriesarray : [[], []],
		chart:null
	},
	'4' : {
		title : '杏林大桥',
		subtitle:'全长4151米',
		domid : 'linexinglin_w',
		max : 116000,
		seriesarray : [[], []],
		chart:null
	},
	'5' : {
		title : '翔安隧道',
		subtitle:'全长8695米',
		domid : 'linexiangan_w',
		max : 104000,
		seriesarray : [[], []],
		chart:null
	}
};
var dayjson = {
	'1' : {
		title : '厦门大桥',
		subtitle:'全长6599米',
		domid : 'linexiamen_d',
		max : 2082,
		seriesarray : [[], []],
		chart:null
	},
	'2' : {
		title : '海沧大桥',
		subtitle:'全长5927米',
		domid : 'linehaicang_d',
		max : 4500,
		seriesarray : [[], []],
		chart:null
	},
	'3': {
		title : '集美大桥',
		subtitle:'全长9057米',
		domid : 'linejimei_d',
		max : 4166,
		seriesarray : [[], []],
		chart:null
	},
	'4' : {
		title : '杏林大桥',
		subtitle:'全长4151米',
		domid : 'linexinglin_d',
		max : 4832,
		seriesarray : [[], []],
		chart:null
	},
	'5' : {
		title : '翔安隧道',
		subtitle:'全长8695米',
		domid : 'linexiangan_d',
		max : 4332,
		seriesarray : [[], []],
		chart:null
	}
};
apiready = function() {
	$('#day div').height($('#day div').width()*400/720);
	fnQueryData('day');
}

$(function(){
	$('#day div').height($('#day div').width()*400/720);
});

var hasweek = false;
function fnChange(type){
	if(type=='week'){
		$('#day').hide();
		$('#week').show();
		$('#week div').height($('#week div').width()*400/720);
		if(!hasweek){
			fnQueryData('week');
		}
	}else{
		$('#week').hide();
		$('#day').show();
		$('#day div').height($('#day div').width()*400/720);
	}
}

function refresh(type){
	fnQueryData(type);
}

function fnQueryData(type){
	var url = $api.getStorage("gmms_url");
	var counttype = 1;
	if(type=='week'){
		counttype = 2;
	}
	var weekstr = '';
	api.showProgress({
        title: '请稍后',
        text: '正在获取数据...',
        modal: false
    });
	api.ajax({
	    url:url+'/modules/mobile/report/colligate-manager!passCountInfo.action',
	    method:'get',
	    timeout:10,
	    data: {
            values: {countType:counttype}
        }
    },function(ret,err){
    	api.hideProgress();
    	if(ret){
    		if(type=='day'){
    			$.each(ret,function(i,data){
    				$.each(data.CountInfo,function(j,info){
    					dayjson[data.RoadId].seriesarray[0][info.TimeX] = info.InPassCount==''?0:Number(info.InPassCount);
    					dayjson[data.RoadId].seriesarray[1][info.TimeX] = info.OutPassCount==''?0:Number(info.OutPassCount);
    				});
    				var chartOption = {
    					title: {
				            text: dayjson[data.RoadId].title,
				            subtext:dayjson[data.RoadId].subtitle,
				        	textStyle:{
				        		color:'#fff',
				        		fontSize:'14'
				        	},
				        	subtextStyle:{
				        		color:'#fff'
				        	}
				        },
				        legend: {
					        data:['进岛', '出岛'],
					        right:'10',
					        textStyle:{
					        	color:'#fff'
					        }
					    },
    					grid: {
							right:'3%',
							left:'3%',
							bottom:'13%',
					        backgroundColor: 'rgba(0,0,0,0)',
					        borderWidth: 0,
					        borderColor: 'none'
    					},
						xAxis:  {
					        type: 'category',
					        axisLine: {
				                lineStyle: {
				                    color: '#fff'
				                }
				            },
					        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
					    },
					    yAxis:{
							type: 'value',
							show: false
						},
						color: ['#fefeff','#ffa500'],
						calculable: true,
						series:[{
							name:'进岛', 
							type:'line',
							smooth: true,
							data: dayjson[data.RoadId].seriesarray[0],
							markLine: {
								animation:false,
								label:{
									normal:{
										position:'middle',
										formatter:'{c}车次'
									}
								},
				                data: [{
				                    yAxis: dayjson[data.RoadId].max
				                }, {
				                    yAxis: dayjson[data.RoadId].max/2
				                }]
				            }
						},{ 
							name:'出岛', 
							type:'line', 
							smooth: true,
							data: dayjson[data.RoadId].seriesarray[1]
						}]
    				};
    				if(dayjson[data.RoadId].chart==null){
    					dayjson[data.RoadId].chart = echarts.init(document.getElementById(dayjson[data.RoadId].domid));
    				}
    				dayjson[data.RoadId].chart.setOption(chartOption);
    			});
    		}else{
    			$.each(ret,function(i,data){
    				$.each(data.CountInfo,function(j,info){
    					weekjson[data.RoadId].seriesarray[0][j] = info.InPassCount==''?0:Number(info.InPassCount);
    					weekjson[data.RoadId].seriesarray[1][j] = info.OutPassCount==''?0:Number(info.OutPassCount);
    					if (weekstr=='') {
							weekstr = checkweek(info.TimeX);
						}
    				});
					var chartOption = {
						title: {
				            text: weekjson[data.RoadId].title,
				            subtext:weekjson[data.RoadId].subtitle,
				        	textStyle:{
				        		color:'#fff',
				        		fontSize:'14'
				        	},
				        	subtextStyle:{
				        		color:'#fff'
				        	}
				        },
				        legend: {
					        data:['进岛', '出岛'],
					        right:'10',
					        textStyle:{
					        	color:'#fff'
					        }
					    },
    					grid: {
							right:'3%',
							left:'3%',
							bottom:'13%',
					        backgroundColor: 'rgba(0,0,0,0)',
					        borderWidth: 0,
					        borderColor: 'none'
    					},
						xAxis:  {
					        data : [0, 1, 2, 3, 4, 5, 6],
							axisLabel : {
								formatter : function(value) {
									return '周' + weekstr.charAt(value);
								},
								textStyle : {
									color : '#fff',
								}
							},
							axisLine: {
				                lineStyle: {
				                    color: '#fff'
				                }
				            }
					    },
					    yAxis:{
							type: 'value',
							show: false
						},
						color: ['#fefeff','#ffa500'],
						calculable: true,
						series:[{
							name:'进岛', 
							type:'line',
							smooth: true,
							data: weekjson[data.RoadId].seriesarray[0],
							markLine: {
								animation:false,
								label:{
									normal:{
										position:'middle',
										formatter:'{c}车次'
									}
								},
				                data: [{
				                    yAxis: weekjson[data.RoadId].max
				                }, {
				                    yAxis: weekjson[data.RoadId].max/2
				                }, {
				                    yAxis: weekjson[data.RoadId].max/4
				                }]
				            }
						},{ 
							name:'出岛', 
							type:'line', 
							smooth: true,
							data: weekjson[data.RoadId].seriesarray[1]
						}]
					};
	    			if(weekjson[data.RoadId].chart==null){
						weekjson[data.RoadId].chart = echarts.init(document.getElementById(weekjson[data.RoadId].domid));
					}
					weekjson[data.RoadId].chart.setOption(chartOption);
    			});
    			hasweek = true;
    		}
    	}else{
    		api.toast({
	            msg:err.msg
            });
    	}
    });
}

function checkweek(key) {
	var weekjson = {
		1 : '日一二三四五六',
		2 : '一二三四五六日',
		3 : '二三四五六日一',
		4 : '三四五六日一二',
		5 : '四五六日一二三',
		6 : '五六日一二三四',
		7 : '六日一二三四五'
	}
	return weekjson[key];
}
