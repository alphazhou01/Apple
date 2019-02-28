<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page language="java" import="java.util.*"%>
<%@ page language="java" import="apple.yj.com.pojo.*"%>
<%@ page language="java" import="apple.yj.com.*"%>
<% List<DepartmentInfoWrap> depts;
depts = (List<DepartmentInfoWrap>)request.getAttribute("depts"); 
int total_depts = 0;
for(DepartmentInfoWrap dept:depts){
	total_depts += dept.getSubdeptcount();
}
%>
 <ul class="am-avg-sm-1 am-avg-md-4 am-margin am-padding am-text-center admin-content-list ">
        <li><a href="#" class="am-text-success"><span class="am-icon-btn am-icon-file-text"></span><br/>分公司<br/><% out.print(depts.size());%></a></li>
        <li><a href="#" class="am-text-warning"><span class="am-icon-btn am-icon-briefcase"></span><br/>项目总数<br/><% out.print(total_depts);%></a></li>
</ul>
<table class="am-table am-table-bd am-table-striped admin-content-table" id="pro-list">
  	<thead>
	  <tr>
	    <th>公司名称</th><th>项目数量</th><th>操作</th>
	  </tr>
	</thead>
	<tr v-for="(item,index) in projects" v-bind:index="index" >
	<td>{{item.name}}</td>
	<td>{{item.count}}</td>
	<td><button  @click='more(index)' type="button" class="am-btn am-btn-default am-round am-btn-xl">更多</button></td>
	</tr>
</table>
<script>

var list = new Vue({
	el:"#pro-list",
	data:{projects:[]},
	created:function(){
		htmlobj=$.ajax({url:"http://localhost:8080/com/getdata?type=ComInfos",async:false});
		this.projects = eval(htmlobj.responseText);
	},
	methods:{
		more:function(index){
			console.log(this.projects[index].name);
			$("#doc-tab-demo-1").AddTab(this.projects[index].name,"pro-detail"+index,true,true,"http://localhost:8080/com/pro-detail?id="+this.projects[index].ID); 
		},
	}
});

</script>

