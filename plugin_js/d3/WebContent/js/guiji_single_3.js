// JavaScript Document

	var $_=function(d)
	{
		return document.getElementById(d)
	}; 
	
	var is_ff=navigator.userAgent.toLowerCase().indexOf('firefox'); 
	
	function scrollImage(id,speed) //被缩放图象id与缩放速度 
	{ 
		var speed=speed?speed:1; 
		var zoom=function(event)
		{ 
			var event=event?event:window.event; 
			$_("map_floor").innerHTML=$_(id).offsetWidth+","+$_(id).offsetHeight; //调试用,显示图象实时宽度,使用时删除
			if(is_ff>0)
			{ 
				$_(id).style.width=($_(id).offsetWidth-event.detail*speed)+'px'; 
				scale_new=scale*(width_img/$_(id).offsetWidth);
			}
			else
			{ 
				$_(id).style.width=($_(id).offsetWidth+event.wheelDelta/40*speed)+'px'; 
				scale_new=scale*(width_img/$_(id).offsetWidth);
			} 
		}; 
		this.onload_=function()               //这是是对象所以用this
		{ 
			if(is_ff>0) 
			{
				$_("img").addEventListener("DOMMouseScroll",zoom,false); 
			}
			else 
			{
				$_("img").onmousewheel=zoom; 
			}
		} 
	} 
	
	function init() 
	{
		$_("map_floor").innerHTML=$_("img").offsetWidth+","+$_("img").offsetHeight; //调试用,显示图象实时宽度,使用时删除
		window.document.onmousemove = function(event){mouseMove(event);};
		window.document.onmousedown = function(event){mouseDown(event);};
		window.document.onmouseup = function(event){mouseUp();};
		window.document.ondragstart = function(event){mouseStop(event);};
	}
	function mouseDown(e) {
        e = e || window.event;
		if (drag) 
		{
			clickleft = e.clientX - parseInt(dragObj.style.left);
			clicktop = e.clientY - parseInt(dragObj.style.top);
	        //dragObj.style.zIndex += 1;
			move = 1;
		}
	}
	function mouseStop(e) {
        e = e || window.event;
		e.returnValue = false;
	}
	function mouseMove(e) {
        e = e || window.event;
		if (move) 
		{
			dragObj.style.left = (e.clientX - clickleft)+"px";       //有些浏览器不兼容，需加单位
			dragObj.style.top = (e.clientY - clicktop)+"px";
		}
	}
	function mouseUp() {
		move = 0;
//		alert(dragObj.style.left);
	}
	function show_img(url_,floor_current,floor_key_current){
		//alert(floor_key_current);
		$("#show_img").load(url_
		,function(){
//			var img_obj=new scrollImage("img",15); 
			dragObj=$_("block1"); 
			drag = 0;   //onmouseover事件
			move = 0;   //按住鼠标移动事件
//			img_obj.onload_();
            document.getElementById("img").onload = function() {
			    //调整图片的默认大小
				width_start=$_("img").offsetWidth;
				width_img=1300;
				if(is_ff>0)
				{ 
					$_("img").style.width=width_img+'px'; 
				}
				else
				{ 
					$_("img").style.width=width_img+'px'; 
				} 
				
				scale=arr_floor[floor_current]["scale"]*(width_start/width_img);
				//alert(scale);
				
				$("input[type='button'][guiji]").each(function(i){
					if($(this).attr("key")==floor_key_current){
						$(this).attr("class","button current")
					}else{
						$(this).attr("class","button")
					}										   
				});
				
				init(); 
				
				//初始图片居中
				dragObj.style.top = "-"+$_("img").offsetHeight/2+"px";
				
				//show_guiji()
			
				var num_poi=arr_poi_list[floor_key_current].length;
							
				if(num_poi>0){
					$.each(arr_poi_list[floor_key_current],function(key,value){
						arr_poi=value.split(",");
						
						x_now=(arr_poi[0]/danw)/(scale*100);
						y_now=(arr_poi[1]/danw)/(scale*100);
						if(key==0)
						{
							createPoint_begin(document.getElementById('show_img'),x_now,y_now);
						}
						if(key>0 && key<num_poi-1)
						{
							createPoint(document.getElementById('show_img'),x_now,y_now);
							line(x_last, y_last, x_now, y_now, document.getElementById('show_img'));
						}
						if(key>0 && key==num_poi-1)
						{
							createPoint_end(document.getElementById('show_img'),x_now,y_now);
							line(x_last, y_last, x_now, y_now, document.getElementById('show_img'));
							//alert("line("+x_last+", "+y_last+", "+x_now+", "+y_now+", document.getElementById('show_img'))")
						}
						x_last=x_now;
						y_last=y_now;
					})
				}
			
				$('#num_position').text(num_poi);
								
			}; 
		});
	}
	
	function line(startX, startY, endX, endY, container) {    //container  dom对象
	//    alert(container);
		var a = (startY - endY) / (startX - endX);  
		var b = startY - ((startY - endY) / (startX - endX)) * startX;  
		if (Math.abs(startX - endX) > Math.abs(startY - endY)) {  
			if (startX > endX) 
			{  
				if (startY == endY) {  
					for (var k = startX; k >= endX; k=k-5) {  
						createPoint(container, k, startY);  
					}  
				}
				else
				{
					for (var i = startX; i >= endX; i=i-5) {  
						createPoint(container, i, a * i + b);  
					}  
				}  
			}  
			else
			{
				if (startY == endY) {  
					for (var k = startX; k <= endX; k=k+5) {  
						createPoint(container, k, startY);  
					}  
				}
				else
				{
					for (var i = startX; i <= endX; i=i+5) {  
						createPoint(container, i, a * i + b);  
					}  
				}
			}
		} else {  
			if (startY > endY) { 
				if (startX == endX) {  
					for (var k = startY; k >= endY; k=k-5) {  
						createPoint(container, startX, k);  
					}  
				} 
				else
				{
					for (var j = startY; j >= endY; j=j-5) {  
						createPoint(container, (j - b) / a, j);  
					}  
				} 
			} 
			else
			{
				if (startX == endX) {  
					for (var k = startY; k <= endY; k=k+5) {  
						createPoint(container, startX, k);  
					}  
				}  
				else
				{
					for (var j = startY; j <= endY; j=j+5) {  
						createPoint(container, (j - b) / a, j);  
					}  
				}
			} 
		}  
	}  
	  
	function createPoint(container, x, y) {  
		var node = document.createElement("div");  
		node.className = "line"; 
		node.style.top = y;  
		node.style.left = x;  
		container.appendChild(node);  
	}  
	function createPoint_begin(container, x, y) {  
		var node = document.createElement("div");  
		node.className = "line_begin";  
		node.style.top = y;  
		node.style.left = x;  
		container.appendChild(node);  
	}  
	function createPoint_end(container, x, y) {  
		var node = document.createElement("div");  
		node.className = "line_end";  
		node.style.top = y;  
		node.style.left = x;  
		container.appendChild(node);  
	}  
	
	function show_guiji(){		
		$("#show_img").html("<img src='/total/images/ajax-loader.gif'>");
		
		//alert("maps_building/show_guiji_line.php?bigclassid="+$("#id_build").val()+"&Ddate2="+$("#show_img").attr("Ddate2")+"&Dyear="+$("#Dyear").val()+"&Dmonth="+$("#Dmonth").val()+"&Dday="+$("#Dday").val()+"&Dhour="+$("#Dhour").val()+"&user="+encodeURIComponent($("#user").val())+"");
		$.post("maps_building/show_guiji_line_3.php", { 
				bigclassid: $("#id_build").val(), 
				Dyear: $("#Dyear").val(), 
				Dmonth: $("#Dmonth").val(), 
				Dday: $("#Dday").val(), 
				Dhour: $("#Dhour").val(), 
				user: $("#user").val()
			},
			function(data){
			    //alert(data);
				try 
				{ 
					arr_poi_list=eval("("+data+")")
				} 
				catch (e) 
				{ 
		            $("#show_img").html("");
					alert(data);
					return;
				} 
				
				if($.isEmptyObject(arr_poi_list)){
		            $("#show_img").html("");
					//alert("未选择顾客或信息为空");
				}else{
					var button_floor_list="";
					$.each(arr_poi_list,function(key,value){
						floorid=key.split("*")[1];
						if(floorid.substr(0,1)==2){
							floor_str="F"+(floorid.substr(1,4)/10);
						}else{
							floor_str="B"+(floorid.substr(1,4)/10);
						}						  
						button_floor_list+='<span><input type="button" guiji=1 class="button" key="'+key+'" value="'+floor_str+'"></span>';
					})
					
					$(".floor_list").html(button_floor_list);
					
					$("input[type='button'][guiji]").each(function(i){
						//初始化楼层，第一次访问的楼层	
						
						if(typeof(arr_floor[this.value])=="undefined"){
							$("#show_img").html("缺少基础数据")
						}else{
							if(i==0){
								show_img('show_map.php?name_img='+arr_floor[this.value]["img_src"] +"&id_build="+$("#id_build").val()+"&sid="+Math.random(),this.value,$(this).attr("key"));
							}		
				
							$(this).live("click",function(){
								show_img('show_map.php?name_img='+arr_floor[this.value]["img_src"]+"&id_build="+$("#id_build").val()+"&sid="+Math.random(),this.value,$(this).attr("key"));
							});											   
						}
					});
				}
				
		}); 
	}

	function shaix(name_box,name_button){
	    $("."+name_box).toggle("slow"
		
			,function () {
			    if($("."+name_button).text()=="收起筛选")
				{
					$("."+name_button).text("打开筛选");
				}
				else
				{
					if($("."+name_button).text()=="打开筛选")
					{
						$("."+name_button).text("收起筛选");
					}
				}
			}
		
		);
	}
	
	var danw=$("#show_img").attr("danw");
	
	var arr_poi_list={};
	
	show_guiji();
	
	//alert(arr_poi_list);
		
	//alert("maps_building/showuser_guiji_single_json.php?id_build="+document.form1.bigclassid.value+"&date_time="+document.form1.Dyear.value+"-"+document.form1.Dmonth.value+"-"+document.form1.Dday.value+"-"+document.form1.Dhour.value);
	$.post("maps_building/showuser_guiji_single_json_3.php?id_build="+document.form1.bigclassid.value+"&date_time="+document.form1.Dyear.value+"-"+document.form1.Dmonth.value+"-"+document.form1.Dday.value+"-"+document.form1.Dhour.value
			,function(data){
				var error_str=false;
//				alert(data);
				try 
				{ 
					arr_data=eval(data);   //加()的作用是返回匿名对象
				} 
				catch (e) 
				{ 
					error_str=true;
					alert(data);
//					alert(e.message); 
				} 
				if(error_str==false)
				{
					var data = arr_data;
				}
				
				$(function() {
					$('#user').autocomplete(data, {
						max: 100,    //列表里的条目数
						minChars: 0,    //自动完成激活之前填入的最小字符
						width: 280,     //提示的宽度，溢出隐藏
						scrollHeight: 300,   //提示的高度，溢出显示滚动条
						matchContains: true,    //包含匹配，就是data参数里的数据，是否只要包含文本框里的数据就显示
						autoFill: false,    //自动填充

						formatItem: function(row, i, max) {    //选项显示格式
							return i + '/' + max + ':"' + row.value+"_"+row.label;
						},
						formatMatch: function(row, i, max) {    //输入搜索范围
							return row.value+"_"+row.label;
						},
						formatResult: function(row) {      //选中项的返回值格式
							return row.value+"_"+row.label;
						}

					}).result(function(event, row, formatted) {
						//alert(row.value);
						check_pic();
					});
				});

			}
	);


