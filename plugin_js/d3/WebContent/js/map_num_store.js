// JavaScript Document

	var $_=function(d)
	{
		return document.getElementById(d);
	}; 
	
	function scrollImage(id,speed) //被缩放图象id与缩放速度 
	{ 
		var speed=speed?speed:1; 
		var is_ff=navigator.userAgent.toLowerCase().indexOf('firefox'); 
		var zoom=function(event)
		{ 
			$(document.body).css("overflow","hidden");
			var event=event?event:window.event; 
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
			$_("map_floor").innerHTML=$_(id).offsetWidth+","+$_(id).offsetHeight; //调试用,显示图象实时宽度,使用时删除
			$_("map_scale").innerHTML=scale_new; //调试用,显示地图比例尺,使用时删除
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
		window.document.onmousemove = function(event){mouseMove(event);};
		window.document.onmousedown = function(event){mouseDown(event);};
		window.document.onmouseup = function(event){mouseUp();};
		window.document.ondragstart = function(event){mouseStop(event);};
		scale=$("#poi_list").attr("scale_new");
		width_img=$_("img").offsetWidth;
		$_("map_floor").innerHTML=$_("img").offsetWidth+","+$_("img").offsetHeight; //调试用,显示图象实时宽度,使用时删除
		$_("map_scale").innerHTML=scale; //调试用,显示地图比例尺,使用时删除
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
		$("#show_img").html("<img src='/total/images/ajax-loader.gif'>");
		$("#show_img").load(url_
		,function(){
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
	
	$(function($){
		show_img('show_map.php?name_img='+$("#show_img").attr("img_sre")+'&id_build='+$("#id_build").val()+'&sid='+Math.random());
		
		if($("#poi_list").attr("Ddate2")!="" && Number($("#poi_list").attr("scale_new"))!=0){
			//alert('maps_building/show_count_poi_3.php?bigclassid='+$("#id_build").val()+'&smallclassid='+$("#floor").val()+'&Ddate2='+$("#poi_list").attr("Ddate2")+'&danw='+$("#poi_list").attr("danw")+'&scale='+$("#poi_list").attr("scale_new")+'&sid='+Math.random());
			$("#poi_list").load('maps_building/show_count_poi_3.php?bigclassid='+$("#id_build").val()+'&smallclassid='+$("#floor").val()+'&Ddate2='+$("#poi_list").attr("Ddate2")+'&danw='+$("#poi_list").attr("danw")+'&scale='+$("#poi_list").attr("scale_new")+'&sid='+Math.random());
		}
	});
	
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
