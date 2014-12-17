// angular.module is a global place for creating, registering and retrieving Angular modules
// 'directory' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'directory.services' is found in services.js
// 'directory.controllers' is found in controllers.js
var xAuthTokenHeaderName = 'x-auth-token';
angular.module('directory', ['ionic','ngCookies', 'ngResource', 'directory.services', 'directory.controllers'])


    .config(function ($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|sms|tel):/) ;
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('employee-index', {
                url: '/employees',
                templateUrl: 'templates/employee-index.html',
                controller: 'EmployeeIndexCtrl'
            })

            .state('employee-detail', {
                url: '/employee/:employeeId',
                templateUrl: 'templates/employee-detail.html',
                controller: 'EmployeeDetailCtrl'
            })

            .state('employee-create', {
                url: '/employees/create',
                templateUrl: 'templates/employee-create.html',
                controller: 'EmployeeCreateCtrl'
            })

            .state('employee-reports', {
                url: '/employee/:employeeId/reports',
                templateUrl: 'templates/employee-reports.html',
                controller: 'EmployeeReportsCtrl'
            });

        $urlRouterProvider.otherwise('/login');
        /* Intercept http errors */
        var interceptor = function ($rootScope, $q, $location) {
            // set native app indicator
            if (document.location.toString().indexOf('android') > -1) {
                $rootScope.isNative = true;
            }
            function success(response) {
                return response;
            }
            function error(response) {
                var status = response.status;
                var config = response.config;
                var method = config.method;
                var url = config.url;
                if (status == 401) {
                    $location.path( "/login" );
                } else {
                    $rootScope.error = method + " on " + url + " failed with status " + status;
                }
                return $q.reject(response);
            }
            return function (promise) {
                return promise.then(success, error);
            };
        };
        $httpProvider.responseInterceptors.push(interceptor);
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    }).run(function($rootScope, $http, $location, $cookieStore,$window,$localstorage,$ionicPlatform, LoginService) {
        $ionicPlatform.ready(function () {
// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
// for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
// org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
        /* Reset error when a new view is loaded */
        $rootScope.$on('$viewContentLoaded', function() {
            delete $rootScope.error;
        });
        $rootScope.hasRole = function(role) {
            if ($rootScope.user === undefined) {
                return false;
            }
            if ($rootScope.user.roles[role] === undefined) {
                return false;
            }
            return $rootScope.user.roles[role];
        };
        $rootScope.logout = function() {
            delete $rootScope.user;
            delete $http.defaults.headers.common[xAuthTokenHeaderName];
            //$cookieStore.remove('user');
            $window.localStorage.removeItem('user');
            $location.path("/login");
        };
        /* Try getting valid user from cookie or go to login page */
        var originalPath = $location.path();
        $location.path("/login");
        //var user = $cookieStore.get('user');
        var user = $localstorage.getObject('user');
        if (user !== undefined && user !== null) {
            $rootScope.user = user;
            $http.defaults.headers.common[xAuthTokenHeaderName] = user.token;
            $location.path(originalPath);
        }
    }).factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }]);

