// JavaScript Document

//---------------------地图服务---------------------------------------------------------
	var $_=function(d)
	{
		return document.getElementById(d)
	}; 
	
	function scrollImage(id,speed) //被缩放图象id与缩放速度 
	{ 
		var speed=speed?speed:1; 
		var is_ff=navigator.userAgent.toLowerCase().indexOf('firefox'); 
		var zoom=function(event)
		{ 
			$(document.body).css("overflow","hidden");
			var event=event?event:window.event; 
			$_("map_floor").innerHTML=$_(id).offsetWidth+","+$_(id).offsetHeight; //调试用,显示图象实时宽度,使用时删除
			var danw=$("#poi_list").attr("danw");
			if(is_ff>0)
			{ 
				$_(id).style.width=($_(id).offsetWidth-event.detail*speed)+'px'; 
				scale_new=scale*(width_img/$_(id).offsetWidth);
				$("#poi_list").attr("scale_new",scale_new);
				$("#poi_list").children("div").each(function(i){
					this.style.left=($("#img_dw"+i).attr("x_coord")/danw)/(scale_new*100)+'px';
					this.style.top=($("#img_dw"+i).attr("y_coord")/danw)/(scale_new*100)+'px';
				});
			}
			else
			{ 
				$_(id).style.width=($_(id).offsetWidth+event.wheelDelta/40*speed)+'px'; 
				scale_new=scale*(width_img/$_(id).offsetWidth);
				$("#poi_list").attr("scale_new",scale_new);
				$("#poi_list").children("div").each(function(i){
					this.style.left=($("#img_dw"+i).attr("x_coord")/danw)/(scale_new*100)+'px';
					this.style.top=($("#img_dw"+i).attr("y_coord")/danw)/(scale_new*100)+'px';
				});
			} 
			$(document.body).css("overflow","scroll");
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
		scale=$("#poi_list").attr("scale_new");
		width_img=$_("img").offsetWidth;
	}
	function mouseDown(e) {
        e = e || window.event;
		if (drag) 
		{
			clickleft = e.clientX - parseInt(dragObj.style.left);
			clicktop = e.clientY - parseInt(dragObj.style.top);
	        dragObj.style.zIndex += 1;
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
	}
	function show_img(url_){
		//$("#show_img").html("<img src='/d3/images/ajax-loader.gif'>");
		$("#show_img").load(url_,function(){
			var img_obj=new scrollImage("img",15); 
			dragObj=$_("block1"); 
			drag = 0;   //onmouseover事件
			move = 0;   //按住鼠标移动事件
			img_obj.onload_();
            document.getElementById("img").onload = function() {
				init(); 
				//初始图片居中
				dragObj.style.left = "-"+$_("img").offsetWidth/4+"px";       //有些浏览器不兼容，需加单位
				dragObj.style.top = "-"+$_("img").offsetHeight/2+"px";
			}; 
		});
	}
	
    function show_poi(url_){
		$("#poi_list").load(url_,function(){
		    $_("num_poi").innerHTML=$("#num_img_poi").text();  //显示打点个数
			//0：本地mysql 1：远端sqlite接口   2：远端socket接口 3：远端http接口（定位服务器）4：远端http接口（统计服务器）
			switch(Number($("#poi_list").attr("db_map_current"))){     
				case 0:
					window.setTimeout('show_poi("maps_building/show_poi.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) )',5000);
					break;
				case 1:
					window.setTimeout('show_poi("maps_building/show_poi_sqlite.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) )',5000);
					break;
				case 2:
					window.setTimeout('show_poi("maps_building/show_poi_socket_udp.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) )',5000);
					break;
				case 3:
					//window.setTimeout('show_poi("maps_building/show_poi_http.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) )',5000);
					window.setTimeout('show_poi("/d3/pos?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val())+"&sid="+Math.random())',3000);
					break;
				case 4:
					window.setTimeout('show_poi("maps_building/show_poi_http_tj.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) );',5000);
					break;
			}
		});
    }
	
	$(function($){
		//调用地图		   
		show_img('/d3/html/realtime/show_map.html');
		
		//调用位置点，与地图调用异步进行
		//0：本地mysql 1：远端sqlite接口  2：远端socket接口  3：远端http接口	4：远端http接口（统计服务器）
		switch(Number($("#poi_list").attr("db_map_current"))){
			case 0:
				show_poi("maps_building/show_poi.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) );
				$.post("maps_building/showuser_current_json.php?id_build="+$("#id_build").val()+"&floor="+$("#floor").val()+"&time_limit="+$("#time_limit").val()+"&sid="+Math.random()
					,function(data){
						show_users(data);
					}
				);
				break;
			case 1:
				show_poi("maps_building/show_poi_sqlite.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) );
				$.post("maps_building/showuser_current_sqlite_json.php?id_build="+$("#id_build").val()+"&floor="+$("#floor").val()+"&time_limit="+$("#time_limit").val()+"&sid="+Math.random()
					,function(data){
						show_users(data);
					}
				);
				break;
			case 2:
				show_poi("maps_building/show_poi_socket_udp.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) );
				$.post("maps_building/showuser_current_socket_udp_json.php?id_build="+$("#id_build").val()+"&floor="+$("#floor").val()+"&time_limit="+$("#time_limit").val()+"&sid="+Math.random()
					,function(data){
						show_users(data);
					}
				);
				break;
			case 3:
				/*show_poi("maps_building/show_poi_http.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) );
				$.post("maps_building/showuser_current_http_json.php?id_build="+$("#id_build").val()+"&floor="+$("#floor").val()+"&time_limit="+$("#time_limit").val()+"&sid="+Math.random()
					,function(data){
						show_users(data);
					}
				);*/
				//show_poi("/d3/html/realtime/show_pois.html?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()));
				show_poi("/d3/pos?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val())+"&sid="+Math.random());
				break;
			case 4:
				show_poi("maps_building/show_poi_http_tj.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) );
				alert("maps_building/show_poi_http_tj.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#poi_list").attr("danw")+"&scale="+$("#poi_list").attr("scale_new")+"&user="+encodeURIComponent($("#user").val()) );
				$.post("maps_building/showuser_current_http_tj_json.php?id_build="+$("#id_build").val()+"&floor="+$("#floor").val()+"&time_limit="+$("#time_limit").val()+"&sid="+Math.random()
					,function(data){
						show_users(data);
					}
				);
				break;
		}
		
	});
//---------------------生成顾客下拉列表---------------------------------------------------------
	function show_users(data){
		var error_str=false;
		try 
		{ 
			arr_data=eval(data);   //加()的作用是返回匿名对象
		} 
		catch (e) 
		{ 
			error_str=true;
			alert(data);
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
				formatItem: function(row, i, max) {
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


//---------------------选择框收起---------------------------------------------------------
	function shaix(name_box,name_button){
	    $("."+name_box).toggle("slow",function () {
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
