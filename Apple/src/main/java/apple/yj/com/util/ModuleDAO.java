package apple.yj.com.util;

import java.util.ArrayList;
import java.util.List;
import java.util.TreeSet;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import apple.yj.com.pojo.ModuleNode;

public class ModuleDAO {
	private static final Logger logger = LoggerFactory.getLogger(ModuleDAO.class);
	
	@Autowired
	private SessionFactory sf;
	
	private Session session;
	private boolean initialized    = false;
	public  class Node{
		private ModuleNode      data;
		private List<Node> child;
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
	Node getModuleTree() {
		Node topnode = new Node();
		
		if(initialized == false) {
			_init();
		}

		return topnode;
	}
	
	List getChildrenModule(int pid) {
		List<ModuleNode> ret;
		logger.info("get module whoes pid is "+pid);
		session.getTransaction().begin();
		Criteria cri = session.createCriteria(ModuleNode.class);
		cri.add(Restrictions.eq("pid", pid));
		ret = cri.list();
		session.getTransaction().commit();
		return ret;
	}
}
