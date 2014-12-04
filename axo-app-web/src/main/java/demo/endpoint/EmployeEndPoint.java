package demo.endpoint;

import java.util.Collection;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import demo.model.Employe;
import demo.repository.EmployeRepository;


@Api(name = "employe", version = "v1")
public class EmployeEndPoint {

	 @ApiMethod(name = "list", httpMethod = ApiMethod.HttpMethod.GET, path="list")
	 public Collection<Employe> getEmployes() {
	  return EmployeRepository.getInstance().findEmployes();
	 }
	
	 @ApiMethod(name = "create", httpMethod = ApiMethod.HttpMethod.POST, path="create")
	 public Employe create(Employe employe) {
	  return EmployeRepository.getInstance().create(employe);
	 }
	 
	 @ApiMethod(name = "update", httpMethod = ApiMethod.HttpMethod.PUT, path="update")
	 public Employe update(Employe editedEmploye) {
	  return EmployeRepository.getInstance().update(editedEmploye);
	 }
	 
	 @ApiMethod(name = "remove", httpMethod = ApiMethod.HttpMethod.DELETE, path="remove")
	 public void remove(@Named("id") Long id) {
	  EmployeRepository.getInstance().remove(id);
	 }
}
