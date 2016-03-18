(function() {
    var path = "/d3/plugin/";
    var files = [
        'cached_lay_reports.js', //jQuery v1.7.1及部分插件
        'd3.min.js', //效果图插件
        'cached_lay_cus.js', //Highcharts及导出插件等
        'cached_config.js', //页面基本事件及函数
        'cached_config_2.js', //页面基本事件及函数

        'jquery.autocomplete.min.js', //输入框自动完善，类似form的select元素
        'jquery.validate.1.8.0.js', //jquery校验插件
        'form_.js', //应用联盟表单校验实例
        'app_setting.js' //分组及列表效果
    ];

    var tags = new Array(files.length);
    for (var i = 0, len = files.length; i < len; i++) {
        tags[i] = "<script src='" + path + files[i] + "'></script>";
    }
    document.write(tags.join(""));
})();