	mui.init();
	var charts_url = null;
	charts_url = $api.getStorage("charts_url");
//	var charts_url_2 = null;
//	charts_url_2 = $api.getStorage("charts_url_2");	
	var percent = 0;
	apiready = function(){
		fnInitPull();
		getDatas();
	};
	
	//执行函数
	function getDatas(){
		getPersonnel();
		getTollCharge();
		getCenterCharge();
		
		getHighWaysTeam();
		getHighWaysCaptain();
		getHighWaysCenter();
		
		frontline();
		centerline();
		
		restQuester('/report/goods-pay/ajaxGoodsPayLine?isMobile=true',getPurchase);//采购汇总金额
		restQuester('/report/device/ajaxYearIOCountChart?isMobile=true',getWarehouse);//仓库汇总金额
		restQuester('/report/disease/ajaxDiseaseChart?isMobile=true',getJurisdictionArea_disease);//所辖区域养护-病害数据
		restQuester('/report/task/ajaxTaskExecuteChart?isMobile=true&isDetail=true',getJurisdictionArea_task);//所辖区域养护-任务数数据
		restQuester('/report/disease/ajaxManagerDiseaseChart?isMobile=true',getAllArea_disease);//所有区域养护-病害数据
		restQuester('/report/task/ajaxEachZoneTaskExecuteChart?isMobile=true&isDetail=true',getAllArea_task);//所有区域养护-任务数数据
		restQuester('/report/problem/ajaxQueryProblemRateCount?isMobile=true&isAdmin=0',getJurisdictionWeak);//所辖区域弱电故障处理情况
		restQuester('/report/problem/ajaxQueryProblemRateCount?isMobile=true&isAdmin=1',getAllWeak);//所有区域弱电故障处理
		restQuester('/report/account-list/ajaxAccountListCheckBar?isMobile=true',getProjectAcceptance);//零星工程验收
						
	}
	
	//数据下载通用函数
	function restQuester(url,callback){
		api.ajax({
			url : charts_url + url,
			method : 'get',
			timeout : 30
		},function(ret,err){
			if(ret){
				callback(ret);
				api.refreshHeaderLoadDone(); //刷新结束
			}
			else{
				api.toast({
					msg:"链接出现错误，暂时无法查询数据，请稍后重试！",
					duration:3000,
					location:'bottom'
				});
				callback();
				api.refreshHeaderLoadDone(); //刷新结束
			}
		});
	}
	
	// 刷新
	function fnInitPull() {
		api.setRefreshHeaderInfo({
		 	bgColor: '#efeff4',
	        dropColor:'#9BA2AC'
		},function(){ 
			getDatas();
		});
	};
	
	//打开新窗口
	function openNewWindow(type,space) {
		api.openWin({
			name : type,
			url : './'+space+'/Charts_' + type + '.html',
			delay : 200,
			bounces : false,
			animation:{
				type:'movein'
			}
		});
	}
	
	//加载人事数据
	function getPersonnel(){
		charts_url_2 = $api.getStorage("charts_url_2");
//		api.ajax({
//	        url:charts_url+'/report/device/ajaxYearIOCountChart?isMobile=true',
//	        method:'get',
//	        timeout:30
//      },function(ret,err){
//      	if(ret){
//      		$("#warehouse .mui-card-header p").html(ret.year+"年度");
//      		$("span[name=work_warehouseIn]").html(ret.inTotal+"万元");
//      		$("span[name=work_warehouseOut]").html(ret.outTotal+"万元");
//      	}
//      });
        		$("#personnel .mui-card-header p").html("2017-7-20");
        		$("span[name=work_personnel_all]").html("1,000 人");
        		$("span[name=work_personnel_leave]").html("10 人");		
	}		

	//加载通行费征收数据
	function getTollCharge(){
		var timeFeeData = {},yearFeeData = {};
		var charts_url_2 = "http://125.77.254.250:8180"
		//查询次费
		api.ajax({
	        url:charts_url_2+'/fee/single/monthly-levy/ajaxQueryFeeCountBar?isMobile=true&isAdmin=true',
	        method:'get',
	        timeout:30	        
        },function(ret,err){
        	if(ret){
        		var num = 0;
        		if(ret.yearGoal == 0 ){
        			num = 0;
        		}
        		else {
        			num = ret.monthFee / ret.yearGoal;
        		}
        		num = (num*100).toFixed(2);
        		timeFeeData = {};
        		timeFeeData = {
        			percent : num,
        			time : '截止'+ret.year+'年'+ret.month+'月',
        			goal : ret.yearGoal +'元',
        			fact : ret.monthFee +'元',
        			id : 'charge_echarts2_1'
        		}
        	}
        	else{
        		timeFeeData = {};
        		timeFeeData = {
        			percent : 0,
        			time : '',
        			goal : '0万元',
        			fact : '0万元',
        			id : 'charge_echarts2_1'
        		}
	    		api.toast({
		            msg:"链接出现错误，暂时无法查询数据，请稍后重试！",
		            duration:3000,
		            location:'bottom'
	            });	        		        		
        	}
        	$('#tollCharge p').html(timeFeeData.time);
			$("#toll_charge_fee_1 span").eq(1).html(timeFeeData.goal);
			$("#toll_charge_fee_2 span").eq(1).html(timeFeeData.fact);
        	echarts_1(timeFeeData) 
        });
        //查询年费
		api.ajax({
	        url:charts_url_2+'/fee/yearly/fee-income/ajaxQueryYearlyFeeCountBar?isMobile=true',
	        method:'get',
	        timeout:30	        
        },function(ret,err){
        	if(ret){
        		var num = 0;
        		if(ret.yearGoal == 0 ){
        			num = 0;
        		}
        		else {
        			num = ret.monthFee / ret.yearGoal;
        		}
        		num = (num*100).toFixed(2);
        		yearFeeData = {};
        		yearFeeData = {
        			percent : num,
        			time : '截止'+ret.year+'年'+ret.month+'月',
        			goal : ret.yearGoal +'万元',
        			fact : ret.monthFee +'万元',
        			id : 'charge_echarts2_2'
        		}
        	}
        	else{
        		yearFeeData = {};
        		yearFeeData = {
        			percent : 0,
        			time : '',
        			goal : '0万元',
        			fact : '0万元',
        			id : 'charge_echarts2_2'
        		}
	    		api.toast({
		            msg:"链接出现错误，暂时无法查询数据，请稍后重试！",
		            duration:3000,
		            location:'bottom'
	            });	        		        		
        	}
        	$('#tollCharge p').html(yearFeeData.time);
			$("#toll_charge_annual_fee_1 span").eq(1).html(yearFeeData.goal);
			$("#toll_charge_annual_fee_2 span").eq(1).html(yearFeeData.fact);
        	echarts_1(yearFeeData); 
        });        
	}

	//中心征费数据查询
	function getCenterCharge(){
		var charts_url = 'http://125.77.254.250:8180';
		var pieData = {};
		api.ajax({
	        url:charts_url_2 + '/fee/single/monthly-levy/ajaxQueryFeeCountBar?isMobile=true&isAdmin=false',
	        method : 'get',
	        timeout:30
        },function(ret,err){
        	if(ret){
        		var num = 0;
        		if(ret.yearGoal == 0){
        			num = 0;
        		}
        		else {
        			num = ret.monthFee / ret.yearGoal;
        		}
        		num = (num*100).toFixed(2);
        		pieData = {
        			percent : num,
        			id : 'charge_echarts1_1',
        			time : '截止' + ret.year + '年' + ret.month + '月',
        			place : ret.plaName,
        			goal : ret.yearGoal + '元',
        			fact : ret.monthFee + '元'
        		}
        	}
        	else {
        		pieData = {
        			percent : 0,
        			id : 'charge_echarts1_1',
        			time : '',
        			place : '',
        			goal : '0元',
        			fact : '0元'
        		}        	
        	}
        	$("#centerCharge p").html(pieData.time);
        	$("#centerCharge label[name=center_charge]").html(pieData.place);
        	$("#center_charge_1 .span1").html(pieData.goal);
        	$("#center_charge_2 .span1").html(pieData.fact);
        	echarts_1(pieData) 
        });
	}

	//一线员工绩效考核
	function frontline(){
		var charts_url = "http://172.16.53.225:9001";
		var data = {};
		api.ajax({
	        url:charts_url + '/fee/gmms/performance/ajaxQueryPerformanceTable/false/true/true',
	        method :'get',
        },function(ret,err){
        	if(ret){
        		data = {
        			time : ret.year+'年'+ret.month+'月 ',
        			performance_frontline_assessment : ret.resultList[0].name
        		}
        	}
        	else{
	    		api.toast({
		            msg:"链接出现错误，暂时无法查询数据，请稍后重试！",
		            duration:3000,
		            location:'bottom'
	            });
        		data = {
        			time : '',
        			performance_frontline_assessment : '暂无数据'
        		}	                    	
        	}
        	frontlineFun(data);
        }); 
	}

	function frontlineFun(data){	
		$('span[name=performance_frontline_assessment]').html(data.performance_frontline_assessment);
		$("#frontlineAssessment p").html(data.time)
	}

	//中心员工绩效考核
	function centerline(){
		var charts_url = "http://172.16.53.225:9001";
		var data = {};
		api.ajax({
	        url:charts_url + '/fee/gmms/performance/ajaxQueryPerformanceTable/true/true/true',
	        method :'get',
        },function(ret,err){
        	if(ret){
        		data = {
        			time : ret.year+'年'+ret.month+'月 ',
        			performance_center_assessment : ret.resultList[0].name
        		}
        	}
        	else{
	    		api.toast({
		            msg:"链接出现错误，暂时无法查询数据，请稍后重试！",
		            duration:3000,
		            location:'bottom'
	            });
        		data = {
        			time : '',
        			performance_center_assessment : '暂无数据'
        		}	                    	
        	}
        	centerFun(data);
        }); 
	}

	function centerFun(data){	
		$('span[name=performance_center_assessment]').html(data.performance_center_assessment);
		$("#centerAssessment p").html(data.time)
	}


	//路政-班组案件处理
	function getHighWaysTeam(){
		var charts_url = 'http://125.77.254.250:8180';
		var pieData = {};
		api.ajax({
	        url:charts_url + '/road/em-fileInfo/ajaxEmFileInfoPie/false/true/false',
	        method :'get',
        },function(ret,err){
        	if(ret){
        		pieData = {
        			time : ret.year + '年'+ ret.month + '月',
        			overData : ret.exceedCount,
        			wayData : ret.propertyCount,
        		}
        	}
        	else{
        		pieData = {
        			time : '',
        			overData : '',
        			wayData : '',
        		}
	    		api.toast({
		            msg:"链接出现错误，暂时无法查询数据，请稍后重试！",
		            duration:3000,
		            location:'bottom'
	            });        		        	
        	}
        	highWaysTeam(pieData);
        });
	}

	//路政-班组案件处理加载
	function highWaysTeam(data){
		var myChart = echarts.init(document.getElementById('highways_echarts1'));
		$("#highWaysTeam p").html('截止'+data.time);
		$("#high_ways_team_1").find('span').eq(1).html(data.overData+'起');
		$("#high_ways_team_2").find('span').eq(1).html(data.wayData+'起');
		
		option = {		
		    series: [
		        {
		            type:'pie',
		            radius: '80%',
		            avoidLabelOverlap: false,
		            animation:false,
		            label: {
		                normal: {
		                    show: false,
		                    position: 'center'
		                },
		                emphasis: {
		                    show: false,
		                    textStyle: {
		                        fontSize: '30',
		                        fontWeight: 'bold'
		                    }
		                }
		            },
		
		            data:[
		                {value:data.overData, name:'超限案件'},
		                {value:data.wayData, name:'路产案件'},
		
		            ]
		        }
		    ],
		    color:['#fb6e52','#48cfae']
		};
		myChart.setOption(option)
	}

	//路政-区域案件处理
	function getHighWaysCaptain(){
		var charts_url = 'http://125.77.254.250:8180';
		api.ajax({
	        url:charts_url + '/road/em-fileInfo/ajaxEmCloseRatePie/true/false',
	        method :'get',
        },function(ret,err){
			var handleData = {};
			var num = 0;
			if(ret){
				if(ret.totalCount == 0){
					num = 0;
				}
				else {
					num = ret.closeCount / ret.totalCount;
				}
				num = (num*100).toFixed(2);
				handleData = {
					percent : num,
					id : 'highways_echarts2',
					time : ret.year+'年'+ret.month+'月',
					find : ret.totalCount+'起',
					finished : ret.closeCount+'起',
					place : ret.planame,
					subtext : '结案率',
				};		
			}
        	else{
				handleData = {
					percent : 0,
					id : 'maintain_echarts1_1',
					time : '',
					find : '0起',
					finished : '0起',
					place : '',
					subtext : '结案率',
				};
	    		api.toast({
		            msg:"链接出现错误，暂时无法查询数据，请稍后重试！",
		            duration:3000,
		            location:'bottom'
	            });        		        	
        	}
			$("#highWaysCaptain p").html('截止'+handleData.time);
			$("#high_ways_captain_1").find('span').eq(1).html(handleData.find);
			$("#high_ways_captain_2").find('span').eq(1).html(handleData.finished);
			$("#high_ways_captain_2 label[name=high_team_captain]").html(handleData.place);        	
        	echarts_2(handleData) 
        });		
	}
	
	//路政-所有区域案件处理
	function getHighWaysCenter(){
		var charts_url = 'http://125.77.254.250:8180';
		api.ajax({
	        url:charts_url+'/road/em-fileInfo/ajaxEmFileInfoBar/true/false',
	        method:'get',
        },function(ret,err){
			var handleData = {};
			var num = 0;
			if(ret){
				if(ret.totalCount == 0){
					num = 0;
				}
				else {
					num = ret.closeCount / ret.totalCount;
				}
				num = (num*100).toFixed(2);
				handleData = {
					percent : num,
					id : 'highways_echarts3',
					time : ret.year+'年'+ret.month+'月',
					find : ret.totalCount+'起',
					finished : ret.closeCount+'起'
				};		
			}
			else{
				handleData = {
					percent : 0,
					id : 'highways_echarts3',
					time : '',
					find : '0起',
					finished : '0起'
				};		
			}
			$("#highWaysCenter p").html('截止'+handleData.time);
			$("#high_ways_center_1").find('span').eq(1).html(handleData.find);
			$("#high_ways_center_2").find('span').eq(1).html(handleData.finished);							
			echarts_1(handleData) 
        });		
	}


	//加载采购数据
	function getPurchase(data){
		if(data){
			$("#purchase .mui-card-header p").html(data.year+"年度");
			$("#purchase .mui-card-content span").html(data.totalPrice+"万元");		
		}
		else{
	        $("#purchase .mui-card-header p").html("");
	        $("#purchase .mui-card-content span").html("0万元");		
		}
	}
	
	
	//加载仓库数据
	function getWarehouse(data){
		if(data){
			$("#warehouse .mui-card-header p").html(data.year+"年度");
			$("span[name=work_warehouseIn]").html(data.inTotal+"万元");
			$("span[name=work_warehouseOut]").html(data.outTotal+"万元");			
		}
		else{
	        $("#warehouse .mui-card-header p").html("");
	        $("span[name=work_warehouseIn]").html("0 万元");
	        $("span[name=work_warehouseOut]").html("0 万元"); 		
		}
	}
	
	//加载所辖区域养护-病害数据
	function getJurisdictionArea_disease(data){
		var handleData = {};
		var num = 0;
		if(data){
			if(data.totalNum == 0){
				num = 0;
			}
			else {
				num = data.dealNum / data.totalNum;
			}
			num = (num*100).toFixed(2);
			handleData = {
				percent : num,
				id : 'maintain_echarts1_1',
				time : data.year+'年'+data.month+'月',
				find : data.totalNum+'起',
				finished : data.dealNum+'起'
			};		
		}
		else{
			handleData = {
				percent : 0,
				id : 'maintain_echarts1_1',
				time : '',
				find : '0起',
				finished : '0起'
			};		
		}
		$("span[name=jurisdiction_area_handle]").html(handleData.time);
		$("#jurisdiction_area_handle_1").find('span').eq(1).html(handleData.find);
		$("#jurisdiction_area_handle_2").find('span').eq(1).html(handleData.finished);							
		echarts_1(handleData)  	
	}
	
	//加载所辖区域养护-任务数数据
	function getJurisdictionArea_task(data){
		var finishData = {};
		var num = 0;
		if(data){
			if(data.finishedCount == 0){
				num = 0;
			}
			else{
				num = data.inTimeCount / data.finishedCount;
			}
			num = (num*100).toFixed(2);
			finishData = {
				percent : num,
				id : 'maintain_echarts1_2',
				time : data.year+'年',
				find : data.total+'起',
				finished : data.finishedCount+'起'
			};	
		}
		else{
			finishData = {
				percent : 0,
				id : 'maintain_echarts1_2',
				time : '',
				find : '0起',
				finished : '0起'
			};		
		}
		$("span[name=jurisdiction_area_finish]").html(finishData.time);
		$("#jurisdiction_area_finish_1").find('span').eq(1).html(finishData.find);
		$("#jurisdiction_area_finish_2").find('span').eq(1).html(finishData.finished);
		echarts_1(finishData)  	
	}
	
	//加载全部区域养护-病害数据
	function getAllArea_disease(data){
		var handleData = {};
		var num = 0;
		if(data){
			if(data.total == 0){
				num = 0;
			}
			else{
				num = data.dealTotal / data.total;
			}         		
			num = (num*100).toFixed(2);
			handleData = {
				percent : num,
				id : 'maintain_echarts2_1',
				time : data.year+'年'+data.month+'月',
				find : data.total+'起',
				finished : data.dealTotal+'起'
			};			
		}
		else{
			handleData = {
				percent : 0,
				id : 'maintain_echarts2_1',
				time : '',
				find : '0起',
				finished : '0起'
			};		
		}
		$("span[name=all_area_handle]").html(handleData.time);
		$("#all_area_handle_1").find('span').eq(1).html(handleData.find);
		$("#all_area_handle_2").find('span').eq(1).html(handleData.finished);							
		echarts_1(handleData)  	
	}
	
	//加载全部区域养护-任务数数据
	function getAllArea_task(data){
		var finishData = {};
		var num = 0;
		if(data){
			if(data.finishedCount == 0){
				num = 0;
			}
			else{
				num = data.inTimeCount / data.finishedCount;
			}
			num = (num*100).toFixed(2);
			finishData = {
				percent : num,
				id : 'maintain_echarts2_2',
				time : data.year+'年',
				find : data.total+'起',
				finished : data.finishedCount+'起'
			};			
		}
		else{
			finishData = {
				percent : 0,
				id : 'maintain_echarts2_2',
				time : '',
				find : '0起',
				finished : '0起'
			};		
		}
		$("span[name=all_area_finish]").html(finishData.time);
		$("#all_area_finish_1").find('span').eq(1).html(finishData.find);
		$("#all_area_finish_2").find('span').eq(1).html(finishData.finished);
		echarts_1(finishData)  	
	}
	
	//所辖区域弱电故障处理
	function getJurisdictionWeak(data){
		var faultData = {},respondData = {},handleData = {};
		var num1 = 0,num2 = 0,num3 = 0;
		if(data){
			if((data.dealedCount + data.unDealedCount) == 0){
				num1 = 0;
			}
			else{
				num1 = data.dealedCount / (data.dealedCount + data.unDealedCount);
			}
			num1 = (num1*100).toFixed(2);     		
			faultData = {
				percent : num1,
				id : 'maintain_echarts3_1',
				time : data.year+'年'+data.month+'月',
				place : data.zoneName,
				subtext : ''
			};
			if((data.responseCount + data.unResponseCount) == 0){
				num2 = 0;
			}
			else{
				num2 = data.responseCount / (data.responseCount + data.unResponseCount);
			}
			num2 = (num2*100).toFixed(2);       		
			respondData = {
				percent : num2,
				id : 'maintain_echarts3_2',
				time : data.year + '年' + data.month + '月',
				place : data.zoneName,
				subtext : ''
			}; 
			if((data.disposalCount + data.unDisposalCount) == 0){
				num3 = 0;
			}
			else{
				num3 = data.disposalCount / (data.disposalCount + data.unDisposalCount);
			}
			num3 = (num3*100).toFixed(2);       		
			handleData = {
				percent : num3,
				id : 'maintain_echarts3_3',
				time : data.year+'年'+data.month+'月',
				place : data.zoneName,
				subtext : ''
			};			
		}
		else{
			faultData = {
				percent : 0,
				id : 'maintain_echarts3_1',
				time : '',
				place : '',
				subtext : ''
			}; 
			respondData = {
				percent : 0,
				id : 'maintain_echarts3_2',
				time : '',
				place : '',
				subtext : ''
			};
			handleData = {
				percent : 0,
				id : 'maintain_echarts3_3',
				time : '',
				place : '',
				subtext : ''
			};		
		}
		echarts_2(faultData);
		echarts_2(respondData);
		echarts_2(handleData);        	
		$("#jurisdictionWeak p").html(faultData.time);
		$("#jurisdictionWeak label").html(faultData.place); 	
	}
	
	//所有区域弱电故障处理情况
	function getAllWeak(data){
		var faultData = {},respondData = {},handleData = {};
		var num1 = 0,num2 = 0,num3 = 0;
		if(data){
			if((data.dealedCount + data.unDealedCount) == 0){
				num1 = 0;
			}
			else{
				num1 = data.dealedCount / (data.dealedCount + data.unDealedCount);
			}
			num1 = (num1*100).toFixed(2);       		
			faultData = {
				percent : num1,
				id : 'maintain_echarts4_1',
				time : data.year+'年'+data.month+'月',
				subtext : ''
			};
			if((data.responseCount + data.unResponseCount) == 0){
				num2 = 0;
			}
			else{
				num2 = data.responseCount / (data.responseCount + data.unResponseCount);
			}
			num2 = (num2*100).toFixed(2);       		
			respondData = {
				percent : num2,
				id : 'maintain_echarts4_2',
				time : data.year+'年'+data.month+'月',
				subtext : ''
			};
			if((data.disposalCount + data.unDisposalCount) == 0){
				num3 = 0;
			}
			else{
				num3 = data.disposalCount / (data.disposalCount + data.unDisposalCount);
			}
			num3 = (num3*100).toFixed(2);       		
			handleData = {
				percent : num3,
				id : 'maintain_echarts4_3',
				time : data.year+'年'+data.month+'月',
				subtext : ''
			};			
		}
		else{
			faultData = {
				percent : 0,
				id : 'maintain_echarts4_1',
				time : '',
				subtext : ''
			};				
			respondData = {
				percent : 0,
				id : 'maintain_echarts4_2',
				time : '',
				subtext : ''
			};				
			handleData = {
				percent : 0,
				id : 'maintain_echarts4_3',
				time : '',
				subtext : ''
			};		
		}
		echarts_2(faultData);
		echarts_2(respondData);
		echarts_2(handleData);  
		$("#allWeak p").html(faultData.time);  	
	}
	
	//零星工程验收
	function getProjectAcceptance(data){
		var handleData = {};
		var num = 0;
		if(data){
			if(data.taskCount == 0){
				num = 0;
			}
			else{
				num = data.checkCount / data.taskCount;
			}       		
			num = (num*100).toFixed(2);		 		
			handleData = {
				percent : num,
				id : 'maintain_echarts5_1',
				time : data.year+'年'+data.month+'月',
				find : data.taskCount+' 件',
				finished : data.checkCount+' 件',
				subtext : '验收率',
			};		
		}
		else{
			handleData = {
				percent : 0,
				id : 'maintain_echarts5_1',
				time : '',
				find : '0 件',
				finished : '0 件',
				subtext : '验收率',
			};		
		}
		echarts_2(handleData) 
		$("#projectAcceptance p").html(handleData.time);
		$("#project_acceptance_handle").find('span').eq(1).html(handleData.find);
		$("#project_acceptance_finished").find('span').eq(1).html(handleData.finished);		
	}

	
	//加载统计图表1
	function echarts_1(data){
		percent = data.percent;
		var myChart = echarts.init(document.getElementById(data.id));
		var option = {
		    title: {
		        text: percent + '%',
		        x: 'center',
		        y: 'center',
		        textStyle: {
		            color: '#000000',
		            fontSize: 14
		        },
		    },
		    animation: true,
		    series: [{
		        name: 'main',
		        hoverAnimation:false,
		        type: 'pie',
		        center: ['50%', '50%'],
		        radius: ['88%', '95%'],
		        label: {
		            normal: {
		                show: false
		            }
		        },
		        data: getData_1()
		    }]
		};
		myChart.setOption(option)		
	}
	
	//加载统计图表2
	function echarts_2(data){
		percent = data.percent;
		var myChart = echarts.init(document.getElementById(data.id));
		var option = {
		    title: {
		        text: percent + '%',
		        x: 'center',
		        y: 'center',
		        subtext:data.subtext,
		        textStyle: {
		            color: '#000000',
		            fontSize: 14
		        },
		        subtextStyle:{
		            fontSize :14
		        },		        
		    },
		    animation: true,
		    series: [{
		        name: 'main',
		        hoverAnimation:false,
		        type: 'pie',
		        center: ['50%', '50%'],
		        radius: ['88%', '95%'],
		        label: {
		            normal: {
		                show: false
		            }
		        },
		        data: getData_2()
		    }]
		};
		myChart.setOption(option)		
	}
	
	//圆环样式1
	function getData_1() {
	    return [{
	        value: (percent/100),
	        itemStyle: {
	            normal: {
	                color: '#41c7db',
	            }
	        }
	    }, {
	        value: 1 - (percent/100),
	        itemStyle: {
	            normal: {
	                color: '#dddddd'
	            }
	        }
	    }];
	}
	
	//圆环样式2
	function getData_2() {
	    return [{
	        value: (percent/100),
	        itemStyle: {
	            normal: {
	                color: '#386afe',
	            }
	        }
	    }, {
	        value: 1 - (percent/100),
	        itemStyle: {
	            normal: {
	                color: '#dddddd'
	            }
	        }
	    }];
	}