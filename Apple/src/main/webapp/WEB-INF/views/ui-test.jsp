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
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="renderer" content="webkit">
<link href="resources/img/logo.ico" rel="shortcut icon" type="image/x-icon" />
<link href="resources/css/am-ui/amazeui.css" rel="stylesheet" type="text/css">
<link href="resources/css/am-ui/amazeui.min.css" rel="stylesheet" type="text/css">
<link href="resources/css/am-ui/admin.css" rel="stylesheet" type="text/css">

</head>
<body>
  <header class="am-topbar am-topbar-inverse admin-header">
  <div class="am-topbar-brand">
    <strong>Certificate</strong> <small>管理平台</small>
  </div>
  <button class="am-topbar-btn am-topbar-toggle am-btn am-btn-sm am-btn-success am-show-sm-only" data-am-collapse="{target: '#topbar-collapse'}"><span class="am-sr-only">导航切换</span> <span class="am-icon-bars"></span></button>
  <div class="am-collapse am-topbar-collapse" id="topbar-collapse">
    <ul class="am-nav am-nav-pills am-topbar-nav am-topbar-right admin-header-list">
      <li><a href="javascript:;"><span class="am-icon-envelope-o"></span> 收件箱 <span class="am-badge am-badge-warning">5</span></a></li>
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
        <li><a href="admin-index.html"><span class="am-icon-home"></span> 首页</a></li>
        <li class="admin-parent">
          <a class="am-cf" data-am-collapse="{target: '#collapse-nav'}"><span class="am-icon-file"></span> 页面模块 <span class="am-icon-angle-right am-fr am-margin-right"></span></a>
          <ul class="am-list am-collapse admin-sidebar-sub am-in" id="collapse-nav">
            <li><a class="am-cf" href="admin-user.html"><span class="am-icon-check"></span> 个人资料<span class="am-icon-star am-fr am-margin-right admin-icon-yellow"></span></a></li>
            <li><a href="admin-help.html"><span class="am-icon-puzzle-piece"></span> 帮助页</a></li>
            <li><a href="admin-gallery.html"><span class="am-icon-th"></span> 相册页面<span class="am-badge am-badge-secondary am-margin-right am-fr">24</span></a></li>
            <li><a href="admin-log.html"><span class="am-icon-calendar"></span> 系统日志</a></li>
            <li><a href="admin-404.html"><span class="am-icon-bug"></span> 404</a></li>
          </ul>
        </li>
        <li><a href="admin-table.html"><span class="am-icon-table"></span> 表格</a></li>
        <li><a href="admin-form.html"><span class="am-icon-pencil-square-o"></span> 表单</a></li>
        <li><a href="#"><span class="am-icon-sign-out"></span> 注销</a></li>
      </ul>

      <div class="am-panel am-panel-default admin-sidebar-panel">
        <div class="am-panel-bd">
          <p><span class="am-icon-bookmark"></span> 公告</p>
          <p>时光静好，与君语；细水流年，与君同。—— Amaze UI</p>
        </div>
      </div>

      <div class="am-panel am-panel-default admin-sidebar-panel">
        <div class="am-panel-bd">
          <p><span class="am-icon-tag"></span> wiki</p>
          <p>Welcome to the Amaze UI wiki!</p>
        </div>
      </div>
    </div>
  </div>
  <!-- sidebar end -->

  <!-- content start -->
  <div class="admin-content">
    <div class="admin-content-body">
      <div class="am-cf am-padding">
        <div class="am-fl am-cf"><strong class="am-text-primary am-text-lg">首页</strong> / <small>一些常用模块</small></div>
      </div>


      <div class="am-g">
        <div class="am-u-md-6">
          <div class="am-panel am-panel-default">
            <div class="am-panel-hd am-cf" data-am-collapse="{target: '#collapse-panel-1'}">文件上传<span class="am-icon-chevron-down am-fr"></span></div>
            <div class="am-panel-bd am-collapse am-in" id="collapse-panel-1">
              <ul class="am-list admin-content-file">
                <li>
                  <strong><span class="am-icon-upload"></span> Kong-cetian.Mp3</strong>
                  <p>3.3 of 5MB - 5 mins - 1MB/Sec</p>
                  <div class="am-progress am-progress-striped am-progress-sm am-active">
                    <div class="am-progress-bar am-progress-bar-success" style="width: 82%">82%</div>
                  </div>
                </li>
                <li>
                  <strong><span class="am-icon-check"></span> 好人-cetian.Mp3</strong>
                  <p>3.3 of 5MB - 5 mins - 3MB/Sec</p>
                </li>
                <li>
                  <strong><span class="am-icon-check"></span> 其实都没有.Mp3</strong>
                  <p>3.3 of 5MB - 5 mins - 3MB/Sec</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="am-panel am-panel-default">
            <div class="am-panel-hd am-cf" data-am-collapse="{target: '#collapse-panel-2'}">浏览器统计<span class="am-icon-chevron-down am-fr"></span></div>
            <div class="am-in" id="collapse-panel-2">
              <table class="am-table am-table-bd am-table-bdrs am-table-striped am-table-hover">
                <tbody>
                <tr>
                  <th class="am-text-center">#</th>
                  <th>浏览器</th>
                  <th>访问量</th>
                </tr>
                <tr>
                  <td class="am-text-center"><img alt="" src="/i/examples/admin-chrome.png"></td>
                  <td>Google Chrome</td>
                  <td>3,005</td>
                </tr>
                <tr>
                  <td class="am-text-center"><img alt="" src="/i/examples/admin-firefox.png"></td>
                  <td>Mozilla Firefox</td>
                  <td>2,505</td>
                </tr>
                <tr>
                  <td class="am-text-center"><img alt="" src="/i/examples/admin-ie.png"></td>
                  <td>Internet Explorer</td>
                  <td>1,405</td>
                </tr>
                <tr>
                  <td class="am-text-center"><img alt="" src="/i/examples/admin-opera.png"></td>
                  <td>Opera</td>
                  <td>4,005</td>
                </tr>
                <tr>
                  <td class="am-text-center"><img alt="" src="/i/examples/admin-safari.png"></td>
                  <td>Safari</td>
                  <td>505</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="am-u-md-6">
          <div class="am-panel am-panel-default">
            <div class="am-panel-hd am-cf" data-am-collapse="{target: '#collapse-panel-4'}">任务 task<span class="am-icon-chevron-down am-fr"></span></div>
            <div class="am-panel-bd am-collapse am-in" id="collapse-panel-4">
              <ul class="am-list admin-content-task">
                <li>
                  <div class="admin-task-meta"> Posted on 25/1/2120 by John Clark</div>
                  <div class="admin-task-bd">
                    The starting place for exploring business management; helping new managers get started and experienced managers get better.
                  </div>
                  <div class="am-cf">
                    <div class="am-btn-toolbar am-fl">
                      <div class="am-btn-group am-btn-group-xs">
                        <button class="am-btn am-btn-default" type="button"><span class="am-icon-check"></span></button>
                        <button class="am-btn am-btn-default" type="button"><span class="am-icon-pencil"></span></button>
                        <button class="am-btn am-btn-default" type="button"><span class="am-icon-times"></span></button>
                      </div>
                    </div>
                    <div class="am-fr">
                      <button class="am-btn am-btn-default am-btn-xs" type="button">删除</button>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="admin-task-meta"> Posted on 25/1/2120 by 呵呵呵</div>
                  <div class="admin-task-bd">
                    基兰和狗熊出现在不同阵营时。基兰会获得BUFF，“装甲熊憎恨者”。狗熊会获得BUFF，“时光老人憎恨者”。
                  </div>
                  <div class="am-cf">
                    <div class="am-btn-toolbar am-fl">
                      <div class="am-btn-group am-btn-group-xs">
                        <button class="am-btn am-btn-default" type="button"><span class="am-icon-check"></span></button>
                        <button class="am-btn am-btn-default" type="button"><span class="am-icon-pencil"></span></button>
                        <button class="am-btn am-btn-default" type="button"><span class="am-icon-times"></span></button>
                      </div>
                    </div>
                    <div class="am-fr">
                      <button class="am-btn am-btn-default am-btn-xs" type="button">删除</button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="am-panel am-panel-default">
            <div class="am-panel-hd am-cf" data-am-collapse="{target: '#collapse-panel-3'}">最近留言<span class="am-icon-chevron-down am-fr"></span></div>
            <div class="am-panel-bd am-collapse am-in am-cf" id="collapse-panel-3">
              <ul class="am-comments-list admin-content-comment">
                <li class="am-comment">
                  <a href="#"><img width="48" height="48" class="am-comment-avatar" alt="" src="http://s.amazeui.org/media/i/demos/bw-2014-06-19.jpg?imageView/1/w/96/h/96"></a>
                  <div class="am-comment-main">
                    <header class="am-comment-hd">
                      <div class="am-comment-meta"><a class="am-comment-author" href="#">某人</a> 评论于 <time>2014-7-12 15:30</time></div>
                    </header>
                    <div class="am-comment-bd"><p>遵循 “移动优先（Mobile First）”、“渐进增强（Progressive enhancement）”的理念，可先从移动设备开始开发网站，逐步在扩展的更大屏幕的设备上，专注于最重要的内容和交互，很好。</p>
                    </div>
                  </div>
                </li>

                <li class="am-comment">
                  <a href="#"><img width="48" height="48" class="am-comment-avatar" alt="" src="http://s.amazeui.org/media/i/demos/bw-2014-06-19.jpg?imageView/1/w/96/h/96"></a>
                  <div class="am-comment-main">
                    <header class="am-comment-hd">
                      <div class="am-comment-meta"><a class="am-comment-author" href="#">某人</a> 评论于 <time>2014-7-12 15:30</time></div>
                    </header>
                    <div class="am-comment-bd"><p>有效减少为兼容旧浏览器的臃肿代码；基于 CSS3 的交互效果，平滑、高效。AMUI专注于现代浏览器（支持HTML5），不再为过时的浏览器耗费资源，为更有价值的用户提高更好的体验。</p>
                    </div>
                  </div>
                </li>

              </ul>
              <ul class="am-pagination am-fr admin-content-pagination">
                <li class="am-disabled"><a href="#">«</a></li>
                <li class="am-active"><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
                <li><a href="#">»</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="admin-content-footer">
      <hr>
      <p class="am-padding-left">© 2014 AllMobilize, Inc. Licensed under MIT license.</p>
    </footer>
  </div>
  <!-- content end -->
</div>
<div class="footer"></div>
<script src="http://www.jq22.com/jquery/jquery-2.1.1.js"></script>
<!-- <script src="resources/js/am-js/amazeui.js"></script> -->
<script src="resources/js/am-js/app.js"></script>
<script src="resources/js/am-js/amazeui.min.js"></script>
<!-- <script src="resources/js/am-js/amazeui.ie8polyfill.js"></script>
<script src="resources/js/am-js/amazeui.ie8polyfill.min.js"></script>
<script src="resources/js/am-js/amazeui.widgets.helper.js"></script>
<script src="resources/js/am-js/amazeui.widgets.helper.min.js"></script> -->
<script>
window.onload = function(){
var vm = new Vue({
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
            	console.log(res.bodyText);
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