// JavaScript Document

//---------------------地图服务---------------------------------------------------------
function mapConfig(){
   //新建一个MAP:
   var bounds = new OpenLayers.Bounds($("#show_img").attr("bounds").split(","));
   var options = {
		controls: [],
		maxExtent: bounds,
		maxResolution: "auto",
		projection: "EPSG:3395",
		units: 'm'
	};
	var map = new OpenLayers.Map('show_img', options);

	//增加比例尺控件；
	map.addControl(new OpenLayers.Control.Scale(document.getElementById('scale')));
	//增加鼠标空间位置控件；
	map.addControl(new OpenLayers.Control.MousePosition({element: document.getElementById('location')}));
	// 增加图层开关控件
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    // 鼠标控制缩放控件
	map.addControl(new OpenLayers.Control.Navigation());

	//设置平铺层；
	var layer = new OpenLayers.Layer.WMS(
		"Geoserver layers - BK", 
		"http://"+$("#show_img").attr("url_map")+"/geoserver/"+$("#show_img").attr("area_work")+"/wms",
		{
			LAYERS: $("#show_img").attr("name_layer")+",map_poi_"+$("#show_img").attr("name_layer"),//图层名称
			STYLES: '',
			tiled: false,//请求瓦片图           
            format: 'image/png',
    		tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom            //瓦片的起点，左下角
		},
		{

			buffer: 0,
   			displayOutsideMaxExtent: true,
    		ratio: 1,
    		//isBaseLayer: true,//基底图层，一个有用的地图至少需要有一个图层，至少一个基底图层
    		yx: {'EPSG:3395': false}
		}
	);

	//定义样式
	var style = new OpenLayers.Style(null, {
		rules: [
			new OpenLayers.Rule({
				filter:new OpenLayers.Filter.Comparison({
					type:OpenLayers.Filter.Comparison.EQUAL_TO,
					property: 'style',
					value: 1
				}),
				symbolizer:{
					fontColor: 'red',
					fontSize: '12px',
					fillColor: 'green',
					strokeColor: false
				}
			}),
			new OpenLayers.Rule({
				filter:new OpenLayers.Filter.Comparison({
					type:OpenLayers.Filter.Comparison.EQUAL_TO,
					property: 'style',
					value: 2
				}),
				symbolizer:{
					fontColor: 'red',
					fontSize: '12px',
					fillColor: 'red',
					strokeColor: false
				}
			})
		]
	});
	
	// 设置矢量图层，用来画点
　　var pointLayer = new OpenLayers.Layer.Vector('Point Layer', {styleMap: new OpenLayers.StyleMap({'default': style})});
　　//var pointLayer = new OpenLayers.Layer.Vector("Point Layer");

	// 增加图层：
	map.addLayers([layer,pointLayer]);
	
	//图片的可视范围放大到最大：
	//map.zoomToExtent(bounds);
	map.zoomToMaxExtent();

	// 添加/刷新 矢量要素
	get_poi(pointLayer);
}

// 取得poi点
function get_poi(pointLayer){

	switch(Number($("#show_img").attr("db_map_current"))){     //0：本地mysql 1：远端sqlite接口   2：远端socket接口
		case 0:
			// alert("maps_building/show_poi.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#show_img").attr("danw")+"&user="+encodeURIComponent($("#user").val()) );
			$.post("maps_building/show_poi_2.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#show_img").attr("danw")+"&user="+encodeURIComponent($("#user").val()),function(data){
				show_poi(pointLayer,data);
			});
			break;
		case 1:
			// alert("maps_building/show_poi_sqlite_2.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#show_img").attr("danw")+"&user="+encodeURIComponent($("#user").val()) );
			$.post("maps_building/show_poi_sqlite_2.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+"&danw="+$("#show_img").attr("danw")+"&user="+encodeURIComponent($("#user").val()),function(data){
				show_poi(pointLayer,data);
			});
			break;
		case 2:
	}
}

// 通过向vector层添加poi点feature，展示poi点
function show_poi(pointLayer,data){
	// alert(data);

	var error_str=false;
	try 
	{ 
		arr_data=eval("("+data+")");   //加()的作用是返回匿名对象
	} 
	catch (e) 
	{ 
		error_str=true;
		// alert(data);
		// alert(e.message); 
	} 

	if(error_str==false)
	{
		//移除原有的要素
		pointLayer.removeAllFeatures();
		
	    var arr_poi=arr_data["data"];
	    $("#num_poi").text(arr_poi.length);
		
	    var feature=[];  //new array()
	    var point,attributes,style;
	    for (var key in arr_poi) {
	    	point=new OpenLayers.Geometry.Point(arr_poi[key]["x"],"-"+arr_poi[key]["y"]);
			var f = new OpenLayers.Feature.Vector(point);
			f.attributes.mac = "123";
			f.attributes.style = 1;
		    feature.push(f);
	    };
	    pointLayer.addFeatures(feature);

	}
	window.setTimeout(function(){get_poi(pointLayer)},5000);	
}

function init() {
	// 初始化地图
	mapConfig();
}


$(function($){

	//调用位置点，与地图调用异步进行
	//0：本地mysql 1：远端sqlite接口  2：远端socket接口
		switch(Number($("#show_img").attr("db_map_current"))){     
		case 0:
			$.post("maps_building/showuser_current_json.php?id_build="+$("#id_build").val()+"&floor="+$("#floor").val()+"&time_limit="+$("#time_limit").val()+"&sid="+Math.random()
				,function(data){
					show_users(data);
				}
			);
			break;
		case 1:
			$.post("maps_building/showuser_current_sqlite_json.php?id_build="+$("#id_build").val()+"&floor="+$("#floor").val()+"&time_limit="+$("#time_limit").val()+"&sid="+Math.random()
				,function(data){
					show_users(data);
				}
			);
			break;
		case 2:
	}
		
});



//---------------------生成顾客下拉列表---------------------------------------------------------
function show_users(data){
	
	var error_str=false;
	//alert(data);
	try 
	{ 
		arr_data=eval(data);   //加()的作用是返回匿名对象
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
