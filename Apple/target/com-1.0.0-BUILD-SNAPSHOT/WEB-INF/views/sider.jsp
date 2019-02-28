 <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
  <div class="admin-sidebar am-offcanvas" id="admin-offcanvas">
    <div class="am-offcanvas-bar admin-offcanvas-bar">
      <ul class="am-list admin-sidebar-list">
       <li class="admin-parent">
          <a href='?content=construction' class="am-cf"><span class="am-icon-file"></span>人员信息</span></a>
        </li>
        <li class="admin-parent" id='project-info'>
          <a  class="am-cf" @click="load()"><span class="am-icon-file"></span>工程信息</a>
        </li>
        <li class="admin-parent"><a data-am-collapse="{target: '#collapse-nav'}"><span class="am-icon-user-md"></span>工程文档<span class="am-icon-angle-right am-fr am-margin-right"></span></a>
            <ul class="am-list am-collapse admin-sidebar-sub am-in" id="collapse-nav" >
            	<li><a v-for="(info,index) in certificates" class="am-cf" @click="changeToContrustCert(index)" ><span class="am-icon-file"></span> {{info.name}}<span class="am-icon-star am-fr am-margin-right admin-icon-yellow "></span></a></li>
          	</ul>
        </li>
        <li class="admin-parent">
          <a class="am-cf"><span class="am-icon-file"></span>施工管理<span class="am-icon-angle-right am-fr am-margin-right"></span></a>
        </li>
         <li class="admin-parent" id='safty'>
          <a class="am-cf"  @click="load()"><span class="am-icon-file"></span>安全管理<span class="am-icon-angle-right am-fr am-margin-right"></span></a>
        </li>
      </ul>
    </div>
  </div>
  
 <div class="am-modal am-modal-no-btn" tabindex="-1" id="your-modal">
  <div class="am-modal-dialog">
    <div class="am-modal-hd">正在载入
      <a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>
    </div>
    <div class="am-modal-bd">
      <span class="am-icon-spinner am-icon-spin"></span>
    </div>
  </div>
</div>
  
 <script>
 jQuery.fn.hi = function(){
	 alert(this);
 };

 var t = $("#your-modal"); 
 t.click(function(){
	 var t = this;
	 $(t).css("");
 });
  new Vue({
  	el:"#project-info",
  	data:{
  	},
  	methods:{
  		    load:function(index){
  		    var $modal = $('#your-modal');
  		    $modal.modal();
  		    addtab("项目信息","projects");
  		    console.log("load start");
  			$("#projects-content").load("/com/load?content=projects",function(){$modal.modal('close');});
  			console.log("load finish");
  		}
  	}
  });
  
  new Vue({
	  	el:"#safty",
	  	data:{
	  	},
	  	methods:{
	  		    load:function(index){
	  		    var $modal = $('#your-modal');
	  		    $modal.modal();
	  		    addtab("安全管理","safty");
	  		    console.log("load start");
	  			$("#safty-content").load("/com/load?content=safty",function(){$modal.modal('close');});
	  			console.log("load finish");
	  		}
	  	}
	  });
  
  new Vue({
    	el:"#collapse-nav",
    	data:{
    		certificates:[{name:'施工合同',params:'contract'},
    			{name:'施工许可证',params:'licence'},
    			{name:'竣工报告',params:'completed_report'},
    			]
    	},
    	methods:{
    		changeToContrustCert:function(index){
    		}
    	}
    });
  
  $(function() {
	    var $modal = $('#your-modal');
	    $modal.siblings('.am-btn').on('click', function(e) {
	      var $target = $(e.target);
	      if (($target).hasClass('js-modal-open')) {
	        $modal.modal();
	      } else if (($target).hasClass('js-modal-close')) {
	        $modal.modal('close');
	      } else {
	        $modal.modal('toggle');
	      }
	    });
	  });
 </script>