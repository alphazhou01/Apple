<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% response.setHeader("Access-Control-Allow-Origin","*");%>
<!DOCTYPE html>
<html class="fixed-layout js cssanimations">
<head>
 <script src="resources/js/three/three.js"></script>
 <script src="resources/js/three/dat.gui.js"></script>
 <style>
        body   { margin: 100px; background-color: #000000; }
		canvas { width: 100%; height: 100% }
</style>
</head>
<body>
<script>
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
var geometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0xffff00});
var cube = new THREE.Mesh(geometry, material); 
scene.add(cube);
camera.position.z = 5;
function render() {
    requestAnimationFrame(render);
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    renderer.render(scene, camera);
}
render();
</script>
</body>
</html>