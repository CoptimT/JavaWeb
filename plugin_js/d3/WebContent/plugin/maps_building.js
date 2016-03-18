// JavaScript Document

var xmlHttp
function showfloor(str){
  xmlHttp=GetXmlHttpObject()
  if (xmlHttp==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="maps_building/showfloor.php"
  url=url+"?id_build="+str
  url=url+"&sid="+Math.random()
//  alert(url);
  xmlHttp.onreadystatechange=stateChanged
  xmlHttp.open("GET",url,true)
  xmlHttp.send(null)
} 

function stateChanged() 
{ 
if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
 { 
// alert(xmlHttp.responseText);
 document.getElementById("smallclassid2").innerHTML=xmlHttp.responseText 
 } 
}



var xmlHttp2
function show_user(){
  xmlHttp2=GetXmlHttpObject()
  if (xmlHttp2==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="maps_building/showuser.php"
  url=url+"?id_build="+document.form1.bigclassid.value
  url=url+"&floor="+document.form1.smallclassid.value
  url=url+"&date_time="+document.form1.Dyear.value+"-"+document.form1.Dmonth.value+"-"+document.form1.Dday.value
  url=url+"&sid="+Math.random()
//  alert(url);
  xmlHttp2.onreadystatechange=stateChanged2
  xmlHttp2.open("GET",url,true)
  xmlHttp2.send(null)
} 

function stateChanged2() 
{ 
if (xmlHttp2.readyState==4 || xmlHttp2.readyState=="complete")
 { 
// alert(xmlHttp2.responseText);
 document.getElementById("users").innerHTML=xmlHttp2.responseText 
 } 
}

var xmlHttp3
function show_user_2(){
  xmlHttp3=GetXmlHttpObject()
  if (xmlHttp3==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="maps_building/showuser_2.php"
  url=url+"?id_build="+document.form1.bigclassid.value
  url=url+"&floor="+document.form1.smallclassid.value
  url=url+"&sid="+Math.random()
//  alert(url);
  xmlHttp3.onreadystatechange=stateChanged3
  xmlHttp3.open("GET",url,true)
  xmlHttp3.send(null)
} 

function stateChanged3() 
{ 
if (xmlHttp3.readyState==4 || xmlHttp3.readyState=="complete")
 { 
// alert(xmlHttp3.responseText);
 document.getElementById("users").innerHTML=xmlHttp3.responseText 
 } 
}

var xmlHttp4
function showfloor_2(str){
  xmlHttp4=GetXmlHttpObject()
  if (xmlHttp4==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="maps_building/showfloor_2.php"
  url=url+"?id_build="+str
  url=url+"&sid="+Math.random()
//  alert(url);
  xmlHttp4.onreadystatechange=stateChanged4
  xmlHttp4.open("GET",url,true)
  xmlHttp4.send(null)
} 

function stateChanged4() 
{ 
if (xmlHttp4.readyState==4 || xmlHttp4.readyState=="complete")
 { 
// alert(xmlHttp4.responseText);
 document.getElementById("smallclassid2").innerHTML=xmlHttp4.responseText 
 } 
}



var xmlHttp5
function showfloor_3(str){
  xmlHttp5=GetXmlHttpObject()
  if (xmlHttp5==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="maps_building/showfloor_3.php"
  url=url+"?id_build="+str
  url=url+"&sid="+Math.random()
//  alert(url);
  xmlHttp5.onreadystatechange=stateChanged5
  xmlHttp5.open("GET",url,true)
  xmlHttp5.send(null)
} 

function stateChanged5() 
{ 
if (xmlHttp5.readyState==4 || xmlHttp5.readyState=="complete")
 { 
// alert(xmlHttp5.responseText);
 document.getElementById("smallclassid2").innerHTML=xmlHttp5.responseText 
 } 
}


var xmlHttp6
function show_user_3(){
  xmlHttp6=GetXmlHttpObject()
  if (xmlHttp6==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="maps_building/showuser_3.php"
  url=url+"?id_build="+document.form1.bigclassid.value
  url=url+"&floor="+document.form1.smallclassid.value
  url=url+"&date_time="+document.form1.Dyear.value+"-"+document.form1.Dmonth.value+"-"+document.form1.Dday.value
  url=url+"&sid="+Math.random()
//  alert(url);
  xmlHttp6.onreadystatechange=stateChanged6
  xmlHttp6.open("GET",url,true)
  xmlHttp6.send(null)
} 

function stateChanged6() 
{ 
if (xmlHttp6.readyState==4 || xmlHttp6.readyState=="complete")
 { 
// alert(xmlHttp6.responseText);
 document.getElementById("users").innerHTML=xmlHttp6.responseText 
 } 
}

var xmlHttp7
function show_user_2_1(){
  document.getElementById("users").innerHTML="><IMG src='/total/images/ajax-loader.gif'>" 
  xmlHttp7=GetXmlHttpObject()
  if (xmlHttp7==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="maps_building/showuser_2.php"
  url=url+"?id_build="+document.form1.bigclassid.value
  url=url+"&floor="+document.form1.smallclassid.value
  url=url+"&time_limit="+document.form1.time_limit.value
  url=url+"&sid="+Math.random()
//  alert(url);
  xmlHttp7.onreadystatechange=stateChanged7
  xmlHttp7.open("GET",url,true)
  xmlHttp7.send(null)
} 

function stateChanged7() 
{ 
if (xmlHttp7.readyState==4 || xmlHttp7.readyState=="complete")
 { 
// alert(xmlHttp3.responseText);
 document.getElementById("users").innerHTML=xmlHttp7.responseText 
 } 
}

