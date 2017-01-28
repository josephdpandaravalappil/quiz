var quizApp = angular.module('quiz', ['ngRoute','ngCookies']).config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

quizApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});


quizApp.run(function($rootScope) {
    $rootScope.city_list = "";
    $rootScope.school_list = "";
});

<!-- Service -->

quizApp.service('AuthService', function($q, $http) {
  var service = this;
  var user_id = '';

  
  service.storeUserDetails = function(user_data) {
    $http.defaults.headers.common['Authorization'] = "Token "+user_data['token'];
    // To make the user obj globally available
    localStorage.setItem('user_obj', JSON.stringify(user_data));
  };

});
    

<!-- User Login/Singup -->
quizApp.controller('UserLoginController', function ($scope, $http, $interval, 
  $window, AuthService, $cookieStore, $rootScope) {
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
      $rootScope.city_list = response;

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
      $rootScope.school_list = response;

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
          $window.location.href = '/users/profile/';
        }
      }).error(function(data, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
      });
  }
});


<!-- Quiz -->
quizApp.controller('QuizController', function ($scope, $http, $interval, 
  $window, AuthService, $cookieStore, $timeout, $filter) {
  $scope.quizes = new Array();
  $scope.questions = new Array();
  $scope.now = new Date(); 
  $scope.start_btn = false;
  $scope.total_score = 0;
  $("#fail").hide();
  $("#success").hide();
  $scope.user_type = 0;
  $scope.user_obj = JSON.parse(localStorage.getItem('user_obj'));

  $scope.compareStarts = function (starts, ends) {
    // compare current time with quiz starts time
    $scope.start_btn = false;
    if($scope.now >= new Date(starts) && $scope.now < new Date(ends)){
      $scope.start_btn = true;
      // var _date = $filter('date')(new Date(5.30),
                              // 'HH:mm:ss');
      $scope.duration = (new Date(ends) - new Date(starts));
    }
  }

  <!-- List cities -->
  $scope.get_quizes = function () {
    $scope.question_list = true;
    $http.get(
    '/api/quizes/',
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.quizes = response;

    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }

  $scope.get_quizes();

  $scope.save_answer = function(){
    var status = false;
    if($scope.questions.length > $scope.index ){
      if($scope.questions[$scope.index]['type'].toString() == 'm'){
        if($scope.choice == $scope.questions[$scope.index]['ans']){
          status = true;
          $scope.total_score = $scope.total_score + $scope.questions[$scope.index]['mark'];
        }
      }
      else{
        var user_ans = angular.lowercase($scope.choice);
        var ans = angular.lowercase($scope.questions[$scope.index]['ans']);
        if(ans.indexOf(user_ans) !== -1){
          status = true;
          $scope.total_score = $scope.total_score + $scope.questions[$scope.index]['mark'];
        }
      }
      var dict_to_save = {
        "question": $scope.questions[$scope.index]['id'],
        "quiz": $scope.quiz_id,
        "status": status,
        "answer": $scope.choice,
        "answered_by": $scope.user_obj['id'],
      }
      $http.post(
        '/api/users/'+$scope.user_obj['id']+'/quizes/'+$scope.questions[$scope.index]['id']+'/answers/',
        dict_to_save
      ).success(function(response){
        $scope.index = $scope.index + 1;
        $scope.set_questions();
          
      }).error(function(data, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
      });
    }
    else{
      $scope.set_questions();
    }
  }

  $scope.set_questions = function() {
      $scope.essay = false;
      $scope.choice = "";
      if($scope.questions.length > $scope.index ){
        $scope.question = $scope.questions[$scope.index]['question'];
        if($scope.questions[$scope.index]['type'].toString() == 'm'){
        $scope.essay = true;
        $scope.choice_a = $scope.questions[$scope.index]['choice_a'];
        $scope.choice_b = $scope.questions[$scope.index]['choice_b'];
        $scope.choice_c = $scope.questions[$scope.index]['choice_c'];
        $scope.choice_d = $scope.questions[$scope.index]['choice_d'];
        }
        $scope.ans = "";
        $scope.btn_name = "Next";
        if($scope.questions.length == $scope.index+1)
          $scope.btn_name = "Finish";
      }
      else{
        $scope.clear_queations = true;
        var dict_to_save = {
          "score": $scope.total_score,
          "quiz": $scope.quiz_id,
          "owned_by": $scope.user_obj['id'],
        }
        $http.post(
          '/api/users/'+$scope.user_obj['id']+'/quizes/'+$scope.questions[$scope.index-1]['id']+'/score/',
          dict_to_save
        ).success(function(response){
          
        }).error(function(data, headers, config) {
         // called asynchronously if an error occurs
         // or server returns response with an error status.
        });
        // $scope.question_list = true;
        $("#success").show();
          setTimeout(function () {
            $("#success").hide();
            // $window.location.href = '/users/profile/';
        }, 3000);

      }
    }

  <!-- Start Test -->
  $scope.start_test = function (quiz_id, quiz_name) {
    $scope.quiz_list = true;
    $scope.question_list = false;
    $scope.loading = true;
    $scope.quiz_name = quiz_name;
    $scope.quiz_id = quiz_id;
    $http.get(
    '/api/quizes/'+quiz_id+'/questions/',
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.questions = response;
      $scope.index = 0;
      if($scope.questions.length > 0)
        $scope.set_questions(); 
      else
        $scope.question_list = true;


    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }
});


<!-- Student Profile -->
quizApp.controller('ProfileController', function ($scope, $http, $interval, 
  $window, AuthService, $cookieStore) {
  $scope.quizes = new Array();
  $scope.user_obj = JSON.parse(localStorage.getItem('user_obj'));
  <!-- List user attempted quizes -->
  $scope.get_scores = function () {
    $scope.loading = true;
    $http.get(
    '/api/users/'+$scope.user_obj['id']+'/quizes/',
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.quizes = response;

    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }
  $scope.get_scores()
});


<!-- Leader board -->
quizApp.controller('LeaderBoardController', function ($scope, $http, $interval, 
  $window, AuthService, $cookieStore, $rootScope) {
  $scope.results = new Array();

  <!-- List scores of different users in scores order -->
  $scope.get_leader_board = function (city_id=0, school_id=0) {
    $http.get(
    '/api/lboard/?city='+city_id+'&school='+school_id,
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.results = response;

    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }
  $scope.get_leader_board()

  $scope.citySelected = function () {
    // get score leaders in the selected city
    $scope.cities = $rootScope.city_list;
    if($scope.selectedCity){
      $scope.get_leader_board($scope.selectedCity.id);
    }
  }

  <!-- List schools -->
  $scope.get_schools = function () {
    $scope.loading = true;
    $http.get(
    '/api/schools/',
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

  $scope.get_schools();

  $scope.schoolSelected = function () {
    // get scores in the selected school
    if($scope.selectedSchool){
      $scope.get_leader_board(0,$scope.selectedSchool.id);
      $scope.selectedCity = "";
    }
  }
});


<!-- Staff Profile -->
quizApp.controller('StaffProfileController', function ($scope, $http, $interval, 
  $window, AuthService, $cookieStore) {
  $scope.quizes = new Array();
  $scope.user_obj = JSON.parse(localStorage.getItem('user_obj'));

  <!-- List performance of the logged in staff -->
  $scope.get_scores = function () {
    $scope.loading = true;
    $http.get(
    '/api/staff/'+$scope.user_obj['id']+'/quizes/',
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.quizes = response;

    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }
  $scope.get_scores()
});