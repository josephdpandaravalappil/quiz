var quizApp = angular.module('quiz', ['ngRoute','ngCookies']).config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

quizApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

<!-- Service -->

quizApp.service('AuthService', function($q, $http) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
  var service = this;
  var user_id = '';

  
  service.storeUserDetails = function(user_data) {
    $http.defaults.headers.common['Authorization'] = "Token "+user_data['token'];
    user_id = user_data['id'];
    // To make the user obj globally available
    localStorage.setItem('user_obj', JSON.stringify(user_data));
  };

});


<!-- User Login/Singup -->
quizApp.controller('UserLoginController', function ($scope, $http, $interval, 
  $window, AuthService, $cookieStore) {
  $scope.cities = new Array();
  $scope.schools = new Array();
  $scope.standards = new Array();
  $("#fail").hide();
  $scope.user_type = 0;

  <!-- List cities -->
  $scope.get_cities = function () {
    $scope.loading = true;
    $http.get(
    '/api/cities/',
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.cities = response;

    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }

  $scope.get_cities();

  $scope.citySelected = function () {
    // get schools in a selected city
    if($scope.selectedCity){
      $scope.get_schools($scope.selectedCity.id);
    }
    else{
      $scope.schools = [];
      $scope.standards = [];
    }
  }

  <!-- List schools -->
  $scope.get_schools = function (city_id) {
    $scope.loading = true;
    $http.get(
    '/api/cities/'+city_id+'/schools',
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.schools = response;

    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }

  $scope.schoolSelected = function () {
    // get standards in a selected school
    $scope.get_standards($scope.selectedSchool.id);
  }

    <!-- List standards -->
  $scope.get_standards = function (school_id) {
    $scope.loading = true;
    $http.get(
    '/api/schools/'+school_id+'/standards/',
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.standards = response;

    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }


  <!-- Signup -->
  $scope.signup = function (signup_data) {
    if(signup_data.name){
      console.log($scope.selectedCity,123);
      if(!$scope.selectedCity || !$scope.selectedSchool ||!$scope.selectedStandard){
        $scope.error = "Please select your City, School and Standard in order";
        $("#fail").show();
        setTimeout(function () {
          $("#fail").hide();
        }, 3000);
      }
    }
    var dict_to_save = {
      "name": signup_data.username,
      "is_staff": $scope.user_type,
      "city": $scope.selectedCity.id,
      "school": $scope.selectedSchool.id,
      "standard": $scope.selectedStandard.id,
      "username": signup_data.username,
      "password":signup_data.password,
      "signup": true,
    }

    $http.post(
    '/api/users/login',
    dict_to_save
    ).success(function(response){
        if(response['status'] == 400) {
          $scope.error = response['errors']['username'][0];
          $("#fail").show();
          setTimeout(function () {
            $("#fail").hide();
          }, 3000);
        }
        else{
          AuthService.storeUserDetails(response);
          // Put cookie
          $cookieStore.put('user_obj', response);
          // Get cookie
          $window.location.href = '/';
        }
    }).error(function(data, headers, config) {
     // called asynchronously if an error occurs
     // or server returns response with an error status.
    });
  }

  <!-- Login -->
  $scope.login = function (data) {
    var dict_to_save = {
      "username": data.username,
      "password": data.password,
    }
    console.log(dict_to_save);
    $http.post(
      '/api/users/login',
      dict_to_save
      ).success(function(response){
        if(response['status'] == 400) {
          $scope.error = response['errors'];
          $("#fail").show();
          setTimeout(function () {
            $("#fail").hide();
          }, 3000);
        }
        else{
          AuthService.storeUserDetails(response);
          // Put cookie
          $cookieStore.put('user_obj', response);
          $window.location.href = '/';
        }
      }).error(function(data, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
      });
  }
});