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
<div id="login">
    <div class="login-header">
    </div>
    <form >
        <div class="login-input-box">
            <span class="icon icon-user"></span>
            <input type="text" v-model="username" placeholder="输入您的账号">
        </div>
        <div class="login-input-box">
            <span class="icon icon-password"></span>
            <input type="password" v-model = "password" placeholder="输入您的密码">
        </div>
    </form>
    <div class="remember-box">
        <label>
            <input type="checkbox">&nbsp;记住密码
        </label>
    </div>
    <div class="login-button-box">
        <button  @click="login">登陆</button>
    </div>
    <div class="logon-box">
        <a href="">忘记密码?</a>
        <a href="register">注册</a>
    </div>
</div>
<script>
var vm = new Vue({
    el:'#login',
    data:{
        username:'zhou',
        password:'123456'
    },
    methods:{
    	yy:function(data){
    	   this.msg = data.callback;
    	},
        login:function(){
            //发送get请求
            this.$http.jsonp("http://localhost:8088/checkuser",{params:{username:this.username,password:this.password},jsonp:"callback",jsonpCallback:"yy"}).then(function(res){
            	console.log(res.bodyText);
            	var result = $.parseJSON(res.bodyText);
            	if(result.result == "fail"){
            		alert("登陆失败！"+result.message);	
            	} else {
            		alert("登陆成功");
            	}
            },function(res){
                console.log('请求失败处理'+res.toString());
            });
        }
    }
});
</script>
</body>
</html>