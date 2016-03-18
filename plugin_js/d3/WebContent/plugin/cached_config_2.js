// JavaScript Document

/*
------------------------------日期按钮------------------------------------------------
*/
function date_button(id_button,name_button){
	   var type_trigger = arguments[2] ? arguments[2] : "both";   //设置默认触发条件，函数date_button_2可舍弃
	   jQuery('#'+id_button).datepicker({   
		   dateFormat: 'yy-mm-dd',  //日期格式，自己设置
		   buttonText : name_button,  //按钮的图片路径，自己设置 
		   showOn: type_trigger,//触发条件，both表示点击文本域和图片按钮都生效。还有button 
		   yearRange: '1990:2013',//年份范围 
		   clearText:'清除',//下面的就不用详细写注释了吧，呵呵，都是些文本设置 
		   closeText:'关闭', 
		   prevText:'前一月', 
		   nextText:'后一月', 
		   currentText:' ', 
		   monthNames:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
	   });   
};

/*
要舍弃
*/
function date_button_2(id_button,name_button){
	   jQuery('#'+id_button).datepicker({   
		   dateFormat: 'yy-mm-dd',  //日期格式，自己设置 
		   buttonText : name_button,  //按钮的图片路径，自己设置 
		   showOn: 'focus',//触发条件，both表示点击文本域和图片按钮都生效。还有button 
		   yearRange: '1990:2013',//年份范围 
		   clearText:'清除',//下面的就不用详细写注释了吧，呵呵，都是些文本设置 
		   closeText:'关闭', 
		   prevText:'前一月', 
		   nextText:'后一月', 
		   currentText:' ', 
		   monthNames:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
	   });   
};

/*
------------------------------日期格式化------------------------------------------------
使用方法 
var now = new Date(); 
var nowStr = now.format("yyyy-MM-dd hh:mm:ss"); 
*/
Date.prototype.format = function(format){ 
	var o = { 
	"M+" : this.getMonth()+1, //month 
	"d+" : this.getDate(), //day 
	"h+" : this.getHours(), //hour 
	"m+" : this.getMinutes(), //minute 
	"s+" : this.getSeconds(), //second 
	"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
	"S" : this.getMilliseconds() //millisecond 
	} 
	
	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 
	
	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
		format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
} 

/*
------------------------------某日期范围------------------------------------------------
要舍弃，该方法被拆分成2个简单方法
date_list  日期列表id
b_input   开始日期id
e_input   结束日期id
div_show  统计图展示id
name_php  ajax页面名，不含后缀名
arr_p=[["date_more","date_list_3"],["date_more_2","date_list_3_2"]];  
	ajax参数，不包含建筑物
	第一个参数：post参数名  第二个参数：参数值所在元素的id值
*/
function show_rdate(date_list,b_input,e_input,div_show,name_php,arr_p){
   if(jQuery("#"+b_input).val() && jQuery("#"+e_input).val())
   {
	   if(jQuery("#"+e_input).val()>=jQuery("#"+b_input).val())
	   {
		   
			var sb_date  =  jQuery("#"+b_input).val()  //"2007-01-05";
			var se_date  =  jQuery("#"+e_input).val()  //"2007-01-05";
			var ab_date  =  sb_date.split("-");
			var ae_date  =  se_date.split("-");
			var ob_date  =  new  Date();    
			var oe_date  =  new  Date();    
			ob_date.setFullYear(ab_date[0],ab_date[1]-1,ab_date[2]);    
			oe_date.setFullYear(ae_date[0],ae_date[1]-1,ae_date[2]); 
			var ob_date_2=new Date();
			
			for(var i=0;i<=7;i++){
				ob_date_2.setTime(ob_date.getTime()+i*24*60*60*1000);
				if(ob_date_2.getTime()<=oe_date.getTime()){
						jQuery("#"+date_list).val(jQuery("#"+date_list).val()+"_"+ob_date_2.format("yyyy-MM-dd"));
					}
				}
			var list_p="";
		    for (key in arr_p){
					list_p=list_p+"&"+arr_p[key][0]+"="+jQuery("#"+arr_p[key][1]).val()
				}
			
			jQuery("#"+div_show).html('<DIV class=wait-load><IMG src="/total/images/ajax-loader.gif"></DIV>');
			jQuery("#"+div_show)
			.load(name_php+'.php?sid='+Math.random()+'&id_build='+jQuery(".js-app-select").find(".js-selected").attr("value")+list_p);
	   }
	   else
	   {
		   alert("请正确选择时间范围");
       }
   }
}


