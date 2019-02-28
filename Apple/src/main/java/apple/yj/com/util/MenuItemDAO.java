package apple.yj.com.util;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import apple.yj.com.pojo.MenuItem;

@Repository("MenuItemDAO")
public class MenuItemDAO {
private static final Logger logger = LoggerFactory.getLogger(MenuItemDAO.class);
	
	@Autowired
	private SessionFactory sf;
	
	private Session session;
	private boolean initialized    = false;
	
	public class Node{
		public MenuItem        Data;
		public boolean         isLeaf;
		public List<Node>  children;
	}
	
	private void _init() {
		initialized = true;
		session = sf.openSession();
	}
	
	private void _deinit() {
		if(session != null) {
			session.close();
		}
	}
	
	
	public List<Node> GetMenuTree(int menuid,int pid){
		List<Node> ret = new ArrayList<Node>();
		List<MenuItem> listtemp;
		
		if(initialized == false) {
			_init();
		}
		session.getTransaction().begin();
		Criteria cri = session.createCriteria(MenuItem.class);
		cri.add(Restrictions.and(Restrictions.eq("menu", menuid),Restrictions.eq("pid",pid)));
		listtemp = cri.list();
		session.getTransaction().commit();
		
		for(MenuItem item:listtemp) {
			Node  node = new Node();
			int pid1 = item.getId();
			node.Data   = item;
			node.isLeaf = item.getIs_leaf()==0?false:true;
			if(node.isLeaf == false) {
				node.children = GetMenuTree(menuid,pid1);
			} else {
				node.children = null;
			}
			ret.add(node);
		}
		return ret;
	}
	
}
