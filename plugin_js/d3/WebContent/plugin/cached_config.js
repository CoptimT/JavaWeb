// JavaScript Document

jQuery(function ($) {
    var csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content');

    $.fn.extend({
        /**
         * Triggers a custom event on an element and returns the event result
         * this is used to get around not being able to ensure callbacks are placed
         * at the end of the chain.
         *
         * TODO: deprecate with jQuery 1.4.2 release, in favor of subscribing to our
         *       own events and placing ourselves at the end of the chain.
         */
        triggerAndReturn: function (name, data) {
            var event = new $.Event(name);
            this.trigger(event, data);

            return event.result !== false;
        },

        /**
         * Handles execution of remote calls firing overridable events along the way
         */
        callRemote: function () {
            var el      = this,
                method  = el.attr('method') || el.attr('data-method') || 'GET',
                url     = el.attr('action') || el.attr('href'),
                dataType  = el.attr('data-type')  || 'script';

            if (url === undefined) {
              throw "No URL specified for remote call (action or href must be present).";
            } else {
                if (el.triggerAndReturn('ajax:before')) {
                    var data = el.is('form') ? el.serializeArray() : [];
                    $.ajax({
                        url: url,
                        data: data,
                        dataType: dataType,
                        type: method.toUpperCase(),
                        beforeSend: function (xhr) {
                            el.trigger('ajax:loading', xhr);
                        },
                        success: function (data, status, xhr) {
                            el.trigger('ajax:success', [data, status, xhr]);
                        },
                        complete: function (xhr) {
                            el.trigger('ajax:complete', xhr);
                        },
                        error: function (xhr, status, error) {
                            el.trigger('ajax:failure', [xhr, status, error]);
                        }
                    });
                }

                el.trigger('ajax:after');
            }
        }
    });

    /**
     *  confirmation handler
     */
    var jqueryVersion = $().jquery;

    if ( (jqueryVersion === '1.4') || (jqueryVersion === '1.4.1') || (jqueryVersion === '1.4.2')){
      $('a[data-confirm],input[data-confirm]').live('click', function () {
          var el = $(this);
          if (el.triggerAndReturn('confirm')) {
              if (!confirm(el.attr('data-confirm'))) {
                  return false;
              }
          }
      });
    } else {
      $('body').delegate('a[data-confirm],input[data-confirm]', 'click', function () {
          var el = $(this);
          if (el.triggerAndReturn('confirm')) {
              if (!confirm(el.attr('data-confirm'))) {
                  return false;
              }
          }
      });
    }
    


    /**
     * remote handlers
     */
    $('form[data-remote]').live('submit', function (e) {
        $(this).callRemote();
        e.preventDefault();
    });

    $('a[data-remote],input[data-remote]').live('click', function (e) {
        $(this).callRemote();
        e.preventDefault();
    });

    $('a[data-method]:not([data-remote])').live('click', function (e){
        var link = $(this),
            href = link.attr('href'),
            method = link.attr('data-method'),
            form = $('<form method="post" action="'+href+'"></form>'),
            metadata_input = '<input name="_method" value="'+method+'" type="hidden" />';

        if (csrf_param != null && csrf_token != null) {
          metadata_input += '<input name="'+csrf_param+'" value="'+csrf_token+'" type="hidden" />';
        }

        form.hide()
            .append(metadata_input)
            .appendTo('body');

        e.preventDefault();
        form.submit();
    });

    /**
     * disable-with handlers
     */
    var disable_with_input_selector           = 'input[data-disable-with]';
    var disable_with_form_remote_selector     = 'form[data-remote]:has('       + disable_with_input_selector + ')';
    var disable_with_form_not_remote_selector = 'form:not([data-remote]):has(' + disable_with_input_selector + ')';

    var disable_with_input_function = function () {
        $(this).find(disable_with_input_selector).each(function () {
            var input = $(this);
            input.data('enable-with', input.val())
                .attr('value', input.attr('data-disable-with'))
                .attr('disabled', 'disabled');
        });
    };

    $(disable_with_form_remote_selector).live('ajax:before', disable_with_input_function);
    $(disable_with_form_not_remote_selector).live('submit', disable_with_input_function);

    $(disable_with_form_remote_selector).live('ajax:complete', function () {
        $(this).find(disable_with_input_selector).each(function () {
            var input = $(this);
            input.removeAttr('disabled')
                 .val(input.data('enable-with'));
        });
    });

});






//nav href to xp
(function($){
	$(document).ready(function(){
		jQuery('#xp').hover(
			function(){
				$(this).after('<div id="title" class="goto-xp"><div class="small-corner"></div>应用联盟</div>');
			},
			function(){
				$(this).next('#title').remove();
			}
		)
	})
})(jQuery);



/*
 * column
 */
;(function($){
 $(document).ready(function(){
  //fix sidebar style
  $('#siderNav .nav-items>li:last').addClass('item-bottom');
  
  window.fixColumn = function(){
    if($('.fix-column')){
      var $this = $('.fix-column'),len,panelWidth,m;
      var scrollbar = 0;
      if (document.documentElement.clientHeight < document.documentElement.offsetHeight){
        scrollbar = 1;
      }
      $this.each(function(){
        len = $(this).children('.col').length;
        m = $(this).attr("m");
        if(len>1){
          panelWidth = $(this).width()-m*(len-1) -len;
          $(this).children('.col').width(parseInt(panelWidth/len),10).css("margin-right",m+"px");
          $(this).children('.col:last').css("margin-right","0px");
        }
      })
    }
  }
	 fixColumn();
	 jQuery(window).resize(function(){
		 fixColumn();
	 });
 })
})(jQuery);




 /*
 menu
 */
;(function($){
	$('#siderNav .nav-item').bind('click',function(e){
		var $this = $(this);
		var ul = $this.find('.sub-list');
		if(!$this.hasClass('on')){
			if(ul.length > 0){
				ul.slideDown('fast',function(){
					$this.addClass('on');
				});
			}else{
				$this.addClass('on');
			}
			if($this.siblings('.on').find('.sub-list').length > 0){
				$this.siblings('.on').find('.sub-list').slideUp('fast',function(){
					$this.siblings('.on').removeClass('on');
				});
			}else{
				$this.siblings('.on').removeClass('on');
			}
		}
		e.stopPropagation();
	})
})(jQuery);





 /*
  this file for Static methods
 */
;(function($){
	$.extend($,{
		/*
		 *GetDate or Days
		 *version 1.1
		 * fix ie bug ===> - to /
		 *author linan
		 *@params  null number example : GetDate() return today
		 *@params number example : GetDate('-3') return array [3daysbefore,today]
		 *@params stringdate example : GetDate('2012-12-23') or getDate('2012.12.23') return number, days from arg0 to today
		 *@params two stringdate example : GetDate('2012-12-1','2012-12-23') return number, days from arg0 to arg1
		 *@params two example : $.GetDate('2012-02-23',-30) return string "2012-01-25"
		 */
		 GetDate : function(d1,d2){
			 var len = arguments.length;
			 var reg = /\d{4}([-./])\d{1,2}\1\d{1,2}/;
			 var dates = [];
			 var day,number;
			 var today = getToday();
			 switch(len){
				case 0 :
					 return getToday();
					 break;
				case 1:
					 if(reg.test(arguments[0])){
						 return getDays(arguments[0],getToday());
					 }else{
						 day = buildDate(arguments[0],today);
						 dates.push(day);
						 dates.push(getToday());
						 return dates;
					 }
					 break;
				case 2 :
					 if(reg.test(arguments[0]) && reg.test(arguments[1])){
						 number = getDays(arguments[0].replace(/-/g,'/'),arguments[1].replace(/-/g,'/'));
						 return number;
					 }else{
						 day = buildDate(arguments[1],arguments[0]);
						 return day;
					 }
					  break;
			 }
			 function getDays(arg,day){
				 var value = new Date(day) - new Date(arg.replace(/\b(\w)\b/g, '0$1'));
				 if(value<0){
					 return "Wrong Date";
				 }else{
					 return parseInt(value/(1000*3600*24)+1,10);
				 }
			 };
			 function getToday(){
 				var date = new Date();
 				this.Day = date.getDate();
 				this.Month = date.getMonth()+1;
 				this.Year = date.getFullYear();
 				return (this.Year.toString()+'-'+this.Month.toString()+'-'+this.Day.toString()).replace(/\b(\w)\b/g, '0$1');;
 			};
			function buildDate(num,day){
				var n = num;
				if(typeof(n) == String){
					parseInt(n,10);
				}
				if(n >= 0){
					return getToday();
				}else{
					var someDay = new Date(new Date(day.replace(/\-/g,'/'))-0+(n+1)*86400000); 
					
					someDay = someDay.getFullYear() + "-" + (someDay.getMonth()+1) + "-" + someDay.getDate();
					return someDay.replace(/\b(\w)\b/g, '0$1');
					
				}
			}
		 },
		 /*
		 *replace Date '-' to '.'
		 *@param date example :$.replaceDate('2012-01-01')
		 *return 2012.01.01
		 */
		 replaceDate : function(mydate){
			 return mydate.replace(/-/g,'.');
		 }
	})
})(jQuery);





/*
 *@Char Filter 1.0 
 *@author luxueyan
 */
