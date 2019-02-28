<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page language="java" import="java.util.*"%>
<%@ page language="java" import="apple.yj.com.pojo.*"%>
<!DOCTYPE html>
<html class="fixed-layout js cssanimations">
<head>
	<meta charset="utf-8">
	<title>人员</title>
	<script src="https://cdn.bootcss.com/vue/2.4.2/vue.min.js"></script>
	<script src="https://cdn.bootcss.com/vue-resource/1.5.1/vue-resource.min.js"></script>
	<!-- <meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="renderer" content="webkit"> -->
	<link href="resources/img/logo.ico" rel="shortcut icon" type="image/x-icon" />
	<link href="resources/css/am-ui/amazeui.css" rel="stylesheet" type="text/css">
	
	<link href="resources/css/am-ui/admin.css" rel="stylesheet" type="text/css">
	<link href="resources/css/admin.css" rel="stylesheet" type="text/css">
	<script src="http://www.jq22.com/jquery/jquery-2.1.1.js"></script>
	<!-- <script src="resources/js/am-js/amazeui.js"></script> -->
	<script src="resources/js/common.js"></script>
	
	<script src="resources/js/admin.js"></script>
  <script src="resources/js/am-js/amazeui.min.js"></script>
</head>

<style>
body
{
	background-color:#d0e4fe;
	font-size:10px;
}
button
{
	font-size:10px;
}
h1
{
	color:orange;
	text-align:center;
}
p
{
	font-family:"Times New Roman";
	
}
.am-tabs-bd
{
	
}
.am-tabs-nav .am-icon-close {
    position: absolute;
    top: 0px;
    right: 10px;
    color: #888;
    cursor: pointer;
    z-index: 100;
}


</style>
<body>
  <header class="am-topbar am-topbar-inverse admin-header">
  <div class="am-topbar-brand">
    <strong></strong> <small>管理平台</small>
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
  <jsp:include page="sider.jsp" />
  <!-- sidebar end -->
  <!-- content start -->
  <div class="admin-content" id="content-container">
  	<div id="doc-tab-demo-1">
	  <ul class="tab" >
	 	 <li v-for="(tab,index) in tabs"  @click="Click()" v-bind:id="tab.ID" ><span></span><a href="javascript: void(0)">{{tab.NavTitle}}</a></li>
	  </ul>
	  <div class="tabs-bd">
	     <div class="am-tab-panel" v-for="tab in tabs" v-bind:id="'content'+tab.ID"></div>
  </div>
  </div>
  <!-- content end -->
 <footer class="admin-content-footer">
      <hr>
      <p class="am-padding-left">© 2014 AllMobilize, Inc. Licensed under MIT license.</p>
 </footer>
</body>
</html>