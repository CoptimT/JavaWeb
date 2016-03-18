<?php
require("../../api_global.php");
require("../../api_error.php");
require("../../api_conn.php");

$id_build=isset($_REQUEST["id_build"])?trim($_REQUEST["id_build"]):'';
$notchange=isset($_REQUEST["notchange"])?trim($_REQUEST["notchange"]):'';   //1不能更改建筑物
$one_class=isset($_REQUEST["one_class"])?trim($_REQUEST["one_class"]):'';
$two_class=isset($_REQUEST["two_class"])?trim($_REQUEST["two_class"]):'';
$seaname=isset($_REQUEST["seaname"])?trim($_REQUEST["seaname"]):'';

$name_list=isset($_REQUEST["name_list"])?trim($_REQUEST["name_list"]):'';    //id列表框名称
$replace=isset($_REQUEST["replace"])?trim($_REQUEST["replace"]):'';    //是否覆盖以前的id列表，1覆盖，0默认不覆盖
if(empty($name_list)){
   $name_list="productids";
}
$no_checkbox=isset($_REQUEST["no_checkbox"])?trim($_REQUEST["no_checkbox"]):'';  //是否根据id列表生成多选框,1不生成，0默认生成
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
</head>
<script language="javascript">
function checkinput(){
   if (document.form2.id_build.value.replace(" ","")=="") {
      alert("请选择建筑物！");
	  document.form2.id_build.focus();
	  return false;
   }
}



//字符串分隔符
var valueStrSeparator = ',';

//修改多选框对象checked属性，更新已选项的id列表字符串
function update_checked(id){
	var id_poi,tempStrValue;
	id_poi=id.value;
	<?php
	if(!empty($replace)){
	  ?>
	    window.opener.document.form1.<?php echo $name_list;?>.value = id_poi;
	  <?php
	}else{
	  ?>
		tempStrValue = (window.opener.document.form1.<?php echo $name_list;?>.value=='')?window.opener.document.form1.<?php echo $name_list;?>.value:valueStrSeparator+window.opener.document.form1.<?php echo $name_list;?>.value+valueStrSeparator;
		//判断已选项中是否已存在该项
		if(tempStrValue.indexOf(valueStrSeparator+id_poi+valueStrSeparator)==-1){
		   window.opener.document.form1.<?php echo $name_list;?>.value += (window.opener.document.form1.<?php echo $name_list;?>.value=='')?id_poi:valueStrSeparator+id_poi;
		}
	  <?php
	}
	?>
}

//根据已选项的id列表，更新已选类别的显示
function addedCityItemsHTML(){
    var str = '';
	var addedStr = window.opener.document.form1.<?php echo $name_list;?>.value.replace(" ","");
	var arrAddedID = new Array(),i;
	
	
	if(addedStr!=''){
		arrAddedID = addedStr.split(valueStrSeparator);
		for(i=0;arrAddedID[i];i++){
			if(document.getElementById(arrAddedID[i])){   
			   str+='<li><input type="checkbox" name="itemCBox" value="'+arrAddedID[i]+'" id="'+arrAddedID[i]+'" alt="'+document.getElementById(arrAddedID[i]).alt+'" checked onclick="clickCheckbox(this)" >'+document.getElementById(arrAddedID[i]).alt+"</li>";
			}else{
				if(window.opener.document.getElementById(arrAddedID[i])){
				   str+='<li><input type="checkbox" name="itemCBox" value="'+arrAddedID[i]+'" id="'+arrAddedID[i]+'" alt="'+window.opener.document.getElementById(arrAddedID[i]).alt+'" checked onclick="clickCheckbox(this)" >'+window.opener.document.getElementById(arrAddedID[i]).alt+"</li>";
				}
			}
		}
	} 
    return str;
}