;(function($){
	//数据筛选
	$.extend({
		dataFilter : function(data,keyWord){
			if(typeof data == 'object' && keyWord != ''){
				return $.map(data,function(val,index){
					var toLower = val.name;
					if(!!~toLower.toLowerCase().indexOf(keyWord.toLowerCase())){
						return val;
					}
				});
			}else{
				return '';
			}
		}
	});
})(jQuery);



/*
 * init glogbal variable
 */
 window.UMENG = {};
 window.UMENG.plugin = {};
 window.global = {} || "";
 window.global.pickedStartDay = $('.dateselect .start').text().replace(/\./g,'-');
 window.global.pickedEndDay = $('.dateselect .end').text().replace(/\./g,'-');
 window.global.pickedDays = $.GetDate(global.pickedStartDay,global.pickedEndDay);
 window.global.filter = {};
 window.global.filter.version = '';
 window.global.filter.channel = '';
 window.global.filter.segment ='',
 window.global.action_stats = $('#action_stats').val();
 window.global.time_unit = '';
 if($('#app_id').length>0){
	 window.global.appid = $('#app_id').attr('attr-id');
 }
 // for components registration, { 'group_id:component_id' : component_refer}
 window.global.components = {}
/*
 *set datepicker default settings
 */
;(function($){
	$.datepicker.regional['zh-CN'] = {
		closeText: '关闭',
		//prevText: '&#x3c;',
		//nextText: '&#x3e;',
		prevText: '',
		nextText: '',
		currentText: '',
		monthNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		weekHeader: '周',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: ' .'};
	$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
})(jQuery);

/**
 *Tips
 */
 ;(function($){
 	$.fn.Tips = function(options){
	return this.each(function(){
			var inst = $(this);
			var defaults = {
				modal : !1
			};
			var settings = $.extend({},defaults,options);
			if(typeof(options) == "string"){
			inst.dialog(options);	
			}else{
			inst.dialog(settings);	
			}
		})
	}
 })(jQuery);
 /*
  *hidePopFrame
  */
(function($){
	window.hidePopFrame= function(inst){
		$('.app-container').hide();
		if(arguments.length>0){
			$('.select-body').not(arguments[0]).hide();
		}else{
			$('.select-body').hide();
		}
		$('.filterpanel').hide();
		$('#proTemp').hide();
	  $('#proTemp2').hide();
		$('.singledate').hide();
		$('#dateSelPanel').hide();
		$('.pop_body').hide();
	};
})(jQuery);
/*
* stopBubble
*/
function stopBubble(e) {
	//如果提供了事件对象，则这是一个非IE浏览器
	if ( e && e.stopPropagation )
	//因此它支持W3C的stopPropagation()方法
	e.stopPropagation();
	else
	//否则，我们需要使用IE的方式来取消事件冒泡
	window.event.cancelBubble = true;
};

/**
*it can be get the height of a DOM when the DOM is hide; 
*/
var getDimensions = function(element) {  
    element = $(element);  
    var display = $(element).css('display');  
    if (display != 'none' && display != null) // Safari bug  
      return {width: element.offsetWidth, height: element.offsetHeight};  
  
    // All *Width and *Height properties give 0 on elements with display none,  
    // so enable the element temporarily  
    var originalVisibility = element.css('visibility');  
    var originalPosition = element.css('position'); 
    var originalDisplay = element.css('display'); 
    element.css('visibility','hidden');  
    element.css('position','absolute');  
    element.css('display','block');  
    var originalWidth = element.width();  
    var originalHeight = element.height();
    element.css('visibility',originalVisibility);  
    element.css('position',originalPosition);  
    element.css('display',originalDisplay); 
    return {width: originalWidth, height: originalHeight};  
  };
/**
 *it can be used to replace the windows.confirm
 */
function confirm_msg(title,str,callback){
	$('<div>'+str+'</div>').dialog({title:title, buttons: [
		{
			text: "确认",
			click: function() { $(this).dialog("close"); callback(); }
		},		
		{
			text: "取消",
			click: function() { $(this).dialog("close");}
		}

	]});
};
/**
 *it can be used to replace the windows.alert
 */
(function($){
	window.alert = $.alert = function(msg,time){
	
		if(arguments.length<=0 || msg == undefined){
			msg = "";
		}
		var randomnum = parseInt(Math.random()*1000000000);
		if(time>0){
			$('<div id="temp_alert_box'+randomnum+'">'+msg+'</div>').Tips({title:"提示",width:300});
			setTimeout(function(){
				$('#temp_alert_box'+randomnum).Tips("close");
				$('#temp_alert_box'+randomnum).parent(".ui-dialog").remove();
				$('#temp_alert_box'+randomnum).remove();
			},time);
		}else{
			$('<div id="temp_alert_box">'+msg+'</div>').dialog({title:"提示",width:397,modal:true, buttons: [
			{
				text: "确认",
				click: function() { $(this).dialog("close");}
			}]});		
		}
	};
})(jQuery);
/*
 *Pop Tips
 */
/*
$(document).delegate('.poptips','click',function(){
	var _ = $(this);
	var panel = $('#'+_.attr('action-frame'));
	if(panel.length>0){
		panel.Tips({title: _.attr('title')});
	}
})
*/

/*
 *ShowSummary
 */
window.showSummary = function(mod,data){
	if(arguments.length>1){
		var parent = mod.parent();
		parent.css('position','relative');
		parent.find('.chart-summary').remove();
		parent.append('<div class="chart-summary chart-hide"><div  class="pop-summary"><a href="#"></a></div><p style="padding-top:30px;">'+data.name+': </p><p class="skimnum" style="padding-top:10px;">'+ data.value +'</p></div>');
	}
	$('.chartpanel').delegate('.chart-hide','click',function(){
		$(this).animate(
			{
				'right' : '-25px'
			},
			'fast',
			function(){
				$(this).removeClass('chart-hide').addClass('chart-show');
			}
		);
		return false;
	})
	$('.chartpanel').delegate('.chart-show','click',function(){
		$(this).animate(
			{
				'right' : '-188px'
			},
			'fast',
			function(){
				$(this).removeClass('chart-show').addClass('chart-hide');
			}
		);
		return false;
	})
	
};
//
$('.expandCollapse').bind('click',function(){
	var id = $(this).attr('expand-id');
	var obj =$('#'+id);
	if(obj.is(":visible")){
		obj.addClass('hidden');
		$(this).parent().css('border-top','0px');
		$(this).text('展开明细数据');
	}else{
		obj.removeClass('hidden');
		if(obj.find('.pagination').html() !=''){
			$(this).parent().css('border-top','1px solid #B4B4B4');
			obj.find('.pagination').removeClass('hidden');
		}else{
			obj.find('.pagination').addClass('hidden');
			$(this).parent().css('border-top','0px');
		};
		$(this).text('收起明细数据');
	}
	return false;
});
//cookie
function cookie_get(k) {
    var h = document.cookie.split("; ");
    g = h.length;
    f = [];
    for (var j = 0; j < g; j++) {
        f = h[j].split("=");
        if (k === f[0]) {
            return unescape(f[1]);
        }
    }
    return null;
}

function cookie_set(f, g,del) {
    var h = new Date();
    if(!del){
         h.setDate(h.getDate() + 365);
     }else{
        h.setDate(h.getDate() - 10);
     }
    document.cookie = f + "=" + escape(g) + "; expires=" + h.toGMTString()+"; path=/";
}
//Tooltip
;(function($){
	$('body').delegate('a[action-frame]','mouseover',function(){
		$('#'+$(this).attr('action-frame')).fadeIn().css({left:$(this).offset().left+35,top:$(this).offset().top-12});
	})
	$('body').delegate('a[action-frame]','mouseout',function(){
		$('#'+$(this).attr('action-frame')).fadeOut();
	})
	$('#website-tip').click(function(){
    var tip_id = $(this).attr('id');
    if($(this).hasClass('notice')){
      $(this).removeClass('notice');
      $('.website-tip-content').hide();
      cookie_set('cookie_notice#'+tip_id, true);
    }else{
      $(this).addClass('notice');
      $('.website-tip-content').show();
      cookie_set('cookie_notice#'+tip_id, false,true);
    }
    return false;
	});
  $('.cookie_notice').each(function(){
    var tip_id = $(this).attr('id');
    if($('#website-tip').siblings('a').length == 1){
      $(this).next('.website-tip-content').find('.corner').css('left','200px')
    }
    if (!(cookie_get('cookie_notice#'+tip_id) == 'true')) {
      $(this).addClass('notice');
      $('.website-tip-content').show();
    }else{
      $(this).removeClass('notice');
      $('.website-tip-content').hide();
    }
  });
})(jQuery);

//image scroll 
//轮换start
(function($){
	$(window).load(function(){
	  function initSlider(){
		window.slideshow=new TINY.slider.slide('slideshow',{
			id:'slider',
			auto:false,
			flag:'off',
			resume:true,
			vertical:false,
		  navid:'paginationNew',
			activeclass:'current',
			position:0,
			rewind:false,
			elastic:false,
			left:'slideleft',
			right:'slideright'
		});
	  };
	  if(!cookie_get('cookie_new_divide')){
		$('.panel-slider').show();
		cookie_set('cookie_new_divide',true);
	  }
	  if(!window.slideshow){
		if($('.panel-slider').is(':visible')){
		  initSlider();
		}
	  }
	  $('#newDivide').bind('click',function(){
		window.hidePopFrame();
		if($('.panel-slider').is(':visible')){
		 $('.panel-slider').slideUp('fast');
		 cookie_set('cookie_new_divide',false);
		}else{
		  $('.panel-slider').slideDown('fast',function(){
			if(!window.slideshow){
			  initSlider();
			}
		  });
		}
	  });
	  $('.panel-slider #btnClose').bind('click',function(){
		$('.panel-slider').slideUp('fast');
		cookie_set('cookie_new_divide',false);
	  })
	});
})(jQuery);
//轮换end

