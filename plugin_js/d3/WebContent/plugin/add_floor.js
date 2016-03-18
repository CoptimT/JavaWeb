// JavaScript Document


var xmlHttp
function showcity(str){
  xmlHttp=GetXmlHttpObject()
  if (xmlHttp==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="floor/show_city.php"
  url=url+"?province="+str
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
 document.getElementById("city2").innerHTML=xmlHttp.responseText 
 } 
}



var xmlHttp2
function showarea(str,str2){
  xmlHttp2=GetXmlHttpObject()
  if (xmlHttp2==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="floor/show_area.php"
  url=url+"?province="+str
  url=url+"&city="+str2
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
 document.getElementById("area2").innerHTML=xmlHttp2.responseText 
 } 
}




var xmlHttp3
function showbuild(str,str2,str3){
  xmlHttp3=GetXmlHttpObject()
  if (xmlHttp3==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="floor/show_build.php"
  url=url+"?province="+str
  url=url+"&city="+str2
  url=url+"&area="+str3
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
 document.getElementById("building2").innerHTML=xmlHttp3.responseText 
 } 
}




var xmlHttp4
function showfloor(str){
  xmlHttp4=GetXmlHttpObject()
  if (xmlHttp4==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="floor/show_floor.php"
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
 document.getElementById("floor2").innerHTML=xmlHttp4.responseText 
 } 
}



