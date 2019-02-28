package apple.yj.com.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apple.yj.com.util.MenuItemDAO;

@Service("MenuService")
public class MenuService {
	@Autowired
	private MenuItemDAO itemdao;
	
	public class ListItem{
		private	String          id;
		private String          childrenid;
		private	List<ListItem>  children;
		private String          text;
		private List<String>    classes;
		private ListItem        parent;
		private int             level;
		
		public ListItem(String id) {
			this.id       = id;
			this.children = (List<ListItem>)new ArrayList<ListItem>();
			this.classes  = (List<String>)new ArrayList<String>();
			parent        = null;
			childrenid    = null;
		}
		
		public void SetText(String text) {
			this.text = text;
		}
		
		public void AddClass(String classstr) {
			this.classes.add(classstr);
		}
		
		public void SetParent(ListItem parent) {
			this.parent = parent;
		}
		
		public void AddChild(ListItem item) {
			this.children.add(item);
			item.parent = this;
		}
		
		public String GetId() {
			return this.id;
		}
		
		public void SetLevel(int level) {
			this.level = level;
		}
		
		public void SetId(String id) {
			this.id = id;
		}
		
		public String ConvertToHtml(String parentid,int index) {
			String   html;
			boolean  haschrildren;
			String   childrenid="";
			haschrildren = children.size() == 0 ? false:true;
			childrenid   = parentid+index;
			
			html =  String.format("<li %s ><a data-am-collapse=\"{parent:'#%s',target:'#%s'}\"> <i class=\"am-icon-users am-margin-left-sm\"></i>%s<i class=\"am-icon-angle-right am-fr am-margin-right\"></i></a>",
					"class=\"am-panel\"",parentid,childrenid,this.text);
			if(haschrildren) {
				html += String.format(" <ul class=\"am-list am-collapse admin-sidebar-sub\" id=\"%s\">", childrenid);
				int i=0;
				for(ListItem item:this.children) {
					html += item.ConvertToHtml(childrenid,i++);
				}
				html +="</ul>";
			}
			html += "</li>\r\n"; 
			return html;
		}
	}
	
	private ListItem NodeToHtmlItem(MenuItemDAO.Node node, String id,int level) {
		ListItem item = new ListItem(id);
		List<MenuItemDAO.Node> nodelist;
		item.SetText(node.Data.getName());
		item.SetLevel(level);
		if(node.isLeaf == false ) {
			nodelist = node.children;
			for(MenuItemDAO.Node nodetemp:nodelist) {
				ListItem itemtemp = null;
				if(nodetemp.isLeaf == true) {
					itemtemp = new ListItem("");
					itemtemp.SetText(nodetemp.Data.getName());
				}else if(nodetemp.children.size()!=0){
					itemtemp = NodeToHtmlItem(nodetemp,"",level+1);
				}
				item.SetLevel(level+1);
				item.AddChild(itemtemp);
			}
		}
		return item;
	}
	
	//返回List<ListItem>
	public List GetMenuTree(int pid) {
		List<MenuItemDAO.Node> nodelist;
		int i = 0;
		List<ListItem>         ret = new ArrayList<ListItem>();
		nodelist = itemdao.GetMenuTree(200013, pid);
	    for(MenuItemDAO.Node node:nodelist) {
	    	ListItem item = NodeToHtmlItem(node,i+"0",0);
	    	ret.add(item);
	    }
	    return ret;
	}
	
	public String FormatMenuHtml(List<ListItem> items) {
		String html = "<ul class=\"am-list admin-sidebar-list\" id=\"collapase-nav-2\">";
		int    i = 0;
			for(ListItem item:items) {
				html += item.ConvertToHtml("collapase-nav-2",i++);
				html +="\r\n";
			}
			html += "</ul>";
		return html;
	}
}