function _track_components_usage(){
  try{
    var filter_label = (global.filter.version === '' ? '' : '版本 ') + (global.filter.channel === '' ? '' : '渠道 ') + (global.filter.segment === '' ? '' : '顾客群');
    var date_length = $.GetDate(global.pickedStartDay, global.pickedEndDay);
    if( window._gat != undefined){
      if( filter_label != '' ){
        _gaq.push(['_trackEvent','组件', '过滤器', filter_label] );
      }
      _gaq.push(['_trackEvent','组件', '时间选择', '天数', date_length] );
    }
    //console.log(filter_label + ' ' + date_length);

  }catch(e){}
}
function _track_nav_bar(category, label){
  try{
    _gaq.push(['_trackEvent','导航', category, label]);
  }catch(e){}
}
// send login log to op
function loginlog(user_id)
{
  try{
    var login_date = cookie_get('um_login_date_' + user_id);
    var today_date = new Date().toDateString();
    if(today_date != login_date)
    {
      cookie_set('um_login_date_' + user_id, today_date);
      $.getJSON("http://2op.umeng.us/loginlogs/add?userid="+user_id+"&callback=?",function(d){});
    }
  }catch(e){}
}
function parseScientific(dest, length, digit){
  if(typeof(length) == 'undefined'){
    length = 5;
  }
  if(typeof(digit) == 'undefined'){
    digit = 2;
  }
  if(dest.toString().length < length){
    return dest;
  }
  return parseFloat(dest).toExponential(digit);
};



//user for constast channel ;filter channel ,version ,seq.
var Filter = function(){
	var that = this;
	this.version = '1.1';
	this._show = function(inst,settings){
		settings.panel.bind('click',function(e){
			if(e.target != e.currentTarget){
				stopBubble(e);
			}
		})
		settings.input = settings.panel.find('input.input');
		settings.input.val('');
		if(inst.data('checked') == undefined || inst.data('checked').check == false){
			//showDefault
			that.templ(settings,settings.templDefault,inst.data('datas'));
		}else if(inst.data('checked').check == true){
			//showSelect
			that.templ(settings,settings.templchecked,inst.data('datas'));
		}else{
			//showDefault
			that.templ(settings,settings.templDefault,inst.data('datas'));
		}
		that.search(inst,settings);
		that.checkItem(inst,settings);
	};
	this.templ = function(settings,temp,datasource){
		var container = $(settings.panel).find('.filterlist');
		container.html('');
		if(datasource != ""){
			$.template("temp",temp);
			$.tmpl("temp",datasource).appendTo(container);
		}
		return container;
	};
	this.checkItem = function(inst,settings){
		var id = "";
		var datas = inst.data('datas');
		inst.next().find('.filterlist input').unbind('click');
		inst.next().find('.filterlist input').bind('click',function(e){
			if(this.checked){
				id = $(this).attr('id');
				for(i in datas){
					if(datas[i].id == id){
						datas[i].check = this.checked;
						inst.data('checked',datas[i]);
					}else{
						datas[i].check = false;
					}
				}
				if(inst.data('checked')){
					$(this).parent().siblings().find('input').each(function(){
						this.checked = false;
					})
				}
			}else{
				id = $(this).attr('id');
				for(i in datas){
					if(datas[i].id == id){
						datas[i].check = this.checked;
					}
				}
				that.getDataSet(inst,settings,that._show);
			}
			e.stopPropagation();
		})
	};
	this.submits = function(inst,settings){
		settings.panel.delegate('a.submit','click',function(){
			if(inst.data('checked') != undefined){
				settings.panel.hide();
				if(inst.data('checked').check){
				  inst.text(inst.data('checked').name).parent().addClass('on');
				}else{
				  inst.text(settings.text);
				  inst.parent().removeClass('on');
				}
				settings.callback(inst,inst.data('checked'));
			}
			return false;
		})
	};
	this.search = function(inst,settings){
		settings.panel.delegate('input.input','keyup',function(){
			var v = $(this).val();
			if(v !=''){
				var data = $.dataFilter(inst.data('datas'),v);
				that.templ(settings,settings.templSearch,data);
			}else{
				inst.data('checked')== undefined ? 
					that.templ(settings,settings.templDefault,inst.data('datas')) : 
					that.templ(settings,settings.templDefault,inst.data('datas'));
			}
			that.checkItem(inst,settings);
		})
		$('.input').live('click',function(e){
			e.stopPropagation();
		})
	};
	this.getDataSet = function(inst,settings,callback){
		if(!inst.data('datas')){
			$.ajax({
				url : settings.url,
				type : 'get',
				success : function(data){
					if(data.result == 'success'){
						inst.data('datas',data.datas);
						settings.panel.find('.load').remove();
            var filter = global.filter[inst.attr('id').split('-')[1]];
            if(filter != '' || undefined){
              for(i in inst.data('datas')){
                if(inst.data('datas')[i].id == filter){
                  var checkedItem = inst.data('datas')[i];
                  checkedItem.check = true;
                  inst.data('checked',checkedItem);
                }
              }
            };
						callback(inst,settings);
					}else if(data.result == 'failed'){
						settings.panel.find('.load').html(data.msg);
						
					}
				}
			})
		}else{
			callback(inst,settings);
		}
	};
	this.getjQdom = function(id){
		return $('#'+id);
	}
	return {
		data : that.dataSet,
		init : function(target,options){
			var inst = $(target);
			var defaults = {
				panelid : 'filter',
				panel : '',
				text : '',
				templDefault : '{{if is_shown}}<li><input type="checkbox" id="${id}" {{if check}}checked=${check}{{/if}}/>${name}</li>{{/if}}',
				templSearch : '<li><input type="checkbox" id="${id}" {{if check}}checked=${check}{{/if}}/>${name}</li></li>',
				templchecked :  '{{if check}}<li><input type="checkbox" id="${id}" checked="${check}"/>${name}</li>{{/if}}',
				panelTempl : '<div class="filterpanel" style="display:none;"><input type="text" class="input" placeholder="搜索全部"/><ul class="filterlist"></ul><div class="load" style="margin:10px auto;text-align:center;display:block;"><img src="images/ajax-loader.gif"/></div><div class="submitpanel"><a href="#" class="submit">确定</a></div></div>'
			};
			var settings = $.extend({},defaults,options);
			settings.panelTempl = settings.panelTempl.replace('placeholder="搜索全部"','placeholder="搜索全部'+settings.text+'"');
			inst.after(settings.panelTempl);
			inst.next()[0].id = settings.panelid;
			settings.panel = that.getjQdom(settings.panelid);
			inst.bind('click',function(e){
				var particle =  $('#period').renderTab('get_status');
				if(particle == 'hourly'){
					alert('no data');
					return false;					
				}
				if(settings.panel.is(':hidden')){
					window.hidePopFrame();
					settings.panel.show();
					that.getDataSet(inst,settings,that._show);
				}else{
					settings.panel.hide();
				}
				return false;
			})
			that.submits(inst,settings);
		},
		Set : function(inst,id,value){
			var datas = inst.data('datas');
			var checked = inst.data('checked');
			if(datas == undefined){
				return 'datas can not defined';
			}
			if(checked == undefined){
				if(arguments.length >2){
					for(i in datas){
						if(id == datas[i].id){
							inst.data('checked',datas[i]);
						}
					}
				}else{
					inst.data('checked','');
					inst.text(arguments[1]);
				}
			}else{
				if(arguments.length >2){
					for(i in datas){
						if(value){
							if(datas[i].cid==id){
								datas[i].check = value;
							}else{
								datas[i].check = !value;
							}
						}else{
							if(datas[i].cid==id){
								datas[i].check = value;
							}
							inst.data('checked') = '';
						}
						return datas;
					}
				}else{
					inst.removeData('checked');
					inst.text(arguments[1]);
					inst.parent().removeClass('on');
					for(i in datas){
						datas[i].check = false;
					}
				}
			}
			
		},
		Get : function(inst){
			var text = inst.text();
			var data = inst.data('datas');
			for(i in data){
				if(data[i].name == text){
					return data[i];
				}else{
					
				}
			}
		}
	}
}
UMENG.plugin.Filter = new Filter();
$.fn.Filter = function(options){
	if(typeof(options) == 'object'){
		return this.each(function(){
			UMENG.plugin.Filter.init(this,options);
		})
	}else{
		return this;
	}
};


