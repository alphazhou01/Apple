package apple.yj.com;

import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.support.RequestContextUtils;

import com.mysql.cj.x.protobuf.MysqlxDatatypes.Array;

import apple.yj.com.pojo.Department;
import apple.yj.com.services.ProjectService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@RestController
public class DataProccess {
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	@Autowired
	HttpServletRequest req;
	@Autowired
	ServletContext servletctx;
	
	@RequestMapping(value = "/getdata", method = RequestMethod.GET,produces="application/json;charset=utf-8" )
	String GetData(@RequestParam("type") String type) {
		JSONObject  json;
		String ret = null;
		JSONArray array = new JSONArray();
		System.out.println(type);
		
		if(type.equals("ComInfos") == true) {
		    	List<Department> depts;
		    	List<DepartmentInfoWrap> infos;
		    	
		    	ProjectService ProService = null;
			    WebApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(req.getSession().getServletContext());
			    WebApplicationContext springMVCContext = RequestContextUtils.findWebApplicationContext(req,servletctx);
			    ProService = (ProjectService) springMVCContext.getBean("ProjectService");
			   
			    try {
					req.setCharacterEncoding("UTF-8");
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			    if(ProService == null) {
			    	logger.error("can not get bean ProjectService");
			    	return "error";
			    }
			    
			    depts = ProService.GetDepartmentsToplevel();
			    infos = ProService.GetAllSecDeptInfo();
			    
			    for (DepartmentInfoWrap wrap:infos) {
			    	JSONObject dept = new JSONObject();
			    	dept.accumulate("name", wrap.name);
			    	dept.accumulate("count", wrap.getSubdeptcount()); 
			    	dept.accumulate("ID", wrap.getID());
			    	array.add(dept);
			    }
			    
			    if(depts==null) {
			    	System.out.print("dept is null");
			    	logger.info("dept is null");
			    }
		    }
		System.out.println(array.toString());
		return array.toString();
	}
	
	@RequestMapping(value="/dept-list",method = RequestMethod.GET,produces="application/json;charset=utf-8")
	String ListDeptOfComp(@RequestParam("deptid") String id) {
		JSONObject  json  = new JSONObject();
		JSONArray   jsonarr = new JSONArray();
		ProjectService ProService = null;
	    WebApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(req.getSession().getServletContext());
	    WebApplicationContext springMVCContext = RequestContextUtils.findWebApplicationContext(req,servletctx);
	    ProService = (ProjectService) springMVCContext.getBean("ProjectService");
	    
	    List<Department> depts = ProService.GetDeptByComId(Integer.valueOf(id));
	    json.accumulate("count", depts.size());
	    for(Department dept:depts) {
	    	JSONObject  jsondept = new JSONObject();
	    	jsondept.accumulate("name", dept.getF_NAME());
	    	jsondept.accumulate("id", dept.getId());
	    	jsondept.accumulate("createdate", dept.getF_CREATE_TIME().toString());
	    	jsonarr.add(jsondept);
	    }
	    json.accumulate("depts", jsonarr);
		return json.toString();
	}
	
	@RequestMapping(value="/dept-info",method = RequestMethod.GET,produces="application/json;charset=utf-8")
	String GetDeptInfo(@RequestParam("deptid") int id) {
		JSONObject jsoninfo = new JSONObject();
		DepartmentInfoWrap  info;
		ProjectService ProService = null;
	    WebApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(req.getSession().getServletContext());
	    WebApplicationContext springMVCContext = RequestContextUtils.findWebApplicationContext(req,servletctx);
	    ProService = (ProjectService) springMVCContext.getBean("ProjectService");
	    
	    info = ProService.GetDepartmentInfo(id);
	    jsoninfo.accumulate("code", info.getCode());
	    jsoninfo.accumulate("name", info.getName());
	    jsoninfo.accumulate("manager",info.getManager());
	    jsoninfo.accumulate("chargeperson",info.getChargePerson() );
	    jsoninfo.accumulate("period",info.getPeriod() );
	    jsoninfo.accumulate("comname",info.getCompnayName() );
	    jsoninfo.accumulate("opentime",info.getOpenTime() );
	    jsoninfo.accumulate("recordtime",info.getRecordTime() );
		return jsoninfo.toString();
	}
}