/*
dateinput按钮的事件处理函数:     //日期需要指定是date_list还是dateinput，默认是date_list的val
name_php          //ajax页面名，含后缀名
arr_p=[["name_id_div1","name_attr_div1"],["name_id_div2","name_attr_div2"]["name_id_div2",""]];  
	ajax参数，不包括日期参数
	第一个参数：参数所在的元素id值  第二个参数：参数所在元素的属性名(非空时参数名取属性名参数值取属性值，空时参数名取id值参数值取id元素的值)
name_id_iframe     //iframe框架id名称
*/
function show_data(name_php,arr_p){
    var name_id_iframe = arguments[2] ? arguments[2] : "iframepage";   //设置name_id_iframe默认值
    var type_date = arguments[3] ? arguments[3] : "date_list";   //设置type_date默认值"date_list",还可以是"dateinput"
	$("#chartcontainer").html('<DIV class=wait-load><IMG src="/total/images/ajax-loader.gif"></DIV>');
	jQuery("#date_list").val((!jQuery("#dateinput").val())?jQuery("#date_list").val():jQuery("#date_list").val()+"_"+jQuery("#dateinput").val());
	
	//生成参数字符串：	
	var list_p="";
	for (key in arr_p){
		if(arr_p[key][1]==""){
			list_p=list_p+"&"+arr_p[key][0]+"="+jQuery("#"+arr_p[key][0]).val();
		}else{
			list_p=list_p+"&"+arr_p[key][1]+"="+jQuery("#"+arr_p[key][0]).attr(arr_p[key][1]);
		}
	}
	
	$.post(name_php+'?sid='+Math.random()+'&'+type_date+'='+$("#"+type_date).val()+list_p,function(data){
		$("#chartcontainer").html(data);
		window.parent.iFrameHeight(name_id_iframe);
	});
	
	return name_php+'?sid='+Math.random()+'&'+type_date+'='+$("#"+type_date).val()+list_p;
}

/*
b_input和e_input按钮的事件处理函数:   //日期取date_list得val
name_php          //ajax页面名，含后缀名
arr_p=[["name_id_div1","name_attr_div1"],["name_id_div2","name_attr_div2"]];  
	ajax参数，不包括日期参数
	第一个参数：参数所在的元素id值  第二个参数：参数所在元素的属性名(非空时参数名取属性名参数值取属性值，空时参数名取id值参数值取id元素的值)
name_id_iframe     //iframe框架id名称
*/
function show_data_2(name_php,arr_p){
   var name_id_iframe = arguments[2] ? arguments[2] : "iframepage";   //设置name_id_iframe默认值
   var date_list_type = arguments[3] ? arguments[3] : "0";   //日期列表类型，0：保留以前的日期列表	1：重新生成日期列表
   if(jQuery("#b_input").val() && jQuery("#e_input").val())
   {
	   if(jQuery("#e_input").val()>=jQuery("#b_input").val())
	   {
		   
			var sb_date  =  jQuery("#b_input").val()  //日期字符串："2007-01-05";
			var se_date  =  jQuery("#e_input").val()  //"2007-01-05";
			var ab_date  =  sb_date.split("-");       //日期数组
			var ae_date  =  se_date.split("-");
			var ob_date  =  new  Date();              //日期对象
			var oe_date  =  new  Date();  
			//设置年份:
			ob_date.setFullYear(ab_date[0],ab_date[1]-1,ab_date[2]);    
			oe_date.setFullYear(ae_date[0],ae_date[1]-1,ae_date[2]); 
			var ob_date_2=new Date();   //临时日期对象
			
			//生成时间字符串，时间范围限定到7天：
			if(date_list_type=="0"){
				for(var i=0;i<=7;i++){
					ob_date_2.setTime(ob_date.getTime()+i*24*60*60*1000);
					if(ob_date_2.getTime()<=oe_date.getTime()){
						jQuery("#date_list").val(jQuery("#date_list").val()+"_"+ob_date_2.format("yyyy-MM-dd"));
					}
				}
			}else{
				jQuery("#date_list").val("");
				for(var i=0;i<=7;i++){
					ob_date_2.setTime(ob_date.getTime()+i*24*60*60*1000);
					if(ob_date_2.getTime()<=oe_date.getTime()){
						jQuery("#date_list").val(jQuery("#date_list").val()+"_"+ob_date_2.format("yyyy-MM-dd"));
					}
				}
			}
				
			//生成参数字符串：	
			var list_p="";
		    for (key in arr_p){
				if(arr_p[key][1]==""){
					list_p=list_p+"&"+arr_p[key][0]+"="+jQuery("#"+arr_p[key][0]).val();
				}else{
					list_p=list_p+"&"+arr_p[key][1]+"="+jQuery("#"+arr_p[key][0]).attr(arr_p[key][1]);
				}
			}
			
			$("#chartcontainer").html('<DIV class=wait-load><IMG src="/total/images/ajax-loader.gif"></DIV>');
			jQuery.post(name_php+'?sid='+Math.random()+'&date_list='+$("#date_list").val()+list_p,function(data){
				$("#chartcontainer").html(data);
				window.parent.iFrameHeight(name_id_iframe);
			});
			
			return name_php+'?sid='+Math.random()+'&date_list='+$("#date_list").val()+list_p;
	   }
	   else
	   {
		   alert("请正确选择时间范围");
		   return false;
       }
   }
}