/*
 *ProSelect 1.0
 *@author linan
 *Depends:
 *jQuery,modules
*/
;(function($){
	var datePickerArray = {
		startDay : $('.dateselect .start').text().replace(/\./g,'-'),
		endDay : $('.dateselect .end').text().replace(/\./g,'-')
	};
	var date = new Date();
	window.thisYear = date.getFullYear();
	$.fn.ProSelect = function(options){
		if(this.length >0){
			var $this = this;
			var defaults = {
				show : false,
				x : $this,
				targettext : $this.text(),
				muti : false,
				temp : '<div id ="proTemp">test</div>',
				tempid : 'proTemp',
			        inputname : ['最近60天','最近30天','最近7天','今天'],
			        inputval : ['-60','-30','-7','-1'],
			        custom : true,
				callback : ''
			};
			if(options){
				var set = $.extend(false,{},defaults,options);
			}
			$this.set = set;
			init($this,set);
		$.extend($.fn.ProSelect.prototype,{
		  alert : function(){console.log(set)},
      buildmodule : function(){
        if(set.temp){
          if(set.inputname.length == set.inputval.length){
            var _temp = '<div id ="'+ set.tempid +'"><ul>';
            for(i=0;i<set.inputname.length;i++){
              var val  = set.inputval[i] == '' ? 'custom' :  set.inputval[i];
              _temp += '<li set-value="'+ val +'">' + set.inputname[i] + '</li>'
            }
            _temp += '</ul></div>';
          }
        }
        return _temp;
      },
      bindclick : function($this){
        var $t = $this;
        $('#'+set.tempid).find('li').each(function(){
          $(this).live('click',function(){
            if($(this).attr('set-value')!=''){
              var n = $(this).attr('set-value');
              var days = $.GetDate(parseInt(n));
              $t.html('<span class="start">'+$.replaceDate(days[0])+'</span>' + ' - ' + '<span class="end">'+$.replaceDate(days[1])+'</span><b class="icon pulldown"></b>');
              $('#'+set.tempid).hide();
              window.global.pickedStartDay = days[0];
              window.global.pickedEndDay = days[1];
              window.global.pickedDays = Math.abs(n);
              $t.set.callback(days,window.global.pickedDays);
            }else{
              $('#datepickerStart').show();
            }
            return false;
          })
        })
      },
			datepickerInit : function(){
				$("#datepickerStart").datepicker({
					dateFormat: "yy-mm-dd",
					inline: true,
					defaultDate:datePickerArray.startDay,
					maxDate : +0,
					yearRange: '2000:'+window.thisYear,
					onSelect: function(dateText, inst,e) {
						$("#datepickerEnd").datepicker('option','minDate',dateText);
						datePickerArray.startDay = dateText;
						return false;
					}
				});
				$("#datepickerEnd").datepicker({
					dateFormat: "yy-mm-dd",
					inline: true,
					defaultDate:datePickerArray.endDay,
					maxDate : +0,
					yearRange: '2000:'+window.thisYear,
					onSelect: function(dateText, inst,e) {
						$("#datepickerStart").datepicker('option','maxDate',dateText);
						datePickerArray.endDay = dateText;
						return false;
					}
				});
			}
		})
		_setDefault(set);
		return $this;
		}
	}
	var init = function($this,op){
		$this.bind('click',function(){
			if(!$('#'+op.tempid).is(':visible')){
				window.hidePopFrame();
				if(!$this.next().is('#'+op.tempid)){
					$this.after($this.ProSelect.prototype.buildmodule);
					_custom($this,op);
					$this.ProSelect.prototype.bindclick($this);
				}else{
					$('#'+op.tempid).show();
				}
			}else{
				$('#'+op.tempid).hide();
			}
			op.show = true;
			$('.ui-datepicker-calendar').live('click',function(e){
				e.stopPropagation();
			});
			$('.ui-datepicker-header').live('click',function(e){
				e.stopPropagation();
			})
			return false;
		})
	};
	function _custom($this,op){
		if(op.custom){
			var tmp = '<a class="customhref" href="#">自选</a><div id="datePickerPanel" style="display:none;"><div id="datepickerStart"></div><div id="datepickerEnd"></div><input type="button" value="确定" class="custombtn" style="clear:both;display:block"/></div>';
			$('#'+op.tempid).append(tmp);
			$('.customhref').bind('click',function(){
				$(this).next().show();
				$this.ProSelect.prototype.datepickerInit();
				return false;
			})
      $('.custombtn').bind('click',function(){ 
        $('#'+op.tempid).hide();
        $('#datePickerPanel').hide();
        op.show = false;
        window.global.pickedStartDay = datePickerArray.startDay;
        window.global.pickedEndDay = datePickerArray.endDay;
        window.global.pickedDays = $.GetDate(datePickerArray.startDay,datePickerArray.endDay);
        $this.find('.start').html($.replaceDate(datePickerArray.startDay));
        $this.find('.end').html($.replaceDate(datePickerArray.endDay));
        op.callback([datePickerArray.startDay,datePickerArray.endDay],window.global.pickedDays);
        return false;
      })
		}
	};
	var _setDefault = function(op){
		$(document).bind('click',function(e){
			if($(e.target).parents('table.ui-datepicker-calendar').length > 0 || $(e.target).parents('#datePickerPanel').length > 0 || $(e.target).parents('.ui-datepicker-header').length > 0){
				return false;
			}else{
				$('#'+op.tempid).hide();
				$('#datePickerPanel').hide();
				op.show = false;
			}
		})
	};
})(jQuery);



;(function($){
	var moudle_func = {
		init : function(options) {
			var settings = $.extend({
				data             : "",
				default_type     : "",
				disable_type     : "",
				default_class    : "on",  
				disable_class    : "off",        
				callback         : "",
				template         : "<li particle=${particle} flag=${flag} class={{if flag=='false'}}off{{/if}}>${name}</li>"
			}, options);  
			$.template( "period", settings.template );
			$.tmpl( "period",settings.data ).appendTo( this );
			var $this = this;
			$this.delegate( $(this).children(), 'click', function(e) {
					if( $(e.target).attr("flag") == "true" ) {
						$this.children().removeClass( settings.default_class );
						$(e.target).addClass("on");
						if( typeof(settings.callback) == "function" ) {
							settings.callback( $(e.target), $(e.target).attr("particle"), $(e.target).index(), $(e.target).text() );
						}
						
					}					
			});
			//默认type绑定class.each函数中的$(this)指的是调用init的对象，if内部的$(this)指的是$(this).children()列表中的项
			$.each( $(this).children(), function(){
				if( settings.default_type == $(this).attr("particle") ) {
					$(this).addClass( settings.default_class );
				}
				if( settings.disable_type == $(this).attr("particle") ) {
					$(this).addClass( settings.disable_class );
					$(this).attr( "flag", "false"); 
				}
			})
		},
		get_status: function(){
			var el = this.children(".on");
			return el.attr('particle');
		},
		set_status: function( options ) {
			var settings = $.extend({
				'disable_class': 'off',
				'default_class': 'on',
				'disable_arr'  : '',
				'able_arr'     : '',
				'current_item' : '',
				'target_obj'   : this.children(),
				'current_obj'  : {}
			}, options);
				$.each( settings.target_obj, function(i) {
					settings.current_obj[i] = $( this ).attr("particle");
				})
				$.each( settings.disable_arr,function(i,value) {
					for( var m in settings.current_obj ) {
						if( value == settings.current_obj[m] ) {
							$( settings.target_obj[m] ).removeClass(settings.default_class);
							$( settings.target_obj[m] ).addClass( settings.disable_class );
							$( settings.target_obj[m] ).click(function(){
								$(this).attr( "flag", "false"); 
							})
						}
					}
				})
				$.each(settings.able_arr, function(i,value) {
					for( var m in settings.current_obj ) {
						if( value == settings.current_obj[m] ) {
							$( settings.target_obj[m] ).removeClass( settings.disable_class );
							$( settings.target_obj[m] ).click(function(){
								$(this).attr( "flag", "true"); 
							})
						}
					}
				})	
				$.each( settings.current_obj, function(i, value) {
						if( settings.current_item != "" && settings.current_item == value ) {
							$( settings.target_obj[i] ).addClass( settings.default_class );
							$( settings.target_obj[i] ).siblings().removeClass( settings.default_class );
						}
					}) 	

		}
	}
	$.fn.extend({
		"renderTab" : function(method){
		if( moudle_func[method] ) {
			return moudle_func[method].apply( this, Array.prototype.slice.call( arguments, 1 ) )
		}else if( typeof method === 'object' || !method ) {
			return moudle_func.init.apply( this, arguments );
		}else{
			return false;
		}
	}
	})
})(jQuery);