function checkbox(){
		    name_s=eval("document.form1.itemCBox");
			if (name_s!=undefined) {
				isChecked = false
			    if (name_s.length==undefined){
		            if(name_s.checked){
					   update_checked(name_s);
					}
				}else{
					for (m=0; m<(name_s.length); m++){
		               if(name_s[m].checked){
						  update_checked(name_s[m]);
					   }
					}
				}
				<?php
				if(empty($no_checkbox)){
				?>
	            window.opener.pro_list.innerHTML = addedCityItemsHTML();  //根据已选项的id列表，更新已选项的显示
				<?php
				}
				?>
			}
			alert("操作成功！");
			window.close();
}

</script>
<style>
.pro_list{ padding:0px; margin:0px;width:95%;}
.ul_poi_list{ width:100%; height:auto; overflow:hidden; margin:0px; text-align:left;}
.ul_poi_list li{ float:left; width:24%; line-height:25px; height:25px; overflow:hidden;}
</style>
<body>
<div style="font-size:12px;">

<form name="form2" method="post" action="" onsubmit="return checkinput();" style="text-align:center;">
    <div class="pro_list" style=" text-align:left;">
	<select name="id_build" <?php if($notchange==1){echo "disabled";}?>>
	  <option value="" selected="selected">请选择建筑物</option>
	  <?php
	  $sql="select * from map_location order by name_chinese";
	  $result=mysql_query($sql);
	  while($row=mysql_fetch_assoc($result)){
		 ?>
		 <option value="<?php echo $row["id_build"];?>" <?php if(trim($row["id_build"]."a")==$id_build."a"){echo "selected";}?> ><?php echo $row["name_chinese"];?></option>
		 <?php
	  }
	  mysql_free_result($result);
	  ?>
	</select><br />
	<div style=" height:15px; overflow:hidden; line-height:15px;"></div>
	<select name="one_class">
	  <option value="" selected="selected">请选一级类</option>
	</select>
	<select name="two_class">
	  <option value="" selected="selected">请选二级类</option>
	</select><br />
	<div style=" height:15px; overflow:hidden; line-height:15px;"></div>
	<input name="seaname" type="text" style="width:240px;height:15px; margin-right:10px;"  value="<?php echo $seaname;?>"/>
	<input type="submit" value="搜索" />
	</div>
</form>

<form name="form1" onsubmit="checkbox();" method="post" style=" text-align:center;" action="">
	<div class="pro_list">
	  <div style="text-align:left"><br /><b>产品列表：</b></div><br />
	  <ul class="ul_poi_list">
	    <?php
		if(!empty($id_build)){
		    $sql="select * from poi_basic_2 where id_build='".$id_build."'";
		    if(!empty($two_class)){
			   $sql=$sql." and two_class='".$two_class."'";
			}else{
			   if(!empty($one_class)){
			      $sql=$sql." and one_class='".$one_class."'";
			   }
			}
			
			if(!empty($seaname)){
			   $key_search=strtok($seaname," ");
			   $i=1;
               $sql_="";			
			   while($key_search!==false)
			   {
			       if(!empty($key_search))
				   {
				       if($i==1)
					   {
						   $sql_=" name_chinese like '%".$key_search."%'";
					   }
					   else
					   {
						   $sql_=$sql_." and name_chinese like '%".$key_search."%'";
					   }
					   $i++;
				   }
				   $key_search=strtok(" ");
			   }
			   if(!empty($sql_))
			   {
				   $sql=$sql."and (".$sql_.")";
			   }
			}
			
			
			$sql=$sql." order by name_chinese";
			$result=mysql_query($sql);
			while($row=mysql_fetch_assoc($result)){
			    ?>
				<li><input type="checkbox" name="itemCBox" value="<?php echo $row["id_poi"];?>" id="<?php echo $row["id_poi"];?>" alt="<?php echo $row["id_poi"]."_".$row["name_chinese"];?>"><?php echo $row["id_poi"]."_".$row["name_chinese"];?></li>
				<?php
			}
            mysql_free_result($result);
		}
		?>
	  </ul>
	</div>
	<div style="text-align:center; margin-top:30px;">
	   <input type="submit" value="确定" />
	   <input type="reset" value="重置" />
	   <input type="button" value="关闭当前窗口" onmousedown="window.close();" />
	</div>
</form>

</div>
</body>

</html>
<?php
mysql_close($con);
?>