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

            findById: function (employeeId) {
                var deferred = $q.defer();
                var employee = employees[employeeId - 1];
                deferred.resolve(employee);
                return deferred.promise;
            },

            findByName: function (searchKey) {
                var deferred = $q.defer();
                var results = employees.filter(function (element) {
                    var fullName = element.firstName + " " + element.lastName;
                    return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
                });
                deferred.resolve(results);
                return deferred.promise;
            },

            findByManager: function (managerId) {
                var deferred = $q.defer(),
                    results = employees.filter(function (element) {
                        return parseInt(managerId) === parseInt(element.managerId);
                    });
                deferred.resolve(results);
                return deferred.promise;
            }

        }

    })

    .factory('LoginService', function($resource) {
        var url = 'https://axo-app.appspot.com/';
        var res = ':action';
        if (document.location.toString().indexOf('android') > -1) {
            res = url + res;
        }

        return $resource(res, {},
            {
                authenticate: {
                    method: 'POST',
                    params: {'action' : 'authenticate'}
                }
            }
        );
    });

