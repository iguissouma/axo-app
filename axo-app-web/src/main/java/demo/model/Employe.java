package demo.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Employe {
	
	@Id
	private Long id;
	private String firstName;
	private String lastName;
	private String title;
	private String cellPhone;
	private String officePhone;
	private String email;
	private String pic;
	private long  reports;
	private String departement;
	private long managerId;
	private String managerName;
	
	public Employe() {
		super();
	}

	public Employe(Long id, String firstName, String lastName, String title,
			String cellPhone, String officePhone, String email, String pic,
			long reports, String departement, long managerId, String managerName) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.title = title;
		this.cellPhone = cellPhone;
		this.officePhone = officePhone;
		this.email = email;
		this.pic = pic;
		this.reports = reports;
		this.departement = departement;
		this.managerId = managerId;
		this.managerName = managerName;
	}

	public Employe(String firstName, String lastName, String title,
			String cellPhone, String officePhone, String email, String pic,
			long reports, String departement, long managerId, String managerName) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.title = title;
		this.cellPhone = cellPhone;
		this.officePhone = officePhone;
		this.email = email;
		this.pic = pic;
		this.reports = reports;
		this.departement = departement;
		this.managerId = managerId;
		this.managerName = managerName;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}



	public String getCellPhone() {
		return cellPhone;
	}



	public void setCellPhone(String cellPhone) {
		this.cellPhone = cellPhone;
	}



	public String getOfficePhone() {
		return officePhone;
	}



	public void setOfficePhone(String officePhone) {
		this.officePhone = officePhone;
	}



	public String getEmail() {
		return email;
	}



	public void setEmail(String email) {
		this.email = email;
	}

	public String getPic() {
		return pic;
	}

	public void setPic(String pic) {
		this.pic = pic;
	}

	public String getDepartement() {
		return departement;
	}



	public void setDepartement(String departement) {
		this.departement = departement;
	}



	public long getManagerId() {
		return managerId;
	}



	public void setManagerId(long managerId) {
		this.managerId = managerId;
	}



	public String getManagerName() {
		return managerName;
	}



	public void setManagerName(String managerName) {
		this.managerName = managerName;
	}

	public long getReports() {
		return reports;
	}

	public void setReports(long reports) {
		this.reports = reports;
	}

	
	
}
