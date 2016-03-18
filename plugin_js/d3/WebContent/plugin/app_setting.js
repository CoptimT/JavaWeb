(function($){
  window.analytic = {};
  var groups = {}||"";
  window.analytic.groups = groups;
  groups.list = ['全部','未分组'];
  groups.cur_tag_id = '';
  groups.on = '';
  groups.popframe = 'on';
  groups.has_more_apps = false;
  groups.pages = 2;
  groups.curtag = $.trim($('.grouplist .tabs li.on').text());
  groups.mod = '<div class="mod-op"><div class="editgp"><b class="icon"></b>编辑分组</div><div class="editform"><input type="text" class="gpname input" maxlength="20"/><input type="button" value="确定" class="gpsmt button"/></div><div class="delgp"><b class="icon"></b>删除分组</div></div>';
  var o ={};
  var grouplist = function(){
    var t = this;
    this.init = function(){ //function enter
      this.docOpt();
      this.showDoc();
      this.showMr();
      this.showGrouplist();
      this.modGroup();
      this.addGroup();
      this.global();
      this.modifyBelongs();
    };
    this.global = function(){
      var getElem = t.getGroupOn($('.tabs'),'.on','group');
      if(typeof(getElem)!='undefined'){
        groups.on = getElem;
        groups.cur_tag_id = getElem.find('a:first').attr('tag_id');
        groups.cur_group_name = getElem.find('a:first').text();
      }
    }
    this.docOpt = function(){ //hidden sth
      $('body').live('click',function() { 
        $('.menulist').hide();
      });
    };
    this.listHeight = function(_t){
      if(_t){
        var l = _t.find('.list');
        var n = l.find('li').length;
        var h ='';
        if(n>3){
          h = '120px';
        }else{
          h = n*30 + 'px';
        }
        l.find('ul').css('height',h);
      }
    }
    this.showDoc = function(){ //show sth
      var getElem = t.getGroupOn($('.tabs'),'.on','group');
      if(typeof(getElem)!='undefined'){
        getElem.append('<span class="act"><a>^</a></span>');
      }
    };
    this.showMr = function(){ //show more grouplist
      $('.groupmore .showmore').bind('click',function(e){
        $('.menulist').toggle();
        return false;
      })
    };
    this.showGrouplist = function(){ //mouse on to show group belongs
      var flag = false;//closed
      $('.appgrouping').delegate('tr','mouseover',function(){
        var list = $(this).find('.gps');
        if(!flag){
          list.addClass('on');
        }
        list.unbind('click').bind('click',function(){
          var panel = $(this).next('.list');
          t.listHeight($(this).parent());
          if(panel.is(':visible')){
            panel.hide();
            flag = false;
          }else{
            var len = panel.find('li').length;
            if(len > 0){
              panel.show();
              flag = true;
            }else{
              panel.find('b').click();
              panel.find('.newgroup').addClass('border-radius');
              panel.show();
              flag = true;
            }
          }
          $("td.appname .app_name_w a.delete_app").hide();
          $(".delapp_control a.del").show();
          $(".delapp_control a.cancel").hide();
          return false;
        });
        $(this).find('.option-del a').show();
      });
      $('.appgrouping').delegate('tr','mouseout',function(){
        if(!flag){
          $(this).find('.on').removeClass('on');
          $(this).find('.list').hide();
        }
        $(this).find('.option-del a').hide();
      });
      $('.list').delegate('input,li,ul','click',function(e){
        e.stopPropagation();
      });
      $('body').bind('click',function() { 
        $('.list').hide();
        flag = false;
      });
    };
    grouplist.prototype.checkSubmit = function(el){ //check add group name
      var v = $.trim(el.val());
      var i,arr = window.analytic.groups.list;
      var log = {
        status : 'false',
        msg : ''
      };
      var msg = {
        nulls:'组名不能为空！',
        length:'长度不符合！',
        conflict:'组名不能重复！'
      };
      if(v==''){
        log.msg = msg.length;
        return log;
      }
      for(i in arr){
        if(arr[i]==v){
          log.msg = msg.conflict;
          return log;
        }
      }
      log.status = 'true';
      return log;
    };
    grouplist.prototype.clear = function(_t){ //clear sth
      _t.find('input:text').val('');
    }
    grouplist.prototype.getGrouplist = function(){ //get list by tabs
      var nums = [];
      $('.tabs li').each(function(){
        if($(this).attr('action-type')=='group'){
          nums.push($.trim($(this).find('a:first').text()));
        }
      });
      if($('.tabs li').hasClass('groupmore')){
        $('.menulist li').each(function(){
          nums.push($(this).text());
        })
      }
      return nums;
    };
    grouplist.prototype.getGroupOn = function(list,option,type){
      var temp = $(list).find(option);
      if(temp && temp.attr('action-type')==type){
        return temp;
      }
    }
    this.popFrame = function(data,obj){ //show applist after new group
      var arr = [];
      var applist = $('#applist');
      applist.find('.new_popbox_body').text('');
      //pop_dialog(applist, '855px','387px','','20%');
      applist.dialog();
      $('.addGroupPanel .sendname').show();
      $('.addGroupPanel').css('background','#fff').hide();
      $('#applist h3.title .groupname').text('添加到'+obj.tag_name);
      applist.find('.new_popbox_body').append('<ul></ul>');
      for(var i in data.apps){var b = data.apps[i];for(key in b){
        groups.cur_tag_id = data.tag_id;
        arr.push('<li><label><input type="checkbox" class="check" app_id="'+key+'"/>'+b[key]+'</label></li>');
      }}
      applist.find('ul').append(arr.join(''));
      applist.delegate('label','click',function(){
        if($(this).hasClass('on')){
          $(this).removeClass('on');
          $(this).find('input').attr('checked','false');
          return false;
        }else{
          $(this).addClass('on');
          $(this).find('input').attr('checked','true');
          return false;
        }
      })
      if(data.has_more_apps){
        groups.has_more_apps = true;
        t.getMrApplist(applist);
      }
      $('.getmorelist').live('click',function(){
        $(this).addClass('loading');
        t.ajaxGetMrApplist(callback);
      })
      applist.find('.selectall').bind('click',function(e){
        applist.find('input:checkbox').attr('checked','true');
        applist.find('label').addClass('on');
        e.stopPropagation();
      })
      applist.find('.cancelall').bind('click',function(e){
        applist.find('input:checkbox').removeAttr('checked');
        applist.find('label').removeClass('on');
        e.stopPropagation();
      })
      function callback(data){
        var more_arr = [];
        var applist = $('#applist');
        for(var i in data.apps){var b = data.apps[i];for(key in b){
          more_arr.push('<li><label><input type="checkbox" class="check" app_id="'+key+'"/>'+b[key]+'</label></li>');
        }}
        applist.find('ul').append(more_arr.join(''));
        $('.getmorelist').removeClass('loading');
        groups.has_more_apps = data.has_more_apps;
        groups.pages ++;
        if(!data.has_more_apps){
          applist.find('.getmorelist').remove();
        }
      }
    };
    this.addGroupOnly = function(data,obj,_t){
      var n =location.search.substr(1).split("=");
      var tagname = _t.prev().find('.tags');
      var normal = false;
      var _obj = '';
      $('.tabs li a').each(function(){
        if($(this).text() == '未分组'){
          normal = true;
          _obj = $(this);
        }
      })
      if($('.tabs li').hasClass('groupmore')){
        $('.menulist ul').append('<li><a href="/apps/setting?tag='+data.tag_id+'" tag_id="'+data.tag_id+'">'+ obj.tag_name +'</a></li>');
      }else{
        if(normal){
          _obj.parents('li').before('<li><a href="/apps/setting?tag='+data.tag_id+'" tag_id="'+data.tag_id+'">'+ obj.tag_name +'</a></li>');
        }else{
          $('.tabs').append('<li><a href="/apps/setting?tag='+data.tag_id+'" tag_id="'+data.tag_id+'">'+ obj.tag_name +'</a></li>');
        }
      }
      _t.find('ul').prepend('<li><input type="checkbox" tag_id="'+data.tag_id+'" checked="true"><label>'+obj.tag_name+'</label></li>');
      _t.parents('tr').siblings().find('.list ul').prepend('<li><input type="checkbox" tag_id="'+data.tag_id+'"><label>'+obj.tag_name+'</label></li>');
      _t.find('.newgroup').css('background','#fff');
      _t.find('.sendname').show();
      t.listHeight(_t.parent());
      _t.hide();
      analytic.groups.list.push(obj.tag_name);
    };
    this.getMrApplist = function(applist){ //get more applist in frame
      applist.find('.new_popbox_body').append('<div class="getmorelist">加载更多</div>');
    };
    this.addGroup = function(){
      $('.list b').bind('click',function(){
        $(this).hide();
        groups.popframe = 'off';
        $(this).parent().next().show().css('border-top','none');
        return false;
      })
      $('.addGroup').bind('click',function(){
        groups.popframe = 'on';
        $('.addGroupPanel').toggle();
        t.clear($(this).parent().next());
        return false;
      });
      $('.sendname').bind('click',function(){
        var len = $(this).parents('.list').find('li').length;
        if(len>4){
          alert('最多只能创建5个分组!');
          return false;
        }
        var pr = $(this).prev();
        var type = t.checkSubmit(pr);
        var param = {};
        if(type.status=='true'){
          param.tag_name = $.trim(pr.val());
          param.app_id = pr.attr('app_id')||'';
          $(this).hide();
          $(this).parent().css('background','url("/images/pic/ajax-loader.gif") 180px center no-repeat');
          if(groups.popframe == 'on'){
            t.ajaxAddGroup('',param,t.popFrame);
          }else{
            var l = $(this).parents('.list');
            t.ajaxAddGroup(l,param,t.addGroupOnly);
            $(this).prev().val('');
          }
        }else{
          alert(type.msg);
        }
      });
      t.addAppstoTag();
      return false;
    };
    this.modGroup = function(){ //modify group name or del
      var gflag = '1';
      var act_a;
      $('.act a').live('click',function(){
        if(gflag=='1'){
          act_a = $(this).parent().prev();
          o.txt = act_a.text();
          o.gid = act_a.attr('tag_id');
          $('.act').append(groups.mod);
          act_a.parent().find('.delgp').attr('tag_id',o.gid);
          gflag = '-1';
        }else{
          $('.mod-op').remove();
          gflag = '1';
        }
        return false;
      })
      t.editGroup();
      t.delGroup(o);

    };
    this.delGroup = function(o){
      $('.delgp').live('click',function(){
        var gid = $('.tabs .on a').attr('tag_id');
        if(confirm('确定删除分组？')){
          $.ajax({
            url:'/app_tags/'+gid,
            type:'delete',
            success:function(data){
              if(data.result == 'success'){
                window.location = location.pathname;
              }
            }
          })
        }
        return false;
      })
    };
    this.editGroup = function(){
      $('.editgp').live('click',function(){
        var txt = o.txt;
        var _this = $(this);
        _this.next().show();
        _this.next().find('.gpname').val(o.txt).focus();
        _this.hide();
        return false;
      })
      $('.gpsmt').live('click',function(){
        var val = $(this).prev().val();
        var node = $(this).parents('.on');
        if(val != ''){
          o.tag_name = val;
          t.ajaxModifyGroupname(o,function(data){
            node.find('a:first').text(val);
            node.find('.mod-op').remove();
            $('.gps .tags').html(val);
            $('.list input:checkbox').each(function(){
              if($(this).attr('tag_id')==groups.cur_tag_id){
                $(this).parent().find('label').text(val);
              }
            })
          });
        }else{
          alert('名字不能为空！');
        }
        return false;
      })	
    };
    this.modifyBelongs = function(){
      var f = false;
      $('.list input:checkbox').click(function(e){
        var obj = {};
        if($(this).attr('checked')){
          obj.check = 'add';
        }else{
          obj.check = 'delete';
        }
        obj.tag_id = $(this).attr('tag_id');
        obj.app_ids = $(this).parents('td').next('.appkey').text(); //attr('app_id');
        obj.cur = $(this);
        t.ajaxModifybelongs(obj);
      });
      function row_opt(obj){
        var arr = [];
        var n =location.search.substr(1).split("=");
        if(groups.curtag=='全部'){
          if(obj.check=='add'){
            if(obj.cur.parents('td').find('.gps .tags').text()=='未分组'){
              obj.cur.parents('td').find('.gps .tags').html(obj.cur.next().html());
            }else{
              obj.cur.parents('td').find('.gps .tags').html(obj.cur.parents('td').find('.gps .tags').html()+'，'+obj.cur.next().html());
            }
          }
          if(obj.check=='delete'){
            var checked = false;
            var inputs = obj.cur.parents('ul').find('input:checkbox');
            $(inputs).each(function(){
              if($(this).attr('checked')){
                checked = true;
              }
            })
            if(!checked){
              obj.cur.parents('td').find('.gps .tags').html('未分组');
            }
          }
        }else if(groups.curtag=='未分组'){
          if(obj.cur.attr('checked')){
            var table = obj.cur.parents('table');
            obj.cur.parents('tr').remove();
            table.find('tr').removeClass('odd_number even_number');
            table.find('tr:odd').addClass('odd_number');
            table.find('tr:even').addClass('even_number');
          }
        }else{
          if(obj.cur.attr('tag_id') == groups.cur_tag_id){
            if(!obj.cur.attr('checked')){
              var table = obj.cur.parents('table');
              obj.cur.parents('tr').remove();
              table.find('tr').removeClass('odd_number even_number');
              table.find('tr:odd').addClass('odd_number');
              table.find('tr:even').addClass('even_number');
            }
          }
          if(obj.check=='add'){
            if(obj.cur.parents('td').find('.gps .tags').text()=='未分组'){
              obj.cur.parents('td').find('.gps .tags').html(obj.cur.next().html());
            }else{
              obj.cur.parents('td').find('.gps .tags').html(obj.cur.parents('td').find('.gps .tags').html()+'，'+obj.cur.next().html());
            }
          }
        }
      };
    };
    this.addAppstoTag = function(){
      var applist = $('#applist');
      var nums = [];
      applist.delegate('.add-apps','click',function(){
        var arr = applist.find('input:checkbox[checked]');
        if(arr.length<1){
          alert('请选择要添加的应用');
        }else{
          arr.each(function(){
            nums.push($(this).attr('app_id'));
          })
          t.ajaxAddAppstoTag(nums);
        }
      })
    };
    //ajax function
    this.ajaxAddGroup = function(_t,o,callback){
      $.post('/app_tags?tag_name='+encodeURIComponent(o.tag_name)+'&app_id='+o.app_id,function(data){
        if(data.result=='success'){
          callback(data,o,_t);
        }else{
          alert(data.msg);
        }
      })
    };
    this.ajaxModifyGroupname = function(o,callback){
      $.post('/app_tags/'+groups.cur_tag_id, {"_method":"PUT", "tag_name": encodeURIComponent(o.tag_name)},function(data){
        if(data.result=='success'){
          callback(data);
        }else{
          alert(data.msg);
        }
      })
    };
    this.ajaxModifybelongs = function(o,callback){
      $.post('/app_tags/'+o.tag_id+'/assign_to_apps', {'act':o.check,'id':o.tag_id,'app_ids':o.app_ids},function(data){
        if(data.result=='success'){
          // callback(data);
        }else{
          alert(data.msg);
        }
      })
    };
    this.ajaxGetMrApplist = function(callback){
      $.getJSON('/app_tags/load_more_apps?page='+groups.pages,function(data){
        if(data.result == 'success'){
          callback(data);
        }else{
          alert(data.msg);
        }
      })
    };
    this.ajaxAddAppstoTag = function(nums){
      $.post('/app_tags/'+groups.cur_tag_id+'/assign_to_apps',{'act':'add','app_ids':nums},function(data){
        if(data.result!='success'){
          alert(data.msg);
        }else{
          window.location = location.pathname+'?tag='+groups.cur_tag_id;
        }
      })
    };

  };
  window.gl = new grouplist();
  gl.init();
  analytic.groups.list = analytic.groups.list.concat(gl.getGrouplist());
})(jQuery);
(function(){
  // remove layerX and layerY
  var all = $.event.props,
  len = all.length,
  res = [];
  while (len--) {
    var el = all[len];
    if (el != 'layerX' && el != 'layerY') res.push(el);
  }
  $.event.props = res;
})();
