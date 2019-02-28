package apple.yj.com.util;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import apple.yj.com.pojo.Users;
import apple.yj.com.pojo.BasicInfo;
import apple.yj.com.pojo.Department;

@Repository("DepartmentDAO")
public class DepartmentDAO {
	private static final Logger logger = LoggerFactory.getLogger(DepartmentDAO.class);
	
	@Autowired
	private SessionFactory sf;
    private Session session;
    
	public DepartmentDAO() {
		if(sf != null) {
			logger.info("open an session for DepartmentDAO");
			session = sf.openSession();
		} else {
			logger.info("SessionFactory is null");
			System.out.println("SessionFactory is null");
		}
	}
	
	@Override
	protected void finalize() throws Throwable {
		// TODO Auto-generated method stub
		super.finalize();
		logger.info("destroy instance of DepartmentDAO");
		if(session != null) {
			logger.info("close session");
			session.close();
		}
	}
	
	public List GetAllDeparments() {
		List<Department> results = null;
		Criteria         ctriteria;
		
		if(sf == null ) {
			System.out.println("sessionfactory is nll");
			return results;
		}
		session = sf.openSession();
		session.getTransaction().begin();
		ctriteria = session.createCriteria(Department.class);
	    ctriteria.setFetchSize(100);
	    results =  ctriteria.list();
	    session.getTransaction().commit();
	    session.close();
	    System.out.println("Department size results" +results.size());
		return results;
	}
	
	public List GetDeparmentsByLevel(int level) {
		List<Department> results = null;
		Criteria         ctriteria;
		session = sf.openSession();
		session.getTransaction().begin();
		ctriteria = session.createCriteria(Department.class);
		ctriteria.add(Restrictions.and(Restrictions.eq("F_NODE_LEVEL", level),Restrictions.eq("F_PARENT_DEPT_ID", 1),Restrictions.eq("F_STATE", "0")));
	    ctriteria.setFetchSize(100);
	    results =  ctriteria.list();
	    session.getTransaction().commit();
	    session.close();
		return results;
	}
	
	public List GetDeparmentsByLevel(int parent_id,int level) {
		List<Department> results = null;
		Criteria         ctriteria;
		session = sf.openSession();
		session.getTransaction().begin();
		ctriteria = session.createCriteria(Department.class);
		ctriteria.add(Restrictions.and(Restrictions.eq("F_NODE_LEVEL", level),Restrictions.eq("F_PARENT_DEPT_ID", parent_id),Restrictions.eq("F_STATE", "0")));
	    ctriteria.setFetchSize(100);
	    results =  ctriteria.list();
	    session.getTransaction().commit();
	    session.close();
		return results;
	}
	
	public Department GetDepartmentById(int id) {
		List<Department> results = null;
		Criteria         ctriteria;
		session = sf.openSession();
		session.getTransaction().begin();
		ctriteria = session.createCriteria(Department.class);
		ctriteria.add(Restrictions.eq("id", id));
	    ctriteria.setFetchSize(100);
	    results =  ctriteria.list();
	    session.getTransaction().commit();
	    session.close();
	    if(results.size() >0) {
	    	return results.get(0);
	    } else {
	    	return null;
	    }
	}
	
	
	public List GetDeparmentInfoById(int id) {
		List<BasicInfo> results = null;
		Criteria         ctriteria;
		
		if(sf == null ) {
			System.out.println("sessionfactory is nll");
			return results;
		}
		session = sf.openSession();
		session.getTransaction().begin();
		ctriteria = session.createCriteria(BasicInfo.class);
	    ctriteria.setFetchSize(100);
	    ctriteria.add(Restrictions.eq("F_DEPT_ID",id));
	    results =  ctriteria.list();
	    session.getTransaction().commit();
	    session.close();
	    System.out.println("Department size results" +results.size());
		return results;
	}
}
