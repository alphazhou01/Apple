<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% response.setHeader("Access-Control-Allow-Origin","*");
%>
<!DOCTYPE html>

<html>  
<head>  
  <title>视频直播</title>
  <meta charset="utf-8">  
  <link href="http://vjs.zencdn.net/5.5.3/video-js.css" rel="stylesheet">  
  <!-- If you'd like to support IE8 -->  
  <script src="http://vjs.zencdn.net/ie8/1.1.1/videojs-ie8.min.js"></script>  
  <script>videojs.options.flash.swf = "resources/video/video-js.swf";</script>
</head>  

<body>  

  <h1>直播测试</h1>  

 <video id="my-video" class="video-js" controls preload="auto" width="1920" height="1080"  

 poster="" data-setup="{}">  
    <!-- <source src="rtmp://10.168.4.37:10935/hls/stream_1" type="rtmp/flv">   -->
    <source src='rtmp://play.cnzchem.com/yejian/stream0' type="rtmp/flv"/>
    <p class="vjs-no-js">播放视频需要启用 JavaScript，推荐使用支持HTML5的浏览器访问。  
      To view this video please enable JavaScript, and consider upgrading to a web browser that  
      <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>  
    </p>  
 </video>  
<script src="http://vjs.zencdn.net/5.5.3/video.js"></script>  
</body>  

</html> 