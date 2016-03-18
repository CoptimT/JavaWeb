// JavaScript Document

//----------------------图片操作------------------------------------	
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
//----------------------图片操作end------------------------------------	
	
		
//----------------------热度图------------------------------------	
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
		
		$.post("maps_building/show_heatmap_2.php", { 
				bigclassid: $("#id_build").val(), 
				smallclassid: $("#floor").val(), 
				danw: $("#show_img").attr("danw"), 
				scale: scale, 
				Dyear: $("#Dyear").val(), 
				Dmonth: $("#Dmonth").val(), 
				Dday: $("#Dday").val(), 
				Dhour: $("#Dhour").val()             //1-24
			} ,
			function(data){
//			    alert("maps_building/show_heatmap_2.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#show_img").attr("danw")+"&scale="+scale+"&Dyear="+$("#Dyear").val()+"&Dmonth="+$("#Dmonth").val()+"&Dday="+$("#Dday").val()+"&Dhour="+$("#Dhour").val());
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
					window.data["1000dp"]=data_object;   //加()的作用是返回匿名对象
				}
				var data = window.data["1000dp"],heatmapInstance;
				heatmapInstance = h337.create({
					"element":document.getElementById("show_img"), 
					"radius":15,
					"opacity":50,
					"visible":true,
					"legend": {
						"title": "The Number Of Visitors",
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
//----------------------热度图end------------------------------------	
	
	
	
//----------------------导出图片vs2------------------------------------	
	function show_png_2(canvas){
		//将当前 canvas 里的内容导出成图片数据, 结果是一个以 “data:” 开头的字符串, 实际上是图片的像素数据… 把这个贴到 img 标签的 src 里, 就能看见图片了
		// 图片导出为 png 格式
		var type = 'png';
		var imgData = canvas.toDataURL("image/png");
		//alert(imgData);
		
		$("#mask").show();   //打开遮罩层
		//执行save_img.php把imgData图片数据保存成图片，并返回url
		$.post("ajax/save_img.php",{ stream: imgData,name_image:$("#id_build").val()+"_"+$("#floor").val()},function(data){
			//alert(data);
			finderr=false;	
			try{
				data_object=eval("("+data+")");   //加()的作用是返回匿名对象
			}catch(e){
				finderr=true;
			}
			$("#mask").hide();   //关闭遮罩层
			//alert("error:"+data_object["error"]+"|data:"+data_object["data"])
			if(finderr==false && data_object["error"]=="0"){
				try{
					//方法一：创建表单提交，兼容性强
//					document.window_open.action="ajax/download.php?streamFilenam="+data_object["data"];
//					document.window_open.streamFilenam.value=data_object["data"];				
//					document.window_open.submit();	
					
					var f = document.createElement("form");
					document.body.appendChild(f);
					var i = document.createElement("input");
					i.type = "hidden";
					f.appendChild(i);
					i.value = data_object["data"];
					i.name = "streamFilenam";
					f.action = "ajax/download.php";
					f.submit();
					
					//方法二
					//window.open("ajax/download.php?streamFilenam="+data_object["data"]);
				}catch(e){
					alert(e.name+":"+e.message);
				}
			}else{
				alert("图片数据错误");
			}
		});
	}
	
	$("#export_png").on("click",function(){
		//show_png(document.getElementsByTagName("canvas")[0]);
		show_png_2(document.getElementsByTagName("canvas")[0]);
	});
//----------------------导出图片vs2end------------------------------------	
