// JavaScript Document
$(document).ready(function(){
						   
//	$("a[action-frame='tip_todayData']").parents(".mod-header").next().find("#data-list")
//	.load('tip_todayData.php?sid='+Math.random()+'&id_build='+$(".js-app-select").find(".js-selected").val());	

    //今日数据
    $("a[action-frame='tip_todayData']").parents(".mod-header").next().find("#data-list")
	.load('tip_todayData.php?sid='+Math.random()+'&id_build='+$(".js-app-select").find(".js-selected").val());
	
	//时段分析
    $("a[action-frame='tip_periodAna']").parents(".mod-header").next().find("#chartcontainer")
	.load('tip_periodAna.php?sid='+Math.random()+'&id_build='+$(".js-app-select").find(".js-selected").val());
	
})


