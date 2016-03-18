
function mapConfig(){
   //新建一个MAP:
   var bounds = new OpenLayers.Bounds(16.87864188477397,-123.07619552414154,149.3924655355513,-21.21345435556475);
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

	// 设置基底图层；
	var layer = new OpenLayers.Layer.WMS(
		"Geoserver layers - BK", 
		"http://open2.rtmap.net:2323/geoserver/rtmap/wms",
		{
			LAYERS: '860100010020300001_f5',//图层名称
			STYLES: '',
			tiled: false,//请求瓦片图           
		    format: 'image/png',
			tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom            //瓦片的起点，左下角
		},
		{

			buffer: 0,
				displayOutsideMaxExtent: true,
			ratio: 1,
			isBaseLayer: true,//基底图层，一个有用的地图至少需要有一个图层，至少一个基底图层
			yx: {'EPSG:3395': false}
		}
	);

	// 设置叠加层
	var layer_poi = new OpenLayers.Layer.WMS(
		"Geoserver layers - BK", 
		"http://open2.rtmap.net:2323/geoserver/rtmap/wms",
		{
			LAYERS: 'map_poi_860100010020300001_f5',
			transparent: true,
			STYLES: '',
			tiled: true,
            format: 'image/png',
    		tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
		},
		{

			buffer: 0,

			//visibility:false,//使图层不显示
			displayInLayerSwitcher:false,//使该图层不显示在Switcher Control

			minScale:413,//表示只有达到一定的缩放比例该图层才会显示
			transitionEffect:"resize",//使图层放大或缩小时产生调整大小的动画效果
			opacity:0.8,
   			displayOutsideMaxExtent: true,
    		ratio: 1,
    		yx: {'EPSG:3395': false}
		}
	);

	// 设置矢量图层，用来画点
	var pointLayer = new OpenLayers.Layer.Vector("Point Layer");

	// 增加图层：
	map.addLayers([layer,layer_poi,pointLayer]);

	//图片的可视范围放大到最大：
	//map.zoomToExtent(bounds);
	map.zoomToMaxExtent();

	// 添加/刷新 矢量要素
	show_poi(pointLayer);
}

var i=1;
function show_poi(pointLayer){
	pointLayer.removeAllFeatures();
    var arr_poi=[[34+i,-40-i],[35+i,-50-i]];
    var feature=[];  //new array()
    var point,attributes,style;
    for (var key in arr_poi) {
    	point=new OpenLayers.Geometry.Point(arr_poi[key][0],arr_poi[key][1]);

	    feature.push(new OpenLayers.Feature.Vector(point));
    };
    pointLayer.addFeatures(feature);

    i++;
	window.setTimeout(function(){show_poi(pointLayer)},3000);
}

function init() {
	// 初始化地图
	mapConfig();
}