var Contrast = function(){
	var _this = this;
	this.PluginName = "Contrast";
	this.Version = '1.0';
	global.contrast = [];
	this.getStartDay = function(){
		var startday = window.global.pickedStartDay;
		return startday;
	};
	this.getEndDay = function(){
		var endday = window.global.pickedEndDay;
		return endday;
	};
	this.getDays = function(){
        	var days = window.global.pickedDays;
		return days;
	};
	this.tab = function(n,settings){
		var tar = settings.panel;
		if(n<=7){
			tar.find('.tabs li').removeClass('showoff');
			tar.find('.lastmonth').addClass('on').siblings().removeClass('on');
		}else if(n>7 && n<=30){
			tar.find('.showoff').removeClass('showoff');
			tar.find('.lastmonth').addClass('on');
			tar.find('.lastweek').addClass('showoff');
		}else{
			tar.find('.tabs li').addClass('showoff');
		}
	};
	this.getId = function(panelId){
		var target = $('#'+ panelId);
		return target;
	}
	this.showDatePicker = function(settings){
		var defaultDate = $.GetDate(window.global.pickedEndDay,-31);
		settings.panel.find('.myEndDate').datepicker({
			dateFormat: "yy-mm-dd",
			inline: true,
			defaultDate:defaultDate,
			maxDate : +0,
			setDate : '',
			yearRange: '2000:'+window.thisYear,
			onSelect : function(dateText, inst){
				var selected = dateText;
				var days = _this.getDays();
				var sday = $.GetDate(selected,0-days);
				global.contrast = [sday,selected];
				settings.panel.find('.startday').text($.replaceDate(sday));
				settings.panel.find('.endday').text($.replaceDate(selected));
				return false;
			}
		})
		settings.panel.find('.myEndDate').datepicker('setDate',defaultDate);
	}
	this.initPanel = function(settings){
		var days = _this.getDays();
		var sday = _this.getStartDay();
		var eday = _this.getEndDay();
		var domdays = settings.panel.find('.days');
		var domsday = settings.panel.find('.startday');
		var domeday = settings.panel.find('.endday');
		var newsday = $.GetDate(sday,-31);
		var neweday = $.GetDate(eday,-31);
		global.contrast = [newsday,neweday];
		domdays.text(days);
		domsday.text($.replaceDate(newsday));
		domeday.text($.replaceDate(neweday));
		_this.tab(days,settings);
		_this.showDatePicker(settings);
		_this.bindEvent(settings,days,eday,domdays,domsday,domeday);
		_this.bindSubmit(settings);
		return false;
	};
	this.bindEvent = function(settings,days,eday,domdays,domsday,domeday){
		var setdate = "";
		var dom = settings.panel;
		settings.panel.find('.tabs li.lastmonth a').bind('click',function(e){
			setdate = $.GetDate(eday,-31);
			newsday = $.GetDate(setdate,0-days);
			domsday.text($.replaceDate(newsday));
			domeday.text($.replaceDate(setdate));
			dom.find('.myEndDate').datepicker('setDate',0).datepicker('setDate',-30);
			global.contrast = [newsday,setdate];
			$(this).parent().addClass('on').siblings().removeClass('on');
			return false;
		});
		settings.panel.find('.tabs li.lastweek a').bind('click',function(e){
			setdate = $.GetDate(eday,-8);
			newsday = $.GetDate(setdate,-days);
			domsday.text($.replaceDate(newsday));
			domeday.text($.replaceDate(setdate));
			dom.find('.myEndDate').datepicker('setDate',0).datepicker('setDate',-7);
			global.contrast = [newsday,setdate];
			$(this).parent().addClass('on').siblings().removeClass('on');
			return false;
		})
		settings.panel.bind('click',function(e){
			e.stopPropagation();
		})
	};
	this.bindSubmit = function(settings){
		settings.panel.find('.submit').unbind('click').bind('click',function(){
      $('#'+settings.contrastTo).after('<div class="loadingChart"><img src="images/ajax-loader.gif" /></div>');
			settings.callback(global.contrast);
			settings.panel.hide();
		})
	};
	this.popFrame = function(dom,settings){
		if(settings.panel.is(':hidden')){
			settings.panel.show();
			_this.initPanel(settings);
		}else{
			settings.panel.hide();
		}
	
	};
	return {
		PluginName : _this.PluginName,
		Version : _this.Version,
		init : function(target,options){
			var dom = $(target);
			var defaults = {
				panelid : 'ContrastPanel',
        contrastTo:'chartcontainer',
				templ : '<div class="mod singledate" id="${panelid}" style="display:none">\
						<div class="mod-header clearfix"><h2><span class="startday">2012.12.23</span> - <span class="endday">2012.12.24</span></h2><div class="option">(<span class="days"></span>天)</div></div>\
						<div class="mod-body">\
							<div class="">\
								<div class="tabs">\
									<ul class="clearfix">\
										<li class="lastmonth"><a href="#">上月同期</a></li>\
										<li class="lastweek"><a href="#">上周同期</a></li>\
									</ul>\
								</div>\
								<div class="myEndDate">\
								</div>\
								<div class="form">\
								选择对比时段的终点<input type="button" class="submit"  value="确定"/>\
								</div>\
							</div>\
						</div>\
					</div>'
			}
			var settings = $.extend({},defaults,options);
			$.template("temp",settings.templ);
			dom.after($.tmpl("temp",settings));
			settings.panel = _this.getId(settings.panelid);
			dom.bind('click',function(){
				window.hidePopFrame();
				_this.popFrame(dom,settings);
				return false;
			})
		}
		
	}
};
UMENG.plugin.Contrast = new Contrast();
$.fn.Contrast = function(options){
	return this.each(function(){
		UMENG.plugin.Contrast.init(this,options);
	})
};



/*  TableRender Plugin
 *  
 **/
;(function($){
 $.fn.renderTable = function(options){
   return this.each(function(){
     var inst = $(this);
     var tempname = new Date().getTime().toString();
     var table = inst.find('tbody');
     var loading_icon = inst.find('.wait-load');
     var pagination_nav = inst.find(".pagination");
     var defaults = {
       url : '',
       data : '',
       params : {page: 1},
       per_page: 20,
       temp : '<tr><td>${date}</td><td>${data}</td><td>${rate}</td></tr>',
       callback : function(){
         return false;
         //animatable();
       }
     };
     var settings = $.extend(true,{},defaults,options);
     // set template of table
     $.template(tempname,settings.temp);
            
     if( settings.data == '' ){
       loading_icon.html('<img src="images/ajax-loader.gif" />').show();
       $.ajax({
         url:settings.url,
         data:settings.params,
         dataType : 'json',
         success:function(data){
           var history = table.children();
           if(data.result == 'success'){
             loading_icon.hide();
             settings.data = data.stats;
             $.tmpl(tempname,settings.data).appendTo(table);
             history.remove();
             fixColumn();
             /* pagination */
             inst.find('.mod-bottom').hide();
             if(data.total > settings.per_page){
               inst.find('.mod-bottom').show();
               pagination_nav.pagination(data.total,{
                 items_per_page: settings.per_page,
                 current_page: parseInt(settings.params['page']) - 1,
                 callback: function( current_page, dom ){
                   $('table').trigger('update');
                   $('table').trigger('destroy'); 
                   inst.renderTable(
                     $.extend(true, {}, options, {
                       params : {
                         page : current_page + 1
                       },
                       callback:function(){
                         inst.find('.tableSorter').tablesorter();
                       }
                     })
                   );
                   return false;
                 }
               });
             }else{
               inst.find(".pagination").html('');
               inst.find('.mod-bottom').hide();
             }

             settings.callback( inst, data);
           }else{
             table.html('');
             inst.find(".pagination").empty();
             inst.find('.wait-load').html('<div style="text-align:center;text-indent:0px;">'+data.msg+'</div>');
           }
         } // end success
       });
     }else{  // else of if( settings.data == '' )
     // using data in setting options to render table
     table.empty();
     $.tmpl(tempname,settings.data).appendTo(table);
     fixColumn();
     settings.callback(inst, settings.data);
   }
 });
}
	/*
	*	$('parentPage').animatable({
	*		switch_to: $('detailPage'),
	*		callback:function(){}
	*	})
	*/
  $.fn.animatable = function(options){
    return this.each(function(){
      var origin = $(this);
      var defaults = {
        switch_to : $('#child-table'),
        callback : ''
      };
      var settings = $.extend({},defaults,options);
      var w1 = origin.width();
      origin.addClass('fl').width(w1);
      origin.wrap("<div class='pannelshow'></div>");
      origin.wrap("<div class='pannel clearfix'></div>");
      var pannel = origin.parent();
      settings.switch_to.appendTo(pannel);
      pannel.width('5000px');
      var targetHeight = getDimensions(settings.switch_to).height+$('body').height()-origin.height();
      if(targetHeight > document.documentElement.clientHeight && document.documentElement.clientHeight >= document.body.clientHeight){
        settings.switch_to.addClass('fl').width(w1-20);
      }else if(targetHeight <= document.documentElement.clientHeight && document.documentElement.clientHeight <= document.body.clientHeight){
        settings.switch_to.addClass('fl').width(w1);
      }else{
        settings.switch_to.addClass('fl').width(w1);
      }

      settings.switch_to.show();
      pannel.parent().css('overflow','hidden');
      pannel.parent().css('width',"100%");
      origin.animate(
        {
          marginLeft:'-'+w1
        },
        'slow',
        function(){
          settings.switch_to.show().removeClass('fl').width('');
          origin.hide();
          pannel.width("100%");
          settings.switch_to.find('.back').unbind('click').bind('click',function(){
            $(this).trigger('customEvent');
            settings.switch_to.addClass('fl').width(w1);
            origin.show();
            pannel.width("5000px");
            origin.animate({
              marginLeft:0
            },'slow',function(){
              settings.switch_to.hide();
              pannel.parent().children().unwrap();
              pannel.children().unwrap();

            });
            return false;
          });
          if( typeof settings.callback === 'function'){
            settings.callback();
          }
        });
      });
    }
})(jQuery);


