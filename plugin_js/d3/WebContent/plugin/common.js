;$(document).ready(function(){

  //init pop frame
  $(document).bind('click',function(){
    window.hidePopFrame();
  });
  //init date filter
  if($('#date-select')){
    $('#date-select').ProSelect({
      callback : function(arr,n){
        //constrain time_unit component
        window.initTimeUnit(n);
        window.global.renderPage();
      }
    });
  }
  //init time_unit tab
  window.initTimeUnit = function(n){
    var time_unit_component = window.global.components['default:time_unit'];
    if( time_unit_component != undefined ){
      var flag = false;
      for(i in global.filter){
        if(global.filter[i] != ''){
          flag = true;
        }
      }
      if(flag){
        if(n == 1){
          time_unit_component.renderTab('set_status',{'disable_arr':['hourly','weekly','monthly'],'able_arr':['daily'],'current_item':'daily'});
          global.time_unit = 'daily';
        }else if(1 < n && n<= 7){
          time_unit_component.renderTab('set_status',{'disable_arr':['hourly','weekly','monthly'],'able_arr':['daily'],'current_item':'daily'});
          global.time_unit = 'daily';
        }else if(n>7 && n<=30){
          time_unit_component.renderTab('set_status',{'disable_arr':['hourly','monthly'],'able_arr':['weekly','daily'],'current_item':'daily'});
          global.time_unit = 'daily';
        }else if(n>30 && n<=365){
          time_unit_component.renderTab('set_status',{'disable_arr':['hourly'],'able_arr':['weekly','daily','monthly'],'current_item':'weekly'});
          global.time_unit = 'weekly';
        }else if(n>365){
          time_unit_component.renderTab('set_status',{'disable_arr':['hourly'],'able_arr':['weekly','daily','monthly'],'current_item':'monthly'});
          global.time_unit = 'monthly';
        }
      }else{
        if(n == 1){
          time_unit_component.renderTab('set_status',{'disable_arr':['weekly','monthly'],'able_arr':['hourly','daily'],'current_item':'daily'});
          global.time_unit = 'daily';
        }else if(1 < n && n<= 7){
          time_unit_component.renderTab('set_status',{'disable_arr':['weekly','monthly'],'able_arr':['hourly','daily'],'current_item':'daily'});
          global.time_unit = 'daily';
        }else if(n>7 && n<=30){
          time_unit_component.renderTab('set_status',{'disable_arr':['hourly','monthly'],'able_arr':['weekly','daily'],'current_item':'daily'});
          global.time_unit = 'daily';
        }else if(n>30 && n<=365){
          time_unit_component.renderTab('set_status',{'disable_arr':['hourly'],'able_arr':['weekly','daily','monthly'],'current_item':'weekly'});
          global.time_unit = 'weekly';
        }else if(n>365){
          time_unit_component.renderTab('set_status',{'disable_arr':['hourly'],'able_arr':['weekly','daily','monthly'],'current_item':'monthly'});
          global.time_unit = 'monthly';
        }
      }
      
    }
  }
  //init version filter
  $('#filter-version').Filter({
    panelid : 'filt-version',
    url : '/apps/'+global.appid+'/load_versions',
    text : '版本',
    templDefault : '{{if is_shown}}<li><input type="checkbox" id="${name}" {{if check}}checked=${check}{{/if}}/>${name}</li>{{/if}}',
    templSearch : '<li><input type="checkbox" id="${name}" {{if check}}checked=${check}{{/if}}/>${name}</li></li>',
    templchecked :  '{{if check}}<li><input type="checkbox" id="${name}" checked="${check}"/>${name}</li>{{/if}}',
    callback : function(inst,data){
      if(data.check){
        global.filter.version = data.id;
      }else{
        global.filter.version = '';
      }
      if( typeof window.global.renderPage === "function" ){
        window.global.renderPage();
      }
    }
  });
  //init channel filter
  $('#filter-channel').Filter({
    panelid : 'filt-chan',
    url : '/apps/'+global.appid+'/load_channels',
    text : '渠道',
    callback : function(inst,data){
      if(data.check){
        global.filter.channel = data.id;
      }else{
        global.filter.channel ='';
      }
      if( typeof window.global.renderPage === "function" ){
        window.global.renderPage();
      }
    }
  });
  //init segment filter
  $('#filter-segment').Filter({
    panelid : 'filt-segment',
    url : '/apps/'+global.appid+'/load_segments',
    text : '分群',
    panelTempl : '<div class="filterpanel" style="display:none;"><input type="text" class="input" placeholder="搜索全部顾客群"/><ul class="filterlist"></ul><div class="load" style="margin:10px auto;text-align:center;display:block;"><img src="images/ajax-loader.gif"/></div><div class="new-segment"><a href="/apps/'+ global.appid +'/segmentations/new" target="_blank">新建分群</a></div><div class="submitpanel"><a href="#" class="submit">确定</a></div></div>',
    callback : function(inst,data){
      if(data.check){
        global.filter.segment = data.id;
      }else{
        global.filter.segment = '';
      }
      if( typeof window.global.renderPage === "function" ){
        window.global.renderPage();
      }
    }
  });
  //init constrast times
  $('#constr-date').Contrast({
    callback : function(arr){
      var time_unit = window.global.components['default:time_unit'];
      render_chart('chartcontainer','', '/apps/'+global.appid+'/reports/load_chart_data',{
        start_date: arr[0],
        end_date: arr[1],
        channels:[global.filter.channel],
        versions:[global.filter.version],
        segments:[global.filter.segment],
        time_unit:time_unit.renderTab('get_status'),
        stats:global.action_stats,
        is_compared:true
      },false);
    }
  });
  //init time_unit tab
  var time_unit = $('#period');
  time_unit.renderTab({
    data: [
    {
      name: "日",
      particle : "daily",
      flag : "true"
    },
    {
      name: "周",
      particle : "weekly",
      flag : "false"
    },
    {
      name: "月",
      particle : "monthly",
      flag : "false"
    }
    ],
    default_type : "daily",
    callback : function(tar,attr,index,txt){
      global.time_unit = attr;
      if( typeof window.global.renderPage === "function" ){
        window.global.renderPage();
      }
    }
  });
  // registrate date selector to components centre
  if( window.global.components['default:time_unit'] === undefined ){
    window.global.components['default:time_unit'] = time_unit;
  }

  // init version down-selector
  $('#version-select').DownList({
    is_ajax : true,
    search: 'on',
    url : '/apps/'+ global.appid + '/load_versions?show_all=true',
    temp : '<li><a class="event" href="?version=${id}" data-id="${id}" title="${name}">${name}</a></li>',
    callback : function(elem){
      global.filter.version = $(elem).data('id');
    }
  });

  //init page ajax
  if( typeof window.global.renderPage === "function" ){
    window.global.renderPage();
  }
});

