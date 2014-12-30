angular.module('directory.controllers', [])

    .controller('EmployeeIndexCtrl', function ($scope,$ionicActionSheet, $window,$timeout, $ionicLoading,$ionicHistory, EmployeeService) {
        // This a temporary solution to solve an issue where the back button is displayed when it should not be.
        $ionicHistory.clearHistory();
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
            var identity = element.firstName.substring(0, 1)+element.lastName;
            var fullName = element.firstName + " " + element.lastName;
            var fullNameCondition = fullName.toLowerCase().indexOf($scope.searchKey.toLowerCase()) > -1;
            var identityCondition = identity.toLowerCase().indexOf($scope.searchKey.toLowerCase()) > -1;
            var abbreviationCondition = abbreviation.toLowerCase() == $scope.searchKey && $scope.searchKey.length == 3;
            return fullNameCondition || abbreviationCondition || identityCondition;
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

        $scope.doRefresh = function() {
            EmployeeService.findAll().then(function (employees) {
                $scope.employees = employees;
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.deleteEntry = function(index, employeeId) {
            // show ionic actionSheet to confirm delete operation
            // show() returns a function to hide the actionSheet
            var hideSheet = $ionicActionSheet.show({
                titleText: 'Are you sure that you\'d like to delete this?',
                cancelText: 'Cancel',
                destructiveText: 'Delete',
                cancel: function () {
                    // if the user cancel's deletion, hide the list item's delete button
                    $ionicListDelegate.closeOptionButtons();
                },
                destructiveButtonClicked: function () {
                    EmployeeService.delete(employeeId).then(function () {
                        $scope.employees.splice(index, 1);
                        // hide the confirmation dialog
                        hideSheet();
                    });

                }
            });

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
        $scope.employeeToCreate = {
            firstName: '', lastName: '',email:''
        };
        $scope.save = function() {
            console.log('employee model' + $scope.employeeToCreate);
            EmployeeService.createEmployee($scope.employeeToCreate).then(function () {
                $location.path('/employees');
            });
        };
    })

    .controller('EmployeeReportsCtrl', function ($scope, $stateParams, EmployeeService) {
        EmployeeService.findByManager($stateParams.employeeId).then(function (employees) {
            $scope.employee = employees;
        });
    })

    .controller('LoginCtrl', function ($scope, $http, LoginService, $ionicPopup, $state, $ionicHistory, $rootScope, $localstorage) {
        $scope.data = {};
        // This a temporary solution to solve an issue where the back button is displayed when it should not be.
        $ionicHistory.clearHistory();
        $rootScope.user = null;
        $scope.credentials = {
            username: '', password: ''
        };
        $scope.login = function (form) {
            if (form.$valid) {
                LoginService.loginUser($scope.credentials.username, $scope.credentials.password).success(function (user) {
                    $rootScope.user = user;
                    $http.defaults.headers.common[xAuthTokenHeaderName] = user.token;
                    //$cookieStore.put('user', user);
                    $localstorage.setObject('user', user);
                    //$location.path("/employees");
                    $state.go('employee-index');
                }).error(function (data) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: 'Please check your credentials!'
                    });
                });
            }
        }
    });
