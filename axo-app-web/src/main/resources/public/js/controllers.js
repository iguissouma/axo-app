angular.module('directory.controllers', [])

    .controller('EmployeeIndexCtrl', function ($scope, $window,$timeout, EmployeeService) {

        $scope.isBackendReady = false;
        $window.init = function () {
            $scope.$apply($scope.initgapi);
        };

        $scope.initgapi = function () {
            console.log("load_employe_lib called");
            var rootApi = 'https://axo-directory.appspot.com/_ah/api';
            gapi.client.load('employe', 'v1', function () {
                //findAllEmployees();
                $scope.isBackendReady = true;
            }, rootApi);
        };


        $scope.searchKey = "";

        $scope.clearSearch = function () {
            $scope.searchKey = "";
            findAllEmployees();
        };

        $scope.search = function () {
            EmployeeService.findByName($scope.searchKey).then(function (employees) {
                $scope.employees = employees;
            });
        };

        var findAllEmployees = function () {
             if (gapi.client === undefined || (typeof(gapi.client.employe) === 'undefined')) {
                $timeout(findAllEmployees, 500);
            } else {
                EmployeeService.findAll().then(function (employees) {
                    $scope.employees = employees;
                });
            }
        };

        findAllEmployees();
    })

    .controller('EmployeeDetailCtrl', function ($scope, $stateParams, EmployeeService) {
        EmployeeService.findById($stateParams.employeeId).then(function (employee) {
            $scope.employee = employee;
        });
    })

    .controller('EmployeeReportsCtrl', function ($scope, $stateParams, EmployeeService) {
        EmployeeService.findByManager($stateParams.employeeId).then(function (employees) {
            $scope.employees = employees;
        });
    });
