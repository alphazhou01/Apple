<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html class="fixed-layout js cssanimations">
<head>
<meta charset="utf-8">
<title>人员</title>
 <link rel="stylesheet" type="text/css" href="http://202.103.238.218:8685/resource/extjs/resources/css/ext-all-embedded-css/ext.axd?v=17013" />
	<link rel="stylesheet" type="text/css" href="http://202.103.238.218:8685/resource/extjs/resources/css/gtp-blue-embedded-css/ext.axd?v=17013" id="ext-theme" />

	<link rel="stylesheet" type="text/css" href="http://202.103.238.218:8685/resource/gtpnet/resources/css/gtp-all-embedded-css/gtp.axd?v=63170224184" />

	<link rel="stylesheet" type="text/css" href="http://202.103.238.218:8685/Portal/css/main.css?v=635749848100000000" />

	<link rel="stylesheet" type="text/css" href="http://202.103.238.218:8685/Portal/Frame/layoutE/css/default.css?v=635749848120000000" />

	<link rel="stylesheet" type="text/css" href="http://202.103.238.218:8685/Portal/Frame/layoutE/css/layout.css?v=635749848120000000" />

	<link rel="stylesheet" type="text/css" href="http://202.103.238.218:8685/Portal/Frame/layoutE/css/style.css?v=635749848120000000" />

	<link rel="stylesheet" type="text/css" href="http://202.103.238.218:8685/org/scripts/gjs.default.css?v=635749848100000000" />

	<link rel="stylesheet" type="text/css" href="http://202.103.238.218:8685/Portal/Frame/Public/css/layout.css?v=635749848120000000" />
	<script type="text/javascript" src="http://202.103.238.218:8685/resource/extjs/adapter/ext/ext-base-js/ext.axd?v=17013"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/resource/extjs/ext-all-js/ext.axd?v=17013"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/resource/extnet/extnet-core-js/ext.axd?v=17013"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/resource/extnet/extnet-data-js/ext.axd?v=17013"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/resource/extnet/locale/ext-lang-zh-CN-js/ext.axd?v=17013"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/resource/basex/build/ext-basex-js/gtp.axd?v=63170224184"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/resource/gtpnet/gtpnet-ext-js/gtp.axd?v=63170224184"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/resource/gtpnet/gtpnet-core-js/gtp.axd?v=63170224184"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/resource/gtpnet/locale/gtpnet-lang-zh-CN-js/gtp.axd?v=63170224184"></script>
	<script type="text/javascript">
	//<![CDATA[
		Gtp.net.Global.PageContext={timeDifference:Date.parseDate('2018-12-03T17:14:51.9478511+08:00','c') - new Date(),resourceVersion:'6367588789827496290',cultureKey:'zh_CN', fileServerConfig:({"ServerUrl":"http://202.103.238.218:8685/","ServerGuid":"3831","AuthorizeKey":"2018-12-03 17:14:51","LangID":"2052","KeyAlgo":"0602","SupportFiles":""}), userId:'4486', userName:'陈山', userCode:'CHENSHAN', deptId:'1151', deptCode:'0102021007', deptName:'物设科', deptFullName:'广西建工集团冶金建设有限公司/压力容器制造厂/物设科', employeeCode:''};
	//]]>
	</script>
	<script type="text/javascript" src="http://202.103.238.218:8685/org/scripts/gjs-all.js?v=635749848100000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/js/PTL.Frame.NaviTree.js?v=636174796300420141"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/js/public.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/js/FileLoader.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/js/DocAction.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/js/DialogManager.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Manage/js/PTL.Common.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Common/js/PTL.Desktop.MyDesktop.js?v=635749848100000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/pub/JQueryAdapter.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/pub/Common.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/pub/OrgFrameManage.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/Public/js/PTL.DesktopSet.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/Public/js/PTL.Navigator.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/Public/js/PTL.Navigator.Utils.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/Public/js/PTL.Navigator.FloatMenu.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/Public/js/PTL.User.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/Public/js/PTL.Banner.js?v=636174796300420141"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/Public/js/PTL.Theme.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/Public/js/PTL.TabManager.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/layoutE/js/PTL.User.Html.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/layoutE/js/PTL.Banner.Html.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/layoutE/js/PTL.Tabs.js?v=635749848120000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/Portal/Frame/layoutE/js/PTL.Navigator.Menu.js?v=635749848120000000"></script>
    <script type="text/javascript" src="resources/FileService/js/jquery.min.js"></script>
    <script type="text/javascript">
    <%
    	String conf  = (String)request.getAttribute("config");
    	out.println("var config="+conf);
    %>
    	
    </script>
    <script type="text/javascript" src="resources/FileService/js/GTPFileClient.js"></script>
 
	<script type="text/javascript" src="http://202.103.238.218:8685/GTP/AppFrameV2/Common/JS/AppFrame.Library.js?v=635940005900000000"></script>
	<script type="text/javascript" src="http://202.103.238.218:8685/GEPS/AppFrame/Common/JS/GEPS.Library.js?v=635941755440000000"></script>
</head>
<body>
<script type="text/javascript">
 $(function(){
	 $("#view").click(function(){
		 var ret;
		 //Ext.AppFrame.Attachment.ViewFile(301432, '人员持证表.xls', 'bda6a38b41e4496a8abcdf68cf8b07fc');
		 Ext.AppFrame.Attachment.ViewFile(301439, '陈莲造价员1.jpg', '7badf976550b43ecb785471137674f17');
		 //var uploadRet =  Ext.AppFrame.Attachment.FileClientUpload('C:\\Users\\admin\\Desktop\\out.csv');
		 
	 });
	 
	 
}) 
</script>
</body>
   <button id ="view" >查看文件</button>
   <input >
</html>