// JavaScript Document

//---------------------生成下拉列表---------------------------------------------------------
//data    数据源
//input_id    input标签的id名称
function show_list(data,input_id){
	
	var error_str=false;
	//alert(data);
	try 
	{ 
		arr_data=eval("("+data+")");   //加()的作用是返回匿名对象
	} 
	catch (e) 
	{ 
		error_str=true;
		alert(data);
		//alert(e.message); 
	} 
	if(error_str==false)
	{
		var data = arr_data;
	}
	
	$(function() {
		$('#'+input_id).autocomplete(data, {
			max: 100,    //列表里的条目数
			minChars: 0,    //自动完成激活之前填入的最小字符
			width: 280,     //提示的宽度，溢出隐藏
			scrollHeight: 300,   //提示的高度，溢出显示滚动条
			matchContains: true,    //包含匹配，就是data参数里的数据，是否只要包含文本框里的数据就显示
			autoFill: false,    //自动填充
			formatItem: function(row, i, max) {         //列表项名称
				return i + '/' + max + ':"' + row.value+"_"+row.label;
			},
			formatMatch: function(row, i, max) {        
				return row.value+"_"+row.label;
			},
			formatResult: function(row) {
				return row.value+"_"+row.label;
			}
		}).result(function(event, row, formatted) {
			//alert(row.value);
			check_pic();
		});
	});
}
