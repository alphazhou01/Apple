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
	
	var vm        = new Vue({
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
	            },function(res){
	                console.log('请求失败处理'+res.toString());
	            });
	        }
	    }
	});
	
	var dash_board = new Vue({
		el     :'#admin-offcanvas',
		data   :{},
		methods:{
			changeToContrustCert:function(){
				alert("changeToContrustCert");
			},
			changeToEletronicCert:function(){
				alert("changeToEletronicCert");
			}
		}
	});
	vm.get();
	
  
}