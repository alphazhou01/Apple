package apple.yj.com.pojo;

import static org.junit.Assert.*;

import java.net.URL;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.criterion.Restrictions;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import apple.yj.com.util.MenuItemDAO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class SudentTest {

	private SessionFactory sf;
	private MenuItemDAO dao;
	private Log log = LogFactory.getLog(SudentTest.class);
   @Before
	     public void setUp(){
	         ApplicationContext ac=new ClassPathXmlApplicationContext("file:F:\\workspace\\workspace-sub\\Apple\\src\\main\\webapp\\WEB-INF\\spring\\root-context.xml");
	         sf  = (SessionFactory) ac.getBean("sessionFactory");
	         dao = (MenuItemDAO)ac.getBean("MenuItemDAO");
	     }
	
	
	@Test
	public void query() {
		    List<Users> users;
		    System.out.println("open session");
	        Session session = sf.openSession();
	        //事务开始
	        System.out.println(" begin transaction");
	        session.beginTransaction();
	        Criteria ctriteria;
	        
	        ctriteria = session.createCriteria(Users.class);
	        ctriteria.setMaxResults(100);
	        users =  ctriteria.list();
	        
	        System.out.println(users.size());
	        //提交事务
	        System.out.println("commit -----");
	        session.getTransaction().commit();
	        //关闭session
	        int i = 0;
	        for(Users u: users) {
	        	//System.out.println(u.getName()+"   "+ u.getPassword() + " "+u.getSex());
	        }
	        session.close();
	}
	
	@Test
	public void moduleTest() {
		    List<ModuleNode> modules;
		    System.out.println("open session");
	        Session session = sf.openSession();
	        //事务开始
	        System.out.println(" begin transaction");
	        session.beginTransaction();
	        Criteria ctriteria;
	        
	        ctriteria = session.createCriteria(ModuleNode.class);
	        ctriteria.setMaxResults(100);
	        ctriteria.add(Restrictions.and(Restrictions.like("code", "GEPS.Safety%"),Restrictions.eq("level", 3)));
	        ctriteria.setFetchSize(100);
	        modules =  ctriteria.list();
	        
	        System.out.println(modules.size());
	        //提交事务
	        System.out.println("commit -----");
	        session.getTransaction().commit();
	        //关闭session
	        int i = 0;
	        for(ModuleNode u: modules) {
	        	System.out.println(u.getName()+u.getFullcode()+" "+u.getStatus());
	        }
	        session.close();
	}
	
	@Test
	public void MenuTest() {
		    List<Menu> menus;
		    System.out.println("open session");
	        Session session = sf.openSession();
	        //事务开始
	        System.out.println(" begin transaction");
	        session.beginTransaction();
	        Criteria ctriteria;
	        
	        ctriteria = session.createCriteria(Menu.class);
	        ctriteria.setMaxResults(100);
	      
	        ctriteria.setFetchSize(100);
	        menus =  ctriteria.list();
	        
	        System.out.println(menus.size());
	        //提交事务
	        System.out.println("commit -----");
	        session.getTransaction().commit();
	        //关闭session
	        int i = 0;
	        for(Menu u: menus) {
	        	System.out.println(u.getName());
	        }
	        session.close();
	}
	
	@Test
	public void MenuItemTest() {
		    List<MenuItem> menus;
		    System.out.println("open session");
	        Session session = sf.openSession();
	        //事务开始
	        System.out.println(" begin transaction");
	        session.beginTransaction();
	        Criteria ctriteria;
	        
	        ctriteria = session.createCriteria(MenuItem.class);
	        //ctriteria.setMaxResults(1);
	      
	      
	        menus =  ctriteria.list();
	        System.out.println(menus.size());
	        //提交事务
	        System.out.println("commit -----");
	        session.getTransaction().commit();
	        //关闭session
	        int i = 0;
	        for(MenuItem u: menus) {
	        	System.out.println(u.getName()+ " "+ u.getMenu() + " "+ u.getModule());
	        }
	        session.close();
	}
	
	@Test
	public void BasicTest() {
		    List<BasicInfo> infos;
		    System.out.println("open session");
	        Session session = sf.openSession();
	        //事务开始
	        System.out.println(" begin transaction");
	        session.beginTransaction();
	        Criteria ctriteria;
	        
	        ctriteria = session.createCriteria(BasicInfo.class);
	        //ctriteria.setMaxResults(1);
	      
	      
	        infos =  ctriteria.list();
	        System.out.println(infos.size());
	        //提交事务
	        System.out.println("commit -----");
	        session.getTransaction().commit();
	        //关闭session
	        int i = 0;
	        for(BasicInfo u: infos) {
	        	System.out.println(u.getF_GCDD());
	        }
	        session.close();
	}
	
	@Test
	public void BasicGXTest() {
		    List<BasicInfoXGT> infos;
		    System.out.println("open session");
	        Session session = sf.openSession();
	        //事务开始
	        System.out.println(" begin transaction");
	        session.beginTransaction();
	        Criteria ctriteria;
	        
	        ctriteria = session.createCriteria(BasicInfoXGT.class);
	        //ctriteria.setMaxResults(1);
	      
	      
	        infos =  ctriteria.list();
	        System.out.println(infos.size());
	        //提交事务
	        System.out.println("commit -----");
	        session.getTransaction().commit();
	        //关闭session
	        int i = 0;
	        for(BasicInfoXGT u: infos) {
	        	System.out.println(u.getF_MC());
	        }
	        session.close();
	}
	
	private void PrintTree(List<MenuItemDAO.Node> nodes,int level) {
		int level1=level,level2=level;
		for(MenuItemDAO.Node node:nodes) {
			level1 = level2;
			while(0 != level1--)
			    System.out.print("****");
			System.out.println(node.Data.getName());
		
			if(node.isLeaf == false) {
				PrintTree(node.children,++level);
			}
		}
	}
	@Test
	public void MenuItemDAOTest() {	
		List<MenuItemDAO.Node> nodes =  dao.GetMenuTree(200013,0);
		PrintTree(nodes,0);  
	}
	
	@Test
	
	public void StringTest() {
		System.out.println(String.format("\"%s", "kkkkkkkkkkk"));
	}
	
	@Test
	
	public void StringLog() {
		URL urlOfClass = SudentTest.class.getClassLoader().getResource("org/slf4j/spi/LocationAwareLogger.class");
		System.out.println(urlOfClass);
		log.debug("hello");
		System.out.println(log.getClass().getName());
	}
	
	@Test
	public void AttachmentInfo() {
		 List<AttachmentInfo> infos;
		    System.out.println("open session");
	        Session session = sf.openSession();
	        //事务开始
	        System.out.println(" begin transaction");
	        session.beginTransaction();
	        Criteria ctriteria;
	        
	        ctriteria = session.createCriteria(AttachmentInfo.class);
	      
	      
	        infos =  ctriteria.list();
	        System.out.println(infos.size());
	        //提交事务
	        System.out.println("commit -----");
	        session.getTransaction().commit();
	        //关闭session
	        int i = 0;
	        for(AttachmentInfo u: infos) {
	        	System.out.println(u.getF_NAME());
	        }
	        session.close();
	}
	
	@Test
	public void DepartmentTest() {
		 List<Department> infos;
		    System.out.println("open session");
	        Session session = sf.openSession();
	        //事务开始
	        System.out.println(" begin transaction");
	        session.beginTransaction();
	        Criteria ctriteria;
	        
	        ctriteria = session.createCriteria(Department.class);
	    	ctriteria.add(Restrictions.and(Restrictions.eq("F_NODE_LEVEL", 1),Restrictions.eq("F_PARENT_DEPT_ID", 1),Restrictions.eq("F_STATE", "0")));
	      
	        infos =  ctriteria.list();
	        System.out.println(infos.size());
	        //提交事务
	        System.out.println("commit -----");
	        session.getTransaction().commit();
	        //关闭session
	        int i = 0;
	        for(Department u: infos) {
	        	System.out.println(u.getF_NAME()+u.getF_CREATE_TIME());
	        }
	        session.close();
	}
	
	@Test
	public void JsonTest() {
		JSONObject person = new JSONObject();
		JSONObject mate = new JSONObject();
		JSONArray array = new JSONArray();
		
		person.accumulate("name", "zhou");
		person.accumulate("age", 10);
		array.add("zhou");
		array.add(10);
		mate.accumulate("student", person);
		mate.accumulate("a", array);
		System.out.println(mate.toString());
	}
}
