package apple.yj.com.services;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apple.yj.com.DepartmentInfoWrap;
import apple.yj.com.pojo.BasicInfo;
import apple.yj.com.pojo.Department;
import apple.yj.com.util.DepartmentDAO;

@Service("ProjectService")
public class ProjectService {
	private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);
	@Autowired
	private DepartmentDAO deptDAO;
	ProjectService(){
		System.out.println("ProjectService ------------init");
	}
	
	public List GetAllDeptments() {
		List<Department> results = null;
		results = (List<Department>)deptDAO.GetAllDeparments();
		return results;
	}
	
	public List GetDepartmentsToplevel() {
		List<Department> results = null;
		results = (List<Department>)deptDAO.GetDeparmentsByLevel(1);
		return results;
	}
	
	public List GetAllSecDeptInfo() {
		List<DepartmentInfoWrap> results = new ArrayList();
		List<Department> secondLevel = null,list;
		DepartmentInfoWrap wrap;
		
		secondLevel = (List<Department>)deptDAO.GetDeparmentsByLevel(1);
		if(secondLevel != null) {
			for(Department temp: secondLevel) {
				int id = temp.getId();
				
				wrap = new DepartmentInfoWrap();
				wrap.setName(temp.getF_NAME());
				list = deptDAO.GetDeparmentsByLevel(id, 4);
				wrap.setID(id);
				wrap.setSubdeptcount(list.size());
				results.add(wrap);
			}
		} else {
			logger.error("get second level Departments fail");
		}
		return results;
	}
	
	public List GetDeptByComId(int id) {
		List<Department> depts = null;
		
		depts = (List<Department>)deptDAO.GetDeparmentsByLevel(id, 4);
		return depts;
	}
	
	public DepartmentInfoWrap GetDepartmentInfo(int id) {
		DepartmentInfoWrap info = new DepartmentInfoWrap();
		List<BasicInfo> infos   = deptDAO.GetDeparmentInfoById(id);
		BasicInfo       basicinfo;
		Department      dept = null;
		int             deptid;
		String          comname;
		
		if(infos.size() > 0) {
			logger.warn("duplicate infomation of id:"+id);
		}
		logger.info("loading department information,id:"+id);
		
		basicinfo = infos.get(0);
		deptid    = basicinfo.getF_DEPT_ID();
		dept      = deptDAO.GetDepartmentById(deptid);
		
		if(dept != null) {
			String fullname = dept.getF_FULL_DEPT_NAME();
			String Names[]  = fullname.split("/");
			comname         = Names[1];
			
		} else {
			logger.error("无法找到 与ID"+deptid+"相对应的项目信息");
			comname = null;
		}
		
		info.setChargePerson(basicinfo.getF_XMFZR());
		info.setManager(basicinfo.getF_XMJL());
		info.setCode(basicinfo.getF_CODE());
		info.setName(dept.getF_NAME());
		info.setConstructCom(basicinfo.getF_JSDW());
		info.setCompnayName(comname);
		info.setOpenTime(dept.getF_CREATE_TIME().toLocaleString());
		info.setRecordTime(basicinfo.getF_CREATE_TIME().toString());
		return info;
	}
	
	@Override
	protected void finalize() throws Throwable {
		// TODO Auto-generated method stub
		super.finalize();
	}
}
