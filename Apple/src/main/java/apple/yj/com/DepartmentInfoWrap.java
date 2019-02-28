package apple.yj.com;
import apple.yj.com.pojo.Department;

public class DepartmentInfoWrap {
	Department dept;
	String     name;
	String     code;
	int        subdeptcount;
	int        id;
	
	int        Period;
	String     CompnayName;
	String     local;
	String     Manager;
	String     State;
	String     DesignCom;
	String     ConstructCom;
	String     SuperviseCom;
	String     SurveyCom;
	String     ChargePerson;
	String     StartTime;
	String     EndTime;
	String     ContractStartTime;
	String     ContractEndTime;
	String     OpenTime;
	String     RecordTime;
	
	public String getRecordTime() {
		return RecordTime;
	}
	public void setRecordTime(String recordTime) {
		RecordTime = recordTime;
	}
	public Department getDept() {
		return dept;
	}
	public void setDept(Department dept) {
		this.dept = dept;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getSubdeptcount() {
		return subdeptcount;
	}
	public void setSubdeptcount(int subdeptcount) {
		this.subdeptcount = subdeptcount;
	}
	
	public int getID() {
		return id;
	}
	
	public int setID(int id) {
		return this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public int getPeriod() {
		return Period;
	}
	public void setPeriod(int period) {
		Period = period;
	}
	public String getCompnayName() {
		return CompnayName;
	}
	public void setCompnayName(String compnayName) {
		CompnayName = compnayName;
	}
	public String getLocal() {
		return local;
	}
	public void setLocal(String local) {
		this.local = local;
	}
	public String getManager() {
		return Manager;
	}
	public void setManager(String manager) {
		Manager = manager;
	}
	public String getDesignCom() {
		return DesignCom;
	}
	public void setDesignCom(String designCom) {
		DesignCom = designCom;
	}
	public String getConstructCom() {
		return ConstructCom;
	}
	public void setConstructCom(String constructCom) {
		ConstructCom = constructCom;
	}
	public String getSuperviseCom() {
		return SuperviseCom;
	}
	public void setSuperviseCom(String superviseCom) {
		SuperviseCom = superviseCom;
	}
	public String getSurveyCom() {
		return SurveyCom;
	}
	public void setSurveyCom(String surveyCom) {
		SurveyCom = surveyCom;
	}
	public String getChargePerson() {
		return ChargePerson;
	}
	public void setChargePerson(String chargePerson) {
		ChargePerson = chargePerson;
	}
	public String getStartTime() {
		return StartTime;
	}
	public void setStartTime(String startTime) {
		StartTime = startTime;
	}
	public String getEndTime() {
		return EndTime;
	}
	public void setEndTime(String endTime) {
		EndTime = endTime;
	}
	public String getContractStartTime() {
		return ContractStartTime;
	}
	public void setContractStartTime(String contractStartTime) {
		ContractStartTime = contractStartTime;
	}
	public String getContractEndTime() {
		return ContractEndTime;
	}
	public void setContractEndTime(String contractEndTime) {
		ContractEndTime = contractEndTime;
	}
	public String getOpenTime() {
		return OpenTime;
	}
	public void setOpenTime(String openTime) {
		OpenTime = openTime;
	}
}
