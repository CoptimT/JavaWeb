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
//		alert(dragObj.style.left);
	}
	function show_img(url_){
		$("#show_img").html('<div id="show_img_2"><img src="/total/images/ajax-loader.gif"></div>');
	
		$("#show_img").children("#show_img_2").load(url_
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
				scale=$("#show_img").attr("scale_new")*(width_start/width_img);

				init(); 
				
				//初始图片居中
				dragObj.style.top = "-"+$_("img").offsetHeight/2+"px";
				//alert(scale);
				
				heatmap();
			}; 
		});
	}
	show_img('show_map.php?name_img='+$("#show_img").attr("img_sre")+"&id_build="+$("#id_build").val()+"&sid="+Math.random());
	
	$.post("maps_building/showuser_heatmap_single_json.php?id_build="+document.form1.bigclassid.value+"&floor="+document.form1.smallclassid.value+"&date_time="+document.form1.Dyear.value+"-"+document.form1.Dmonth.value+"-"+document.form1.Dday.value
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



	function heatmap(){
	
		(function(global){
			var data = {};
			data["10dp"] = {};
			data["100dp"] = {};
			data["1000dp"] = {
				"data":[],
				"max":0
			};
	//		data["1000dp"] = {
	//			"data":[{'x':117.779833488,'y':40.6003700278,'count':3},{'x':80.779833488,'y':45.956521739,'count':5},{'x':128.82053654,'y':130.415356152,'count':3}],
	//			"max":5
	//		};
			data["10000dp"] = {};
			global.data = data;
		}(window));
	
		$.post("maps_building/show_heatmap_single.php", { 
				bigclassid: $("#id_build").val(), 
				smallclassid: $("#floor").val(), 
				Ddate2: $("#show_img").attr("Ddate2"), 
				danw: $("#show_img").attr("danw"), 
				scale: scale, 
				Dyear: $("#Dyear").val(), 
				Dmonth: $("#Dmonth").val(), 
				Dday: $("#Dday").val(), 
				user: $("#user").val()
			} ,
			function(data){
			    //alert("maps_building/show_heatmap_single.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&Ddate2="+$("#show_img").attr("Ddate2")+"&danw="+$("#show_img").attr("danw")+"&scale="+scale+"&Dyear="+$("#Dyear").val()+"&Dmonth="+$("#Dmonth").val()+"&Dday="+$("#Dday").val()+"&user="+encodeURIComponent($("#user").val())+"");
			    //alert(data);
				var error_str=false;
				try 
				{ 
					data_object=eval("("+data+")");   //加()的作用是返回匿名对象
				} 
				catch (e) 
				{ 
					error_str=true;
					alert(data);
	//				alert(e.message); 
				} 
				if(error_str==false)
				{
					window.data["1000dp"]=data_object;   
				}
				var data = window.data["1000dp"],heatmapInstance;
				heatmapInstance = h337.create({
					"element":document.getElementById("show_img"), 
					"radius":15,
					"opacity":50,
					"visible":true,
					"legend": {
						"title": "Stay Long (s)",
						"position": "bl",
						"offset": 10
					}
				});
				heatmapInstance.store.setDataSet(data);    
				document.getElementById("num_poi").innerHTML = data.data.length;
		});
	
	};

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

