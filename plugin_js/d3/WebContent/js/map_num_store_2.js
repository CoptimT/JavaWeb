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
	map.addControl(new OpenLayers.Control.Scale(document.getElementById('map_scale')));
	//增加鼠标空间位置控件；
	map.addControl(new OpenLayers.Control.MousePosition({element: document.getElementById('map_location')}));
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
	
	// 设置矢量图层，用来画点
　　var pointLayer = new OpenLayers.Layer.Vector("Point Layer");

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

	//alert("maps_building/show_count_poi_2.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+'&Ddate2='+$("#show_img").attr("Ddate2")+"&danw="+$("#show_img").attr("danw")+"&sid="+Math.random());
	$.post("maps_building/show_count_poi_2.php?bigclassid="+$("#id_build").val()+"&smallclassid="+$("#floor").val()+'&Ddate2='+$("#show_img").attr("Ddate2")+"&danw="+$("#show_img").attr("danw")+"&sid="+Math.random(),function(data){
		show_poi(pointLayer,data);
	});

}

// 通过向vector层添加poi点feature，展示poi点
function show_poi(pointLayer,data){
	//alert(data);

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
		pointLayer.removeAllFeatures();
		
	    var arr_poi=arr_data["data"];
	    $("#num_poi").text(arr_poi.length);
	    var feature=[];  //new array()
	    var point,attributes,style;
	    for (var key in arr_poi) {
	    	point=new OpenLayers.Geometry.Point(arr_poi[key]["x"],"-"+arr_poi[key]["y"]);

		    feature.push(new OpenLayers.Feature.Vector(point));
	    };
	    pointLayer.addFeatures(feature);

	}
}

function init() {
	// 初始化地图
	mapConfig();
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
