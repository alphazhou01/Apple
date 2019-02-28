<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page language="java" import="java.util.*"%>
<%@ page language="java" import="apple.yj.com.pojo.*"%>
 <div class="am-tabs" data-am-tabs="{noSwipe: 1}" id="doc-tab-demo-1">
  <ul class="am-tabs-nav am-nav am-nav-tabs">
    <li class="am-active"><a href="javascript: void(0)">成员列表</a></li>
    <li><a href="javascript: void(0)">工程列表</a></li>
    <li><a href="javascript: void(0)">组织机构</a></li>
  </ul>

  <div class="am-tabs-bd">
    <div class="am-tab-panel am-active">
          <div class="admin-content-body">
		      <ul class="am-avg-sm-1 am-avg-md-4 am-margin am-padding am-text-center admin-content-list " id="controll-panel">
		        <li><a class="am-text-warning" href="#"><label class="am-checkbox"><input type="checkbox" data-am-ucheck v-model="checked" @click="select_all()" /></label></li>
		        <li><a class="am-text-warning" href="#"><button type="button" class="am-btn am-btn-primary btn-loading-example"  @click="delete_select()" data-am-loading="{spinner: 'circle-o-notch', loadingText: '加载中...', resetText: '加载过了'}">删除</button></li>
		      </ul>

		      <div class="am-g" id="user-list">
		        <div class="am-u-sm-12">
		          <table class="am-table am-table-bd am-table-striped admin-content-table">
		            <thead>
		            <tr>
		              <th>选择</th><th>序列</th><th>ID</th><th>用户名</th><th>密码</th><th>管理</th>
		            </tr>
		            </thead>
		            <tbody>
		            <tr v-for="(user,index) in  users">
		                <td><label class="am-checkbox"><input type="checkbox" data-am-ucheck v-model="user.checked" /></label></td>
		                <td>{{index}}</td>
		                <td>{{user.id}}</td>
		                <td>{{user.name}}</td>
		                <td>{{user.password}}</td>
		                <td>
		                <div class="am-dropdown" data-am-dropdown="">
		                  <button class="am-btn am-btn-default am-btn-xs am-dropdown-toggle" data-am-dropdown-toggle=""><span class="am-icon-cog"></span> <span class="am-icon-caret-down"></span></button>
		                  <ul class="am-dropdown-content">
		                    <li><a href="#">1. 编辑</a></li>
		                    <li><a href="#">2. 下载</a></li>
		                    <li @click="remove(index)"><a href="#">3. 删除</a></li>
		                  </ul>
		                </div>
		              </td>
		            </tr>
		            </tbody>
		          </table>
		        </div>
		      </div>
		  </div>
    </div>
    <div class="am-tab-panel">
      ...
    </div>
    <div class="am-tab-panel">
      ...
    </div>
  </div>
</div>
<script>
var data_inf = {users:[
	<%
	List<Users> users;
	users = (List<Users>)request.getAttribute("users");
	for(int i =0; i < 10; i++){
		Users user = users.get(i);
		if(i != 0)
			out.print(",");
		out.print("{");
		out.print("checked:true,");
		out.print("index:"+i+",");
		out.print("id:"+user.getId()+",");
		out.print("name:'"+user.getName()+"',");
		out.print("password:'"+user.getPassword()+"'");
		out.print("}");
	}
	%>
	]
};

var list = new Vue({
el:"#user-list",
data:data_inf,
methods:{
	remove:function(index){
		 console.log("删除"+index);
		 this.users.splice(index, 1);
	}
}
});

var contrl = new Vue({
el:"#controll-panel",
data:{
	checked:true
},
methods:{
	select_all:function(){
		for(var j = 0,len = list.users.length; j < len; j++){
			list.users[j].checked=this.checked;
		}
	},
	delete_select:function(){
		for(var j = 0,len = list.users.length; j < len; ){
			if(list.users[j].checked == true){
				list.users.splice(j, 1);
				console.log("长度"+list.users.length);
				len = list.users.length;
				j=0;
			} else {
				j++;
			}
		}
	}
}
});
</script>