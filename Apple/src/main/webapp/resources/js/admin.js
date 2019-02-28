


window.onload = function(){
	var cert_info = new Vue({
		 el:'#collapse-nav',
		 data:{
			 certificates :[{name:"建筑一级建造师",ref:"admin"},
				 	 {name:"注册电气工程师",ref:"admin"},
					 {name:"市政一级建造师",ref:"admin"}
				 	]
		}
	});
}

$(function(){
	var tabs = $("#doc-tab-demo-1");
	tabs.InitTabs();
	$("#ll").click(function(){$("#oo").val(100);});
});

(function($){
	$.fn.ShowInfo = function(){
		var _this  = $(this);
		var li     = _this.find("li");
		alert(li.length);
		li.css("background","red");
	}
	$.fn.InitTabs  = function(){
		var _this  = $(this);
		window.tabs = new Vue({
			el  :"#doc-tab-demo-1",
			data:{
					tabs:[],
					active_id:-1,
					index:-1,
					adding_id:-1,
					removing_id:-1,
					act:true
				 },
			mounted: function(){
				    var ul = $(this).find("ul");
				    $(ul[0]).attr("id","#tabbar");
					},
			updated:function(){
				var span  = $("li#"+this.adding_id+" span");
				var li    = $("li#"+this.adding_id);
				
				if(this.adding_id != -1) {
					span.bind("click", function(){
						var id = $(this).parent("li").attr("id");
						var index;
						
						for ( var i = 0; i <window.tabs.tabs.length; i++){
						    var tab = window.tabs.tabs[i];
						    if(tab.ID == id) {
						    	index = i;
						    }
						}
						$(this).RemoveTab(index);
					});
					
					li.mousedown(function(){
						var id = $(this).attr("id");
						
						this.active_id = id;	
					});
					this.active_id = this.adding_id;
					$(".tab li").removeClass("active");
					$("#"+this.active_id).addClass("active");
					$(".tabs-bd div").removeClass("active-content");
					$("#content"+this.active_id).addClass("active-content");
					if(this.tabs[this.active_id].fromHref == true){
						$("#content"+this.active_id).load(this.tabs[this.active_id].url);
					}
					this.adding_id = -1;
				} 
				
				if(this.removing_id != -1){
					$(".tab li").removeClass("active");
					$("#"+this.active_id).addClass("active");
					$(".tabs-bd div").removeClass("active-content");
					$("#content"+this.active_id).addClass("active-content");
					this.removing_id = -1;
				}
				
				$(".am-tab-panel").css("display","none");
				$(".active").css("display","block");
				$(".active-content").css("display","block");
			},
			methods:{
				AddTabs:function(title,id,fromHref,content,active){
					this.tabs.push({NavTitle:title,ID:id,content:content,fromHref:fromHref,active:active});
					var $tab = $('#doc-tab-demo-1');
					$tab.tabs('refresh');
					if(this.active_id != -1){
						$("#tab"+this.active_id).removeClass("am-active");
						$("#content"+this.active_id).removeClass("am-active am-in");
					}
					
					$("#tab"+id).addClass("am-active");
					$("#content"+id).addClass("am-active am-in");
					this.active_id = id;
				},
				RemoveTab:function(id){
					
				},
				
				Click:function(index){
					console.log("change to "+index);
					this.Active(index);
				},
				Active:function(id){
					if(this.active_id != -1){
						$("#"+this.active_id).removeClass("am-active");
						$("#content"+this.active_id).removeClass("am-active am-in");
					}
					$("#"+id).addClass("am-active");
					$("#content"+id).addClass("am-active am-in");
				}
			}
		});
		
	  
	}
	
	$.fn.AddTab = function(title,content,fromHref,active,url){
		var id = window.tabs.tabs.length;
		if(active == true){
			for(var i=0;i< window.tabs.tabs.length;i++){
			   window.tabs.tabs[i].active = false;
			}
		}
		for(var i=0;i< window.tabs.tabs.length;i++){
		   if(window.tabs.tabs[i].NavTitle == title){
			   console.log("tabs has contain tab with title "+title);
			   return;
		   }
		}
		window.tabs.tabs.push({NavTitle:title,ID:id,content:content,fromHref:fromHref,active:active,url:url});
		window.tabs.adding_id = id;
		return id;
		
	}
	
	$.fn.RemoveTab = function(index){
		var id,ind;
	
		id = window.tabs.tabs[index].ID;
		window.tabs.removing_id = index;
		if(window.tabs.active_id == id && window.tabs.tabs.length > 1){
			if(index > 0 && index < window.tabs.tabs.length-1){
				ind = index-1;
			} else if(index == 0) {
				ind = 1;
			} else if(index == window.tabs.tabs.length-1) {
				ind = window.tabs.tabs.length-2;
			}
			window.tabs.active_id = window.tabs.tabs[ind].ID;
			$("#"+id).addClass("active");
		}
		
		window.tabs.tabs.splice(index,1);
	}
	
	$.fn.ChangeTab = function(){
		
	}
}
)(jQuery);

