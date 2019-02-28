<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% response.setHeader("Access-Control-Allow-Origin","*");
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>证书</title>
<script src="https://cdn.bootcss.com/vue/2.4.2/vue.min.js"></script>
<script src="https://cdn.bootcss.com/vue-resource/1.5.1/vue-resource.min.js"></script>
<script src="http://www.jq22.com/jquery/jquery-2.1.1.js"></script>
<link href="resources/css/style.css" rel="stylesheet" type="text/css">
<link href="resources/img/logo.ico" rel="shortcut icon" type="image/x-icon" />
</head>
<body>
  <div class="top"></div>
  <div class="main-container">
  <div id="box">
	<input type="button" @click="get" value="点我异步获取数据(Get)" />
	<p>{{msg}}</p>
  </div>
  </div>
  <div class="footer"></div>
  <script type="text/javascript">
  function cb(data){
	  
  }
    function testJsonp() {
        $.ajax({
            type:'get',
            url:'http://192.168.43.73:8088/list',
            dataType:'jsonp',
            jsonp:"callback",
            jsonpCallback:"cb",
            success:function (data) {
                alert(data.callback+"  "+data.passWord);
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('出现错误了!!!'+errorThrown);
            }
        });
    }
    </script>
 <script>
window.onload = function(){
var vm = new Vue({
    el:'#box',
    data:{
        msg:'Hello World!',
    },
    methods:{
    	yy:function(data){
    	   this.msg = data.callback;
    	},
        get:function(){
            //发送get请求
            this.$http.jsonp("http://192.168.43.73:8088/list",{jsonp:"callback",jsonpCallback:"yy"}).then(function(res){
            	console.log("success");
            	this.yy($.parseJSON(res.bodyText));   
            },function(res){
                console.log('请求失败处理'+res.toString());
            });
        }
    }
});
}
</script>
</body>
</html>