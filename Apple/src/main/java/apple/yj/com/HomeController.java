package apple.yj.com;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.support.RequestContextUtils;

import apple.yj.com.pojo.Users;
import apple.yj.com.services.MenuService;
import apple.yj.com.services.ProjectService;

import org.hibernate.Criteria;
import org.hibernate.Session;
import apple.yj.com.pojo.Department;
/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	@Autowired
	private SessionFactory sf;
	@Autowired
	HttpServletRequest req;
	@Autowired
	ServletContext servletctx;
	@Autowired
	MenuService    menuservice;
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model) {
		logger.info("Welcome home! The client locale is {}.", locale);
		boolean bLogined = false;
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
		
		if(bLogined)
			return "home";
		else 
			return "login";
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String login(Locale locale, Model model) {
	
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		logger.info("user login at time:"+formattedDate);
		model.addAttribute("serverTime", formattedDate);
		
		return "login";
	}
	
	@RequestMapping(value = "/register", method = RequestMethod.GET)
	public String Register(Locale locale, Model model){
		logger.info("Welcome home! The client locale is {}.", locale);
		return "register";
	}
	
	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public String Admin(Locale locale, Model model){
		
	   
		return "admin";
	}
	
	@RequestMapping(value = "/session", method = RequestMethod.GET)
	public String Session(HttpSession session) {
		System.out.println(req.getRemoteAddr() + "request");
		logger.info(req.getRemoteAddr() + "request");
		return "admin";
	}
	
	@RequestMapping(value = "/test", method = RequestMethod.GET)
	public String test_ui(Locale locale, Model model) {
	
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		logger.info("user login at time:"+formattedDate);
		model.addAttribute("serverTime", formattedDate );
		
		return "ui-test";
	}
	
	@RequestMapping(value = "/members", method = RequestMethod.GET)
	public String members(Locale locale, Model model) {
	
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		logger.info("user login at time:"+formattedDate);
		model.addAttribute("serverTime", formattedDate );
		
		return "members";
	}
	
	@RequestMapping(value = "/webgl", method = RequestMethod.GET)
	public String webgl(Locale locale, Model model) {
		return "webgl";
	}
	@RequestMapping(value = "/project", method = RequestMethod.GET)
	public String project(Locale locale, Model model) {
		return "project";
	}
	@RequestMapping(value = "/load", method = RequestMethod.GET)
	public String load_module(Locale locale, Model model,@RequestParam("content") String content) {
		
		System.out.println("load "+content);
	    if(content.equals("projects")) {
	    	List<Department> depts;
	    	List<DepartmentInfoWrap> infos;
	    	ProjectService ProService = null;
		    WebApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(req.getSession().getServletContext());
		    WebApplicationContext springMVCContext = RequestContextUtils.findWebApplicationContext(req,servletctx);
		    ProService = (ProjectService) springMVCContext.getBean("ProjectService");
		    HomeController controller = springMVCContext.getBean(HomeController.class);
		   
		    if(ProService == null) {
		    	logger.error("can not get bean ProjectService");
		    	return "error";
		    }
		    
		    depts = ProService.GetDepartmentsToplevel();
		    infos = ProService.GetAllSecDeptInfo();
		    if(depts==null) {
		    	System.out.print("dept is null");
		    	logger.info("dept is null");
		    }
		    model.addAttribute("depts", infos);
	    }else if (content.equals("safty")) {
	    	List    menutree;
	    	String  html;
	    	logger.info("begin Load menu pid 0");
	    	menutree = this.menuservice.GetMenuTree(0);
	    	html     = this.menuservice.FormatMenuHtml(menutree);
	    	model.addAttribute("MenuTreeHtml", html);
	    	System.out.println("got menutree"+html);
	    }
		return content;
	}
	
	@RequestMapping(value = "/pro-detail", method = RequestMethod.GET)
	public String pro_detail(Locale locale, Model model,@RequestParam("id") int proId) {
		model.addAttribute("compid", Integer.valueOf(proId));
		return "prodetail";
	}
	
	@RequestMapping(value = "/attachment", method = RequestMethod.GET)
	public String attachment(Locale locale, Model model) {
		URL                url  = null;
		HttpURLConnection  conn = null;
		byte[]              config_byte = new byte[1000];
		String             config;         
		try {
			url = new URL("http://202.103.238.218:8685/Services/FileService/serverConfig.ashx");
			if(url != null) {
				conn = (HttpURLConnection) url.openConnection();
			}
			
			if(conn != null) {
				conn.connect();
				InputStream in = conn.getInputStream();
				int len = in.read(config_byte);
				config_byte[len] = 0;
				config = new String(config_byte,0,len);
				
				System.out.println(config.length()+config);
				model.addAttribute("config", config);
			}
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "attachment";
	}
	
	@RequestMapping(value = "/grid", method = RequestMethod.GET)
	public String Gird(Locale locale, Model model) {
		return "grid";
	}
}
