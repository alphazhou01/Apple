package apple.yj.com.pojo;

public class ModuleNode {
	private int     id;
	private int     pid;
	public int getPid() {
		return pid;
	}
	public void setPid(int pid) {
		this.pid = pid;
	}
	private String  name;
	private String  code;
	private String  fullcode;
	private int     isleaf;
	private int     orderno;
	private int     level;
	private int     isbizcomponent;
	private int     issystem;
	private int     status;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public String getFullcode() {
		return fullcode;
	}
	
	public void setFullcode(String fullcode) {
		this.fullcode = fullcode;
	}
	
	public int isIsleaf() {
		return isleaf;
	}
	
	public void setIsleaf(int isleaf) {
		this.isleaf = isleaf;
	}
	
	public int getOrderno() {
		return orderno;
	}
	
	public void setOrderno(int orderno) {
		this.orderno = orderno;
	}
	
	public int getLevel() {
		return level;
	}
	
	public void setLevel(int level) {
		this.level = level;
	}
	
	public int isIsbizcomponent() {
		return isbizcomponent;
	}
	
	public void setIsbizcomponent(int isbizcomponent) {
		this.isbizcomponent = isbizcomponent;
	}
	
	public int isIssystem() {
		return issystem;
	}
	
	public void setIssystem(int issystem) {
		this.issystem = issystem;
	}
	
	public int getStatus() {
		return status;
	}
	
	public void setStatus(int status) {
		this.status = status;
	}
}