/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
jQuery.fn.pagination = function(maxentries, opts){
	opts = jQuery.extend({
		items_per_page:10,
		num_display_entries:4,
		current_page:0,
		num_edge_entries:3,
		link_to:"###",
		prev_text:"上一页",
		next_text:"下一页",
		ellipse_text:"...",
		prev_show_always:true,
		next_show_always:true,
		callback:function(){return false;}
	},opts||{});
	
	return this.each(function() {
		/**
		 * Calculate the maximum number of pages
		 */
		function numPages() {
			return Math.ceil(maxentries/opts.items_per_page);
		}
		
		/**
		 * Calculate start and end point of pagination links depending on 
		 * current_page and num_display_entries.
		 * @return {Array}
		 */
		function getInterval()  {
			var ne_half = Math.ceil(opts.num_display_entries/2);
			var np = numPages();
			var upper_limit = np-opts.num_display_entries;
			var start = current_page>ne_half?Math.max(Math.min(current_page-ne_half, upper_limit), 0):0;
			var end = current_page>ne_half?Math.min(current_page+ne_half, np):Math.min(opts.num_display_entries, np);
			return [start,end];
		}
		
		/**
		 * This is the event handling function for the pagination links. 
		 * @param {int} page_id The new page number
		 */
		function pageSelected(page_id, evt){
			current_page = page_id;
			drawLinks();
			var continuePropagation = opts.callback(page_id, panel);
			if (!continuePropagation) {
				if (evt.stopPropagation) {
					evt.stopPropagation();
				}
				else {
					evt.cancelBubble = true;
				}
			}
			return continuePropagation;
		}
		
		/**
		 * This function inserts the pagination links into the container element
		 */
		function drawLinks() {
			panel.empty();
			var interval = getInterval();
			var np = numPages();
			// This helper function returns a handler function that calls pageSelected with the right page_id
			var getClickHandler = function(page_id) {
				return function(evt){ return pageSelected(page_id,evt); }
			}
			// Helper function for generating a single link (or a span tag if it's the current page)
			var appendItem = function(page_id, appendopts){
				page_id = page_id<0?0:(page_id<np?page_id:np-1); // Normalize page id to sane value
				appendopts = jQuery.extend({text:page_id+1, classes:""}, appendopts||{});
				if(page_id == current_page){
					var lnk = jQuery("<span class='current'>"+(appendopts.text)+"</span>");
				}
				else
				{
					var lnk = jQuery("<a>"+(appendopts.text)+"</a>")
						.bind("click", getClickHandler(page_id))
						.attr('href', opts.link_to.replace(/__id__/,page_id));
						
						
				}
				if(appendopts.classes){lnk.addClass(appendopts.classes);}
				panel.append(lnk);
			}
			// Generate "Previous"-Link
			if(opts.prev_text && (current_page > 0 || opts.prev_show_always)){
				appendItem(current_page-1,{text:opts.prev_text, classes:"prev"});
			}
			// Generate starting points
			if (interval[0] > 0 && opts.num_edge_entries > 0)
			{
				var end = Math.min(opts.num_edge_entries, interval[0]);
				for(var i=0; i<end; i++) {
					appendItem(i);
				}
				if(opts.num_edge_entries < interval[0] && opts.ellipse_text)
				{
					jQuery("<span>"+opts.ellipse_text+"</span>").appendTo(panel);
				}
			}
			// Generate interval links
			for(var i=interval[0]; i<interval[1]; i++) {
				appendItem(i);
			}
			// Generate ending points
			if (interval[1] < np && opts.num_edge_entries > 0)
			{
				if(np-opts.num_edge_entries > interval[1]&& opts.ellipse_text)
				{
					jQuery("<span>"+opts.ellipse_text+"</span>").appendTo(panel);
				}
				var begin = Math.max(np-opts.num_edge_entries, interval[1]);
				for(var i=begin; i<np; i++) {
					appendItem(i);
				}
				
			}
			// Generate "Next"-Link
			if(opts.next_text && (current_page < np-1 || opts.next_show_always)){
				appendItem(current_page+1,{text:opts.next_text, classes:"next"});
			}
		}
		
		// Extract current_page from options
		var current_page = opts.current_page;
		// Create a sane value for maxentries and items_per_page
		maxentries = (!maxentries || maxentries < 0)?1:maxentries;
		opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0)?1:opts.items_per_page;
		// Store DOM element for easy access from all inner functions
		var panel = jQuery(this);
		// Attach control functions to the DOM element 
		this.selectPage = function(page_id){ pageSelected(page_id);}
		this.prevPage = function(){ 
			if (current_page > 0) {
				pageSelected(current_page - 1);
				return true;
			}
			else {
				return false;
			}
		}
		this.nextPage = function(){ 
			if(current_page < numPages()-1) {
				pageSelected(current_page+1);
				return true;
			}
			else {
				return false;
			}
		}
		// When all initialisation is done, draw the links
		drawLinks();
	});
};




/*plugin DownList
 *@params{
 *		is_ajax,default false; 
 *		callback require : class 'event' , callback param : elem.event by clicked; 
 *             }
 * inst.DownList('get')
 */
$.fn.DownList = function(options){
	var defaults = {
		is_ajax: false,
		url: '',
		params: '',
    search: 'off',
    clearFilter: false,
    shiftName:'',
    searchTemp: '<li><a class="event" data-id="${id}" title="${name}" href="?version=${id}">${name}</a></li>',
		listmodel :'.select-body',
		temp: '<li><a class="event" href="${id}" data-id="${id}" id="${id}" title="${name}">${name}</a></li>',
		callback:function(elem){}
	}
	var inst = $(this);
	var realHeight = 0;
	inst.bind('click',function(e){
		if(e.target != e.currentTarget){
			stopBubble(e);
		}
	})
	if(typeof(options)==='string' && options=='get'){
		return inst.find('.selected');
	}
	var settings = $.extend({},defaults,options);
	var list_panel = inst.find(settings.listmodel);
	var list = list_panel.find('.select-list');
	inst.data('data','');
	if(settings.is_ajax){
		inst.bind('click',function(e){
      if(settings.search == 'on'){
        var search = '<div id="list_search"><input type="text" class="input" placeholder="搜索"></div>';
        inst.find('.select-head').append(search);
        var input = inst.find('#list_search input');
        input.focus();
        input.bind('click',function(){
          return false;
        })
      };
			window.hidePopFrame(list_panel);
			if(list_panel.is(':visible')){
				list_panel.hide();
				if(realHeight != 0){
					inst.parents('.mod').height(realHeight);
				}
			}else{
				list_panel.show();
				if(inst.data('data')==''){
          inst.find('.load').show();
          ///Fix select overflow
          fixHeight();
          $.ajax({
            url:settings.url,
            data:settings.params,
            success:function(data){
              if(data.result == 'success'){
                if(settings.clearFilter){
                  data.datas.unshift({
                    id: "",
                    is_shown: "true",
                    name: settings.shiftName
                  })
                };
                inst.find('.load').hide();
                $.template('ddltemp',settings.temp);
                $.tmpl('ddltemp',data.datas).appendTo(list);
                if(data.datas.length>0){
                  inst.data('data',data.datas);
                }else{
                  inst.data('data',' ');
                }
                fixHeight();
                bindCallback();
              }else{
                list_panel.html('<div style="text-align:center;">'+data.msg+'</div>');
                fixHeight();
                bindCallback();
              }
            }
          })	
				}else{
				  fixHeight();
				}
			}
		});
	}else{
		inst.bind('click',function(e){
      if(settings.search == 'on'){
        var search = '<div id="list_search"><input type="text" class="input" placeholder="搜索"></div>';
        inst.find('.select-head').append(search);
        var input = inst.find('#list_search input');
        input.focus();
        input.bind('click',function(){
          return false;
        })
      };
			///Fix select overflow
			fixHeight();
			window.hidePopFrame(list_panel);
			if(list_panel.is(':visible')){
				list_panel.hide();
			}else{
				list_panel.show();
				bindCallback();
			}
		})
	};
  inst.delegate('#list_search input','keyup',function(e){
    var that = $(this);
    var txt = that.val();
    if($('#version-select').data('data') != ''){
      var list = inst.find('.select-list');
      if(txt != ''){
        var res = $.dataFilter(inst.data('data'),txt);
        $.template('ddltemp',settings.searchTemp);
        list.html('');
        $.tmpl('ddltemp',res).appendTo(list);
        bindCallback()
      }else{
        $.template('ddltemp',settings.searchTemp);
        list.html('');
        $.tmpl('ddltemp',inst.data('data')).appendTo(list);
        bindCallback();
      }
    }
  });
  if(settings.search == 'on'){
    $(document).bind('click',function(){
    	inst.find('#list_search').remove();
    });
  };
  var fixHeight = function(){
		var height = inst.find('.select-body').height();
		var maxHeight = inst.find('.select-body').css('max-height').split('px')[0] || "";
		var mod = inst.parents('.mod');
		var h = mod.find('.mod-body').height();
		if(maxHeight != "" && height > h){
			realHeight = h;
      if(mod.height()<maxHeight){
        mod.css('min-height',height+35);
      }
		}
  };
	var bindCallback = function(){
		list.find('.event').unbind('click').bind('click',function(e){
			inst.find('.selected').text($(this).text()).attr({'data-id': $(this).attr('data-id'),'id': $(this).attr('id')});
			list_panel.hide();
			settings.callback($(this));
			stopBubble(e);
		})
	}
}; 



