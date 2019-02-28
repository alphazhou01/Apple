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
<table class="am-table am-table-bd am-table-striped admin-content-table">
  	<thead>
	  <tr>
	    <th>公司名称</th><th>项目数量</th><th>操作</th>
	  </tr>
	</thead>
<%
if(depts == null){
	out.print("depts is null");
} else {
	for(DepartmentInfoWrap dept:depts){
		out.println("<tr>");
		out.println("<td>");
		out.println(dept.getName());
		out.println("</td>");
		out.println("<td>");
		out.println(dept.getSubdeptcount());
		out.println("</td>");
		out.println("<td>");
		out.println("<button type=\"button\" class=\"am-btn am-btn-default am-round am-btn-xl\"><a href='pro-detail'>更多</a></button>");
		out.println("</td>");
		out.println("</tr>");
	}
}
%>
</table>
<script>

</script>