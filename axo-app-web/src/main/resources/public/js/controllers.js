angular.module('directory.controllers', [])

    .controller('EmployeeIndexCtrl', function ($scope, $window,$timeout, $ionicLoading,$ionicViewService, EmployeeService) {
        // This a temporary solution to solve an issue where the back button is displayed when it should not be.
        $ionicViewService.clearHistory();
        $scope.loadingIndicator = $ionicLoading.show({
            template: '<img class="my-custom-class" ng-src="img/squares.gif"/>',
            animation: 'fade-in',
            noBackdrop: true,
            maxWidth: 200,
            showDelay: 500
        });

        $scope.isBackendReady = false;
        $window.init = function () {
            $scope.$apply($scope.initgapi);
        };

        $scope.initgapi = function () {
            var rootApi = 'https://axo-app.appspot.com/_ah/api';
            gapi.client.load('employe', 'v1', function () {
                //findAllEmployees();
                $scope.isBackendReady = true;
            }, rootApi);
        };

        $scope.data = {
            showDelete: false
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

        $scope.filterFunction = function(element) {
            var abbreviation = element.firstName.substring(0, 1)+element.lastName.substring(0,2);
            var fullName = element.firstName + " " + element.lastName;
            var fullNameCondition = fullName.toLowerCase().indexOf($scope.searchKey.toLowerCase()) > -1;
            var abbreviationCondition = abbreviation.toLowerCase() == $scope.searchKey && $scope.searchKey.length == 3;
            return fullNameCondition || abbreviationCondition;
        };

        var findAllEmployees = function () {
             if (gapi.client === undefined || (typeof(gapi.client.employe) === 'undefined')) {
                $timeout(findAllEmployees, 500);
            } else {
                EmployeeService.findAll().then(function (employees) {
                    $scope.employees = employees;
                    $ionicLoading.hide();
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

    .controller('EmployeeCreateCtrl', function ($scope, $location,$stateParams, EmployeeService) {
        //$scope.newsEntry = new NewsService();
        $scope.save = function() {
            //$scope.newsEntry.$save(function() {
                $location.path('/employees');
            //});
        };
    })

    .controller('EmployeeReportsCtrl', function ($scope, $stateParams, EmployeeService) {
        EmployeeService.findByManager($stateParams.employeeId).then(function (employees) {
            $scope.employee = employees;
        });
    })

    .controller( 'LoginCtrl', function($scope, $rootScope, $location, $http, $cookieStore,$window,$localstorage, $ionicViewService, LoginService) {
        // This a temporary solution to solve an issue where the back button is displayed when it should not be.
        $ionicViewService.clearHistory();
        $rootScope.user = null;
        $scope.credentials = {
            username: '', password: ''
        };
        $scope.login = function() {
            LoginService.authenticate({username: $scope.credentials.username, password: $scope.credentials.password}, function(user) {
                $rootScope.user = user;
                $http.defaults.headers.common[ xAuthTokenHeaderName ] = user.token;
                //$cookieStore.put('user', user);
                $localstorage.setObject('user', user);
                $location.path("/employees");
            });
        };
    }).controller('NavController', function($scope, $ionicNavBarDelegate, $state) {
        $scope.goBack = function() {
            if ($scope.isNative && backToNative($state)) {
                location.href='appName-ios://back';
            } else {
                $ionicNavBarDelegate.back();
            }
        };

        function backToNative($state) {
            var entryPoints = ['stateName1', 'stateName2', 'stateName3'];
            return entryPoints.some(function (entry) {
                return $state.current === $state.get(entry);
            });
        }
    });