(function($){
  // app_search display logic
  //
  // for reports and tools layouts:
  // load @apps to display partial apps, search for the entire apps.
  //
  // display:
  // == 1  app,  no listing, no search
  // <= 10 apps, listing, no search
  //  > 10 apps, listing and search

  var all_apps = $(".js-select-list li");

  $(".js-app-select").click(function(e){
    e.stopPropagation();
    $(".js-select-list").css("display","block");
    if( all_apps.size() > 10 ) {
      $( this ).css("display","none");
      $(".js-search-Apps").css("display","block");
      $(".js-search-Apps").focus();
    }
  });
  $('.js-select-list').delegate('li', 'click', function(){
    $(".js-search-Apps").val( $(this).text() );
    showSelect( $(this).attr( "key" ), $(this).attr( "app_id" ) );
  });
  $(document).click(function(){
    $(".js-search-Apps").css("display","none");
    $(".js-app-select").css("display","block");
    $(".js-select-list").css("display","none");
  });
  $(".js-search-Apps").bind('click', function(){
    return false;
  }).bind('keyup', function(){
    send_ajax();
  });
  var flag;
  function send_ajax(response){
    clearTimeout(flag);
    flag = setTimeout(function(){
      var query = $("#search_apps").val();
      var post_url = "/total/count/search.php";
      var current_item = $('.topNav .currentItem').index();
      $.ajax({
        type: 'post',
        data: {'query': query, 'current_item': current_item},
        url: post_url,
        success: function(res){
          eval("s = "+res+";");
//          var s = res;
          if( res == "" || res==0 || res==1 ) {
            if( query == "" ) {
              $(".js-select-list li").remove();
              $(".js-select-list").append(all_apps);
              if( all_apps.size() > 10 ) {
                $(".js-select-list").css("overflow-y","scroll");
              }
            }else{
              $(".js-select-list li").remove();
              $(".js-select-list").removeAttr("style");
              $(".js-select-list").html('<li class="result_empty">搜索结果为空</li>');
              $(".js-select-list .result_empty").click(function(){
                return false;
              })
            }
          }else {
//alert(s);
//            s=[['result1','undefiend','1'],['result2','undefiend','860100010040300001'],['result3','undefiend','3']];
            var obj = {};
            var arr = [];
            for(i in s){
              obj = {'key':s[i][1],'appid':s[i][2],'name':s[i][0]}
              arr.push(obj);
              obj = {};
            }
            $.template("respTemplate",'<li key=${key} app_id=${appid}>${name}</li>');
            $(".js-select-list li").remove();
            $.tmpl("respTemplate",arr).appendTo(".js-select-list");

            if( res.length <=10 ) {
              //remove scroll
              $(".js-select-list").removeAttr("style");
            }

          }

        },
        error: function(res){
         }
      });
    }, 800)

  }
})(jQuery)


function showSelect(app_title, app_id) {
	
	
  var redirect_url = location.pathname;

  if(app_title == "all_apps"){
	  $.get("/total/count/id_build_current.php?id_build_current="+app_title
	  ,function(data){
//		  alert("data:"+data);
		  window.location.href = redirect_url;
	  });
  } else{
	  $.get("/total/count/id_build_current.php?id_build_current="+app_id
	  ,function(data){
//		  alert("data:"+data);
		  window.location.href = redirect_url;
	  });
  }
}


// app_title: 'all_apps' or nil
function showSelect_2(app_title, app_id) {
  var redirect_url = "";
  var page_type = 'report';

  if(app_title == "all_apps"){
      // component pages
      if(page_type == 'component'){
        redirect_url = "/apps/feedbacks";
      } else{
        redirect_url = "/apps/";
      }
  } else{
    // alert(location.pathname);
    if(location.pathname.match(/\?/) === null){
      redirect_url = location.pathname + "?id_build_current=" + app_id;
    } else{
      redirect_url = location.pathname + "&id_build_current=" + app_id;
    }
  }
  window.location.href = redirect_url;
}


function showSelect_1(app_title, app_id) {
  var redirect_url = "";
  var page_type = 'report';

  if(location.pathname.indexOf("feedbacks") > 0 || location.pathname.indexOf("socials") > 0 || location.pathname.indexOf("online_config") > 0 || location.pathname.indexOf("upload") > 0 || location.pathname.indexOf("sns") > 0) {
    page_type = 'component';
  }

  if(app_title == "all_apps"){
      // component pages
      if(page_type == 'component'){
        redirect_url = "/apps/feedbacks";
      } else{
        redirect_url = "/apps/";
      }
  } else{
    // alert(location.pathname);
    if(location.pathname.match(/\d/) === null){
      redirect_url = "/apps/" + app_id + "/link_with_permission?page_type=" + page_type;
    } else{
      // global.appid in socials pages are not reversed.
      if(location.pathname.indexOf("socials") > 0) {
        global_appid = global.appid.split("").reverse().join("");
      } else{
        global_appid = global.appid;
      }
      redirect_url = location.pathname.replace(global_appid, app_id);
    }
  }
  window.location.href = redirect_url;
}


/*
 *
 * Purpose: Ajax Loading Chart
 * Rely on: jquery.highcharts
 *
 **/

var cached_charts = {};
function render_chart(chart_id, title, data_src_url, params, force_reload, opts){

    var common_opts = {
        chart: {
            defaultSeriesType: "spline",
            animation: false
        },
	xAxis:{
		labels:{
			formatter: function(){
        if (typeof(this.value) == "string") {
          return this.value.split(':')[0];
        } else {
          return this.value;
        }
			}
		}
	},
        yAxis: {
            title:"",
            min:0
        },
        credits: {
            "enabled":false
        },
        plotOptions: {
            "area":{
                "stacking":null
            },
            "series":{
                animation: false,
                events: {
                  legendItemClick: function(event) {
                    var legendName = this.name+'_<dot>';
                    var tempSeries = this.chart.series;
                    var seriesLength = tempSeries.length;
                    for (var i=0; i < seriesLength; i++){
                      if (tempSeries[i].name == legendName){
                        tempSeries[i].visible ? tempSeries[i].hide() : tempSeries[i].show();
                      }
                    }
                  }
                }
            }
        },
        tooltip: {
            enabled: true,
            formatter: function() {
		  var dates_mapping = $('#'+chart_id).data('dates_mapping_' + this.series.name);
		  if( dates_mapping != undefined ){
			  this.x = dates_mapping[this.x];
		  }
		  if( params['time_unit'] == 'hourly' ){
			  var date_and_time =  this.x.split(' ');
        if(date_and_time.length > 1) {
          var hourFormat = date_and_time[1].split(':');
          return date_and_time[0] + " " + parseInt(hourFormat[0], 10) + "~" + (parseInt(hourFormat[0], 10)+1) +"时: " + this.y;
        } else {
          return parseInt(date_and_time[0], 10) + "~" + (parseInt(date_and_time[0], 10)+1) +"时: " + this.y;
        }
		  }	
		  return '' + this.x + ': ' + this.y;
            }
        },
        legend: {
            margin: 25,
            enabled: true
        },
        subtitle: {}
    };
		
    // Set Cached Chart Unique Id
    var chart_cache_id = 'umeng_' + chart_id;
    $.each(params, function(i,n){
        chart_cache_id += '_' + i + ':' + n;
    });
    //clear summary
	$('#'+chart_id).parent().find('.chart-summary').remove();
  // Do Nothing If Chart Existing and No Need To Reload
  var cached_data = $('#'+chart_id).data(chart_cache_id);
  if ( cached_charts[chart_cache_id] != undefined && !force_reload && cached_data != null ){
    try{
      cached_charts[chart_cache_id].destroy();
      cached_charts[chart_cache_id] = new Highcharts.Chart($.extend(true, {}, common_opts, cached_data));
      $('#'+chart_id).data('current_chart',chart_cache_id);
      if($('#'+chart_id).data(chart_cache_id+'_summary') != undefined){
        window.showSummary($('#'+chart_id),$('#'+chart_id).data(chart_cache_id+'_summary'));
      }
      // Trigger chart_data_loaded event
      var data_source = $('#'+chart_id);
      data_source.trigger('chart_data_loaded', data_source.data(chart_cache_id+'_rawdata'));
    }catch(error){}
    return;
  }

    // Loading Data
    var categories = [];
    var series = [];
    var chart_canvas = $('#'+chart_id);
	if(!params.is_compared){
		var loading_img = $("<div style='text-align:center;padding-top:150px;'><img src='images/ajax-loader.gif' /></div>");
		$('#'+chart_id).html('').append(loading_img);
	}
    var style = {
		fillColor: {
			linearGradient: [0, 0, 0, 300],
			stops: [
			[0, 'rgb(160, 192, 193)'],
			[1, 'rgba(255,255,255,0)']
			]
		},
		marker: {
			symbol: 'circle',
			fillColor: '#FFFFFF',
			lineWidth: 2,
			lineColor: null 
		}
	}
    $.get( data_src_url, params, function(resp){
        if( resp.result == 'success'){
            $.each(resp.dates, function(i,date){
                categories[i] = date
            });
            
            $.each(resp.stats, function(i,stat){
                series[i] = $.extend({visible:true}, stat,style);
            });
           
            // Set Init Options
            var options = $.extend(true, {
                chart: {
                    renderTo: chart_id,
		     type: ''
                },
	        plotOptions: {
	          series: {
	            shadow: false
	          }
	        },		
                title: {
                    text: title
                },
                xAxis: {
                    categories: categories,
                    labels:{
                        align:"right",
                        //rotation:-45,
                        step: parseInt(categories.length / 7)
                    }
                },
                series: series
            }, opts || {});

            // Cache data
            $('#'+chart_id).data(chart_cache_id, options );
            $('#'+chart_id).data(chart_cache_id+'_rawdata', resp);

            // Destroy Existing Chart
            if ( cached_charts[chart_cache_id] != undefined ){
                try{
                    cached_charts[chart_cache_id].destroy();
                }catch(error){}
            }
            // Create Chart
		if( resp.result == 'success' && resp.is_compared ==true){
      $('.loadingChart').remove();
			for(i in series){
				var current_chart = cached_charts[$('#'+chart_id).data('current_chart')];
				var dates_mapping = {};
				for(var index=0; index < current_chart.xAxis[0].categories.length; index++){
					dates_mapping[current_chart.xAxis[0].categories[index]] = categories[index];
				}
				$('#'+chart_id).data('dates_mapping_'+series[i].name, dates_mapping);
				current_chart.addSeries(series[i]);
			}
		}else{
			cached_charts[chart_cache_id] = new Highcharts.Chart($.extend(true, {}, common_opts, options));
			$('#'+chart_id).data('current_chart',chart_cache_id);
			//show summary
			$('#'+chart_id).data(chart_cache_id+'_summary',resp.summary);
		}
            // Trigger chart_data_loaded event
            $('#'+chart_id).trigger('chart_data_loaded', resp);
        }else{
        	chart_canvas.html('<div style="padding-top:150px;text-align:center;">'+resp.msg+'</div>');
        }
		if(resp.summary != undefined){
			window.showSummary($('#'+chart_id),resp.summary);
		}
        //chart_canvas.unblock();
    });
}
function flush_chart(){
  cached_charts = {};
}


(function($){
$(document).ready(function(){
  $('a#login_testin').click(function() {
    $.ajax({
      type: 'post',
      url: '/users/logon_testin.json',
      error: function(data) {
        alert('请重新登录');
        window.location.href = '/users/sign_in';
      },
      success: function(data){
        var status = data['status'];
        if(status == 200){
          window.location.href = data['callback_url'];
        } else {
          alert('无法连接');
        }
      }
    });

    return false;
  });
});
})(jQuery);


$.fn._export = function(e,options){
  var inst = $(this);
//   inst.unbind('click').bind('click',function(e){
//     getCsv(e);
//     $(this).unbind('click');
//     setTimeout(function(){
//       inst.bind('click',function(e){
//         getCsv(e);
//       })
//     },3000);
//   });
  getCsv(e);
	function getCsv(tar){
		var action = '';
		var params = '';
		var timeUnit = 'daily';
		if(global.action_stats != undefined){
			action = global.action_stats + '_csv';
		}
		if(global.time_unit != ''){
			timeUnit = global.time_unit;
		}
		var defaults = {
			start_date: global.pickedStartDay || global.fixedStartDay,
			end_date: global.pickedEndDay || global.fixedEndDay,
			channels:[global.filter.channel],
			versions:[global.filter.version],
			segments:[global.filter.segment],
			time_unit:timeUnit,
      secend_param:'',
			url:'/apps/'+global.appid+'/reports/load_table_data',
			stats: action
		}
		params = $.extend(true,{},defaults,options);
		inst.addClass('export-icon-load');
    if(params.group !=''){
      params.group_id = $('#'+params.group).DownList('get').attr('id');
      params.group = "";
    }
    if(params.events !=''){
      params.event_id = $('#'+params.events).DownList('get').attr('id');
      params.events = "";
    }
    if($.type(params.secend_param) != 'string'){
      params.stats = params.stats  + '_csv_' + params.secend_param.renderTab('get_status');
      delete params.secend_param;
    };
		$.ajax({
			url: params.url,
			type: 'get',
			data: params,
			success: function(data){
				callfunction(tar,data);
			},
			error:function(e){
				alert('服务器发生错误,请稍后再试!');
				inst.removeClass('export-icon-load');
			}
		});
	};
	function callfunction(e,data){
		var right = e.offsetX+35 +'px';
		var top = e.offsetY+20+'px';
		if(data.result == 'success'){
			inst.removeClass('export-icon-load');
			inst.after('<div class="tip-export"><div class="small-corner"></div><a class="fr close font-highlight"><b class="icon icon-close"></b></a>下载任务已提交,请前往<a href="/apps/download_center" class="font-highlight close">报表中心</a>查看进度&nbsp;</div>');
      setTimeout(function(){
  			$('.tip-export').fadeOut('fast',function(){
  				$('.tip-export').remove();
  			})
      },4000)
		} else{
			//alert(data['msg']);
			inst.removeClass('export-icon-load');
			//inst.after('<div class="tip-export"><a class="fr close font-highlight">知道了<b class="icon icon-close"></b></a>请前往<a href="/apps/download_center" class="font-highlight close">报表中心</a></div>');
		}
		$('.tip-export .close').bind('click',function(){
			$(this).parent().fadeOut('fast',function(){
				$(this).remove();
			})

		});
	};
};
//$('.exportCsv')._export();
$('.exportCsv').bind('click',function(e){
  $(this)._export(e);
})

var TINY={};

function T$(i){return document.getElementById(i)}
function T$$(e,p){return p.getElementsByTagName(e)}

TINY.slider=function(){
	function slide(n,p){this.n=n; this.init(p)}
	slide.prototype.init=function(p){
		var s=this.x=T$(p.id), u=this.u=T$$('ul',s)[0], c=this.m=T$$('li',u), l=c.length, i=this.l=this.c=0; this.b=1;
		if(p.navid&&p.activeclass){this.g=T$$('li',T$(p.navid)); this.s=p.activeclass}
		this.a=p.auto||0; this.p=p.resume||0; this.r=p.rewind||0; this.e=p.elastic||false; this.v=p.vertical||0; s.style.overflow='hidden';
		for(i;i<l;i++){if(c[i].parentNode==u){this.l++}}
		if(this.v){;
			u.style.top=0; this.h=p.height||c[0].offsetHeight; u.style.height=(this.l*this.h)+'px'
		}else{
			u.style.left=0; this.w=p.width||c[0].offsetWidth; u.style.width=(this.l*this.w)+'px'
		}
		this.nav(p.position||0);
		if(p.position){this.pos(p.position||0,this.a?1:0,1)}else if(this.a){this.auto()}
		if(p.left){this.sel(p.left)}
		if(p.right){this.sel(p.right)}
	},
	slide.prototype.auto=function(){
		this.x.ai=setInterval(new Function(this.n+'.move(1,1,1)'),this.a*1000)
	},
	slide.prototype.move=function(d,a){
		var n=this.c+d;
		if(this.r){n=d==1?n==this.l?0:n:n<0?this.l-1:n}
		this.pos(n,a,1)
	},
	slide.prototype.pos=function(p,a,m){
		var v=p; clearInterval(this.x.ai); clearInterval(this.x.si);
		if(!this.r){
			if(m){
				if(p==-1||(p!=0&&Math.abs(p)%this.l==0)){
					this.b++;
					for(var i=0;i<this.l;i++){this.u.appendChild(this.m[i].cloneNode(1))}
					this.v?this.u.style.height=(this.l*this.h*this.b)+'px':this.u.style.width=(this.l*this.w*this.b)+'px';
				}
				if(p==-1||(p<0&&Math.abs(p)%this.l==0)){
					this.v?this.u.style.top=(this.l*this.h*-1)+'px':this.u.style.left=(this.l*this.w*-1)+'px'; v=this.l-1
				}
			}else if(this.c>this.l&&this.b>1){
				v=(this.l*(this.b-1))+p; p=v
			}
		}
		var t=this.v?v*this.h*-1:v*this.w*-1, d=p<this.c?-1:1; this.c=v; var n=this.c%this.l; this.nav(n);
		if(this.e){t=t-(8*d)}
		this.x.si=setInterval(new Function(this.n+'.slide('+t+','+d+',1,'+a+')'),10)
	},
	slide.prototype.nav=function(n){
		if(this.g){for(var i=0;i<this.l;i++){this.g[i].className=i==n?this.s:''}}
	},
	slide.prototype.slide=function(t,d,i,a){
		var o=this.v?parseInt(this.u.style.top):parseInt(this.u.style.left);
		if(o==t){
			clearInterval(this.x.si);
			if(this.e&&i<3){
				this.x.si=setInterval(new Function(this.n+'.slide('+(i==1?t+(12*d):t+(4*d))+','+(i==1?(-1*d):(-1*d))+','+(i==1?2:3)+','+a+')'),10)
			}else{
				if(a||(this.a&&this.p)){this.auto()}
				if(this.b>1&&this.c%this.l==0){this.clear()}
			}
		}else{
			var v=o-Math.ceil(Math.abs(t-o)*.1)*d+'px';
			this.v?this.u.style.top=v:this.u.style.left=v
		}
	},
	slide.prototype.clear=function(){
		var c=T$$('li',this.u), t=i=c.length; this.v?this.u.style.top=0:this.u.style.left=0; this.b=1; this.c=0;
		for(i;i>0;i--){
			var e=c[i-1];
			if(t>this.l&&e.parentNode==this.u){this.u.removeChild(e); t--}
		}
	},
	slide.prototype.sel=function(i){
		var e=T$(i); e.onselectstart=e.onmousedown=function(){return false}
	}
	return{slide:slide}
}();