/*
------------------------------导出xls表--------------------------------------------------------------------
name_php  ajax页面名，不含后缀名
arr_p=[["date_more","date_list_3"]]; 
	ajax参数，不包含建筑物
	第一个参数：post参数名  第二个参数：参数值所在元素id值
*/
function export_data(name_php,arr_p){
	var list_p="";
	for (key in arr_p){
			list_p=list_p+"&"+arr_p[key][0]+"="+jQuery("#"+arr_p[key][1]).val()
		}
   window.open(name_php+'.php?sid='+Math.random()+'&id_build='+jQuery(".js-app-select").find(".js-selected").attr("value")+list_p);
}

/*
name_php  ajax页面名，含后缀名
arr_p=[["name_id_div1","name_attr_div1"],["name_id_div2","name_attr_div2"]["name_id_div2",""]];  
	ajax参数，不包括日期参数
	第一个参数：参数所在的元素id值  第二个参数：参数所在元素的属性名(非空时参数名取属性名参数值取属性值，空时参数名取id值参数值取id元素的值)
*/
function export_data_iframe(name_php,arr_p){
    var type_date = arguments[2] ? arguments[2] : "date_list";   //设置type_date默认值"date_list",还可以是"dateinput"
	
	//生成参数字符串：	
	var list_p="";
	for (key in arr_p){
		if(arr_p[key][1]==""){
			list_p=list_p+"&"+arr_p[key][0]+"="+jQuery("#"+arr_p[key][0]).val();
		}else{
			list_p=list_p+"&"+arr_p[key][1]+"="+jQuery("#"+arr_p[key][0]).attr(arr_p[key][1]);
		}
	}
	
	window.open(name_php+'?sid='+Math.random()+'&'+type_date+'='+$("#"+type_date).val()+list_p);
}



/*
------------------------------获取url中请求参数，相当于PHP的$_GET------------------------------------------------
调用：var name = decodeURI(getQueryString("name"));
*/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
}


/*----------------------------自适应高度----------------------------------------------------------------------------
iframepage:iframe的id名称
*/
function iFrameHeight(iframepage) {
	var ifm= document.getElementById(iframepage);
	ifm.height=0;
	var subWeb = document.frames ? document.frames[iframepage].document : ifm.contentDocument;
	if(ifm != null && subWeb != null) {
		height_frame=subWeb.body.scrollHeight;
		height_default=230;
		if (height_frame>height_default) {
			ifm.height = subWeb.body.scrollHeight;
		} else{
			ifm.height = height_default;
		};
		//alert(ifm.height);
	}
}
