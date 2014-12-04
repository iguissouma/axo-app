package demo.repository;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.Collection;
import java.util.List;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import demo.model.Employe;

public class EmployeRepository {

	private static EmployeRepository employeRepository = null;

	static {
		ObjectifyService.register(Employe.class);
	}

	private EmployeRepository() {
	}

	public static synchronized EmployeRepository getInstance() {
		if (null == employeRepository) {
			employeRepository = new EmployeRepository();
		}
		return employeRepository;
	}

	public Collection<Employe> findEmployes() {
		List<Employe> todos = ofy().load().type(Employe.class).list();
		return todos;
	}

	public Employe create(Employe todo) {
		ofy().save().entity(todo).now();
		return todo;
	}

	public Employe update(Employe editedTodo) {
		if (editedTodo.getId() == null) {
			return null;
		}
		Employe todo = ofy().load()
				.key(Key.create(Employe.class, editedTodo.getId())).now();
		todo.setFirstName(editedTodo.getFirstName());
		todo.setLastName(editedTodo.getLastName());
		todo.setTitle(editedTodo.getTitle());
		todo.setCellPhone(editedTodo.getCellPhone());
		todo.setDepartement(editedTodo.getDepartement());
		todo.setEmail(editedTodo.getEmail());
		todo.setManagerId(editedTodo.getManagerId());
		todo.setManagerName(editedTodo.getManagerName());
		todo.setOfficePhone(editedTodo.getOfficePhone());
		todo.setPic(editedTodo.getPic());
		todo.setReports(editedTodo.getReports());
		ofy().save().entity(todo).now();

		return todo;
	}

	public void remove(Long id) {
		if (id == null) {
			return;
		}
		ofy().delete().type(Employe.class).id(id).now();
	}
}
