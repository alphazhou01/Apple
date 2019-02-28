function addtab(title,id){
	    var tabCounter = 0;
	    var $tab = $('#doc-tab-demo-1');
	   
	    var $nav = $tab.find('.am-tabs-nav');
	    var $bd = $tab.find('.am-tabs-bd');
	    var $t  = $nav.find("li#"+id);
	    if( $t.length != 0){
	    	console.log("tab id "+id+" already exist");
	    	return;
	    }
	    var nav = '<li  id='+id+'><span class="am-icon-close"></span>' +
	        '<a href="javascript: void(0)"> ' + title + '</a></li>';
	    var content = '<div class="am-tab-panel" id='+id+'-content></div>';
	    $nav.append(nav);
	    $bd.append(content);
	    $tab.tabs('refresh');
  }
