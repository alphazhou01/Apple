<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% response.setHeader("Access-Control-Allow-Origin","*");%>
<!DOCTYPE html>
<html class="fixed-layout js cssanimations">
<head>
<meta charset="utf-8">
<title>证书</title>
<script src="https://cdn.bootcss.com/vue/2.4.2/vue.min.js"></script>
<script src="https://cdn.bootcss.com/vue-resource/1.5.1/vue-resource.min.js"></script>
<!-- <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="renderer" content="webkit"> -->
<link href="resources/img/logo.ico" rel="shortcut icon" type="image/x-icon" />
<link href="resources/css/am-ui/amazeui.css" rel="stylesheet" type="text/css">
<!-- <link href="resources/css/am-ui/amazeui.min.css" rel="stylesheet" type="text/css"> -->
<link href="resources/css/am-ui/admin.css" rel="stylesheet" type="text/css">
<script src="http://www.jq22.com/jquery/jquery-2.1.1.js"></script>
<!-- <script src="resources/js/am-js/amazeui.js"></script> -->
<!-- <script src="resources/js/am-js/app.js"></script> -->
<script src="resources/js/am-js/amazeui.min.js"></script>
<!-- <script src="resources/js/am-js/amazeui.ie8polyfill.js"></script>
<script src="resources/js/am-js/amazeui.ie8polyfill.min.js"></script>
<script src="resources/js/am-js/amazeui.widgets.helper.js"></script>
<script src="resources/js/am-js/amazeui.widgets.helper.min.js"></script> -->
</head>
<body>
  <header class="am-topbar am-topbar-inverse admin-header">
  <div class="am-topbar-brand">
    <strong>Certificate</strong> <small>管理平台</small>
  </div>
  <button class="am-topbar-btn am-topbar-toggle am-btn am-btn-sm am-btn-success am-show-sm-only" data-am-collapse="{target: '#topbar-collapse'}"><span class="am-sr-only">导航切换</span> <span class="am-icon-bars"></span></button>
  <div class="am-collapse am-topbar-collapse" id="topbar-collapse">
    <ul class="am-nav am-nav-pills am-topbar-nav am-topbar-right admin-header-list">
      <li><a href="javascript:;"><span class="am-icon-envelope-o"></span> 消息 <span class="am-badge am-badge-warning">5</span></a></li>
      <li class="am-dropdown" data-am-dropdown="">
        <a class="am-dropdown-toggle" href="javascript:;" data-am-dropdown-toggle="">
          <span class="am-icon-users"></span> 管理员 <span class="am-icon-caret-down"></span>
        </a>
        <ul class="am-dropdown-content">
          <li><a href="#"><span class="am-icon-user"></span> 资料</a></li>
          <li><a href="#"><span class="am-icon-cog"></span> 设置</a></li>
          <li><a href="#"><span class="am-icon-power-off"></span> 退出</a></li>
        </ul>
      </li>
      <li class="am-hide-sm-only"><a id="admin-fullscreen" href="javascript:;"><span class="am-icon-arrows-alt"></span> <span class="admin-fullText">开启全屏</span></a></li>
    </ul>
  </div>
</header>

 <div class="am-cf admin-main">
  <!-- sidebar start -->
  <div class="admin-sidebar am-offcanvas" id="admin-offcanvas">
    <div class="am-offcanvas-bar admin-offcanvas-bar">
      <ul class="am-list admin-sidebar-list">
        <li><a href="admin"><span class="am-icon-home"></span> 首页</a></li>
        <li class="admin-parent">
          <a class="am-cf" data-am-collapse="{target: '#collapse-nav'}"><span class="am-icon-file"></span> 证件信息 <span class="am-icon-angle-right am-fr am-margin-right"></span></a>
          <ul class="am-list am-collapse admin-sidebar-sub am-in" id="collapse-nav" >
            <li><a v-for="info in certificates" class="am-cf" v-bind:href="[info.ref]"><span class="am-icon-file"></span> {{info.name}}<span class="am-icon-star am-fr am-margin-right admin-icon-yellow "></span></a></li>
          </ul>
        </li>
        <li><a href="admin-table.html"><span class="am-icon-user-md"></span> 人员信息</a></li>
        <li><a href="admin-form.html"><span class="am-icon-pencil-square-o"></span> 项目信息</a></li>
      </ul>
    </div>
  </div>
  <!-- sidebar end -->
  <!-- content start -->
  <div class="admin-content">
    <div class="admin-content-body">
    <footer class="admin-content-footer">
      <hr>
      <p class="am-padding-left">© 2014 AllMobilize, Inc. Licensed under MIT license.</p>
    </footer>
  </div>
  <!-- content end -->
</div>
<div class="footer"></div>

<script>
window.onload = function(){
var cert_info = new Vue({
	 el:'#collapse-nav',
	 data:{
		 certificates :[{name:"建筑一级建造师",ref:"admin"},
			 	 {name:"注册电气工程师",ref:"www.sina.com"},
				 {name:"市政一级建造师",ref:"www.sina.com"}
			 	]
	}
});
var vm        = new Vue({
    el:'#user-table',
    data:{
    	people: []
    },
    methods:{
    	yy:function(data){
    	   this.msg = data.callback;
    	},
        get:function(){
            //发送get请求
            this.$http.jsonp("http://localhost:8088/list",{jsonp:"callback",jsonpCallback:"yy"}).then(function(res){
            	console.log("success");
            	this.people = $.parseJSON(res.bodyText);   
            },function(res){
                console.log('请求失败处理'+res.toString());
            });
        }
    }
});
vm.get();
}
</script>
</body>
</html>