<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page language="java" import="java.util.*"%>
<%@ page language="java" import="apple.yj.com.pojo.*"%>
<%@ page language="java" import="apple.yj.com.*"%>
<%@ page language="java" import="apple.yj.com.util.*"%>
<%@ page language="java" import="apple.yj.com.services.*"%>
<%
	String menutree = (String)request.getAttribute("MenuTreeHtml");
    out.print(menutree);
%>


<!-- <ul class="am-list admin-sidebar-list" id="collapase-nav-1">
  <li  class="am-panel">
    <a data-am-collapse="{parent: '#collapase-nav-1'}" href="#/"><i class="am-icon-home am-margin-left-sm"></i> 首页</a>
  </li>

  <li class="am-panel">
    <a data-am-collapse="{parent: '#collapase-nav-1', target: '#user-nav'}">
        <i class="am-icon-users am-margin-left-sm"></i> 人员管理 <i class="am-icon-angle-right am-fr am-margin-right"></i>
    </a>
    <ul class="am-list am-collapse admin-sidebar-sub" id="user-nav">
        <li class="am-panel"><a href="#/userAdd" data-am-collapse="{parent: '#collapase-nav-1', target: '#company-nav-3'}" ><i class="am-icon-user am-margin-left-sm"></i> 添加人员 </a>
	         <ul class="am-list am-collapse admin-sidebar-sub" id="company-nav-3">
	        <li><a href="#/companyAdd"><span class="am-icon-table am-margin-left-sm"></span> 添加单位（部门） </a></li>
	        <li><a href="#/companyList/0"><span class="am-icon-table am-margin-left-sm"></span> 单位（部门）列表 </a></li>
	         </ul>
        </li>
        <li><a href="#/userList/0"><i class="am-icon-user am-margin-left-sm"></i> 人员列表 </a></li>
    </ul>
  </li>

  <li class="am-panel">
    <a data-am-collapse="{parent: '#collapase-nav-1', target: '#company-nav'}">
        <i class="am-icon-table am-margin-left-sm"></i> 单位（部门）管理 <i class="am-icon-angle-right am-fr am-margin-right"></i>
    </a>
    <ul class="am-list am-collapse admin-sidebar-sub" id="company-nav">
        <li><a href="#/companyAdd"><span class="am-icon-table am-margin-left-sm"></span> 添加单位（部门） </a></li>
        <li><a href="#/companyList/0"><span class="am-icon-table am-margin-left-sm"></span> 单位（部门）列表 </a></li>
    </ul>
  </li>

  <li class="am-panel">
    <a data-am-collapse="{parent: '#collapase-nav-1', target: '#role-nav'}">
        <i class="am-icon-table am-margin-left-sm"></i> 角色管理 <i class="am-icon-angle-right am-fr am-margin-right"></i>
    </a>
    <ul class="am-list am-collapse admin-sidebar-sub" id="role-nav">
        <li><a href="#/roleAdd"><span class="am-icon-table am-margin-left-sm"></span> 添加角色 </a></li>
        <li><a href="#/roleList/0"><span class="am-icon-table am-margin-left-sm"></span> 角色列表 </a></li>
    </ul>
  </li>
</ul> -->

<!-- <ul class="am-list admin-sidebar-list" id="collapase-nav-2">
<li class="am-panel" >
<a data-am-collapse="{parent:'#collapase-nav-2',target:'#collapase-nav-20'}"> <i class="am-icon-users am-margin-left-sm"></i>项目管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a>
<ul class="am-list am-collapse admin-sidebar-sub" id="collapase-nav-20">
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-200'}"> <i class="am-icon-users am-margin-left-sm"></i>成本管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-201'}"> <i class="am-icon-users am-margin-left-sm"></i>物资管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-202'}"> <i class="am-icon-users am-margin-left-sm"></i>基础信息<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-203'}"> <i class="am-icon-users am-margin-left-sm"></i>机械设备管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-204'}"> <i class="am-icon-users am-margin-left-sm"></i>资金管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-205'}"> <i class="am-icon-users am-margin-left-sm"></i>投标管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-206'}"> <i class="am-icon-users am-margin-left-sm"></i>合同管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-207'}"> <i class="am-icon-users am-margin-left-sm"></i>劳务管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-208'}"> <i class="am-icon-users am-margin-left-sm"></i>专业分包管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-209'}"> <i class="am-icon-users am-margin-left-sm"></i>项目信息<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-2010'}"> <i class="am-icon-users am-margin-left-sm"></i>安全管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-2011'}"> <i class="am-icon-users am-margin-left-sm"></i>环境管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-2012'}"> <i class="am-icon-users am-margin-left-sm"></i>质量管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-2013'}"> <i class="am-icon-users am-margin-left-sm"></i>技术管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-2014'}"> <i class="am-icon-users am-margin-left-sm"></i>生产及工期管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-20',target:'#collapase-nav-2015'}"> <i class="am-icon-users am-margin-left-sm"></i>收尾管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
</ul></li>

<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-2',target:'#collapase-nav-21'}"> <i class="am-icon-users am-margin-left-sm"></i>流程管理<i class="am-icon-angle-right am-fr am-margin-right"></i></a> <ul class="am-list am-collapse admin-sidebar-sub" id="collapase-nav-21"><li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-21',target:'#collapase-nav-210'}"> <i class="am-icon-users am-margin-left-sm"></i>流程监控<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-21',target:'#collapase-nav-211'}"> <i class="am-icon-users am-margin-left-sm"></i>流程定义<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-21',target:'#collapase-nav-212'}"> <i class="am-icon-users am-margin-left-sm"></i>工作流分级监控<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-21',target:'#collapase-nav-213'}"> <i class="am-icon-users am-margin-left-sm"></i>历史数据迁移<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-21',target:'#collapase-nav-214'}"> <i class="am-icon-users am-margin-left-sm"></i>任务中心配置<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
</ul></li>

<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-2',target:'#collapase-nav-22'}"> <i class="am-icon-users am-margin-left-sm"></i>文档中心<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>

<li class="am-panel" ><a data-am-collapse="{parent:'#collapase-nav-2',target:'#collapase-nav-23'}"> <i class="am-icon-users am-margin-left-sm"></i>组织管理范围<i class="am-icon-angle-right am-fr am-margin-right"></i></a></li>
</ul> -->
