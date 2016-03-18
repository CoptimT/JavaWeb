// JavaScript Document

  $(function(){
  /*应用联盟申请表单 --begin*/
    jQuery("#apply_promotion_form").validate({
        rules: {
          phone: {
            required: true
          },
          name: {
            required: true
          },
          email: {
            required: true,
            email: true
          },
          company: {
            required: true
          },
          title: {
            required: true
          },
          site_url: {
            required: true
          },
          app_name: {
            required: true
          },
          app_url: {
            required: true
          }
        },
        messages: {
          phone: {
            required: "必填",
          },
          name: {
            required: "必填"
          },
          email: {
            required: "必填",
            email: "无效邮箱地址"
          },
          company: {
            required: "必填"
          },
          title: {
            required: "必填"
          },
          site_url: {
            required: "必填",
          },
          app_name: {
            required: "必填"
          },
          app_url: {
            required: "必填",
          }
        },
        // the errorPlacement has to take the table layout into account
        errorPlacement: function(error, element) {
          error.appendTo(element.parent().next());
        },
        // set this class to error-labels to indicate valid fields
        success: function(label) {
          // set &nbsp; as text for IE
          label.html("&nbsp;").addClass("checked");
        }
    });

    jQuery('a.apply_promotion').click(function() {
      $('#applyPromotion').dialog({
        // height: 300,
        width: 550,
        modal: true,
        buttons:{
          '提交申请':function(){
            $("#apply_promotion_form").submit();
          }
        }
      });
      // pop_dialog(, '460px', '500px', '', '20%');
      return false;
    });
  /*应用联盟申请表单 --begin*/
  });
