angular.module('directory.services', [])

    .factory('EmployeeService', function ($q) {

        var employees;
        // We use promises to make this api asynchronous. This is clearly not necessary when using in-memory data
        // but it makes this service more flexible and plug-and-play. For example, you can now easily replace this
        // service with a JSON service that gets its data from a remote server without having to changes anything
        // in the modules invoking the data service since the api is already async.

        return {
            findAll: function () {
                var deferred = $q.defer();
                //Async call to google service
                gapi.client.employe.list().execute(
                    function (resp) {
                        if (!resp.code) {
                            console.debug(resp);
                            employees = resp.items;
                            deferred.resolve(employees);
                        }
                    });
                return deferred.promise;
            },

            createEmployee: function (employee) {
                console.log('employee=' + employee);
                var deferred = $q.defer();
                //Async call to google service
                gapi.client.employe.create(employee).execute(
                    function (resp) {
                        if (!resp.code) {
                            console.debug(resp);
                            //employees = resp.items;
                            deferred.resolve('employee created');
                        }
                    });
                return deferred.promise;
            },

            findById: function (employeeId) {
                var deferred = $q.defer();
                var employee = employees[employeeId - 1];
                deferred.resolve(employee);
                return deferred.promise;
            },

            delete: function (employeeId) {
                console.log('employee id to delete=' + employeeId);
                var deferred = $q.defer();
                //Async call to google service
                gapi.client.employe.remove({id:employeeId}).execute(
                    function (resp) {
                        if (!resp.code) {
                            console.debug(resp);
                            //employees = resp.items;
                            deferred.resolve('employee deleted');
                        }
                    });
                return deferred.promise;
            },

            /*findByName: function (searchKey) {
                var deferred = $q.defer();
                var results = employees.filter(function (element) {
                    var fullName = element.firstName + " " + element.lastName;
                    return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
                });
                deferred.resolve(results);
                return deferred.promise;
            },*/

            findByManager: function (managerId) {
                var deferred = $q.defer();
                var id = parseInt(managerId),
                    response,
                    reports = [],
                    employee;
                response = {
                    id: id,
                    firstName: employees[id-1].firstName,
                    lastName: employees[id-1].lastName,
                    title: employees[id-1].title,
                    pic: employees[id-1].pic
                };
                for (var i=0; i<employees.length; i++) {
                    employee = employees[i];
                    if (parseInt(employee.managerId) === id) {

                        reports.push({id: employee.id, firstName: employee.firstName, lastName: employee.lastName, title: employee.title, pic: employee.pic});
                    }
                }
                response.reports = reports;
                deferred.resolve(response);
                return deferred.promise;
            }

        }

    })


    .service('LoginService', function ($q, $http) {
        return {
            loginUser: function (name, pw) {
                var url = 'https://axo-app.appspot.com';
                var res = '/authenticate';
                var isAndroid = document.location.toString().indexOf('android') > -1;
                var isAppSpot = document.location.toString().indexOf('appspot') > -1;
                var isDev = document.location.toString().indexOf('localhost') > -1
                    ||document.location.toString().indexOf('192') > -1;
                if (isAndroid || !isAppSpot) {
                    res = url + res;
                }
                if (isDev) {
                    res = 'http://localhost:8080/authenticate';
                }

                var deferred = $q.defer();
                var promise = deferred.promise;
                console.log('log with:' + name + '/' + pw);
                // Simple POST request example (passing data) :
                $http.post(res, {username: name, password: pw}).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        deferred.reject('Wrong credentials.');

                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }
        }
    });

