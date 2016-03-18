// JavaScript Document

var xmlHttp
function show_class_one(str){
  xmlHttp=GetXmlHttpObject()
  if (xmlHttp==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="show_class/show_class_one.php"
  url=url+"?id_model="+str
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
 document.getElementById("id_one_class2").innerHTML=xmlHttp.responseText 
 } 
}


var xmlHttp2
function show_class_one_(str,str2){
  xmlHttp2=GetXmlHttpObject()
  if (xmlHttp2==null){
  alert ("Browser does not support HTTP Request")
  return
  } 
  var url="show_class/show_class_one_.php"
  url=url+"?id_model="+str
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
 document.getElementById("id_one_class_2").innerHTML=xmlHttp2.responseText 
 } 
}
