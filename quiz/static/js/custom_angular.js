var quizApp = angular.module('quiz', ['ngRoute','ngCookies']).config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

quizApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});


quizApp.run(function($rootScope) {
    // To be globally available and updatable
    $rootScope.city_list = "";
    $rootScope.school_list = "";
});

<!-- Service -->

quizApp.service('AuthService', function($q, $http) {
  var service = this;
  
  service.storeUserDetails = function(user_data) {
    $http.defaults.headers.common['Authorization'] = "Token "+user_data['token'];
    // To make the user obj globally available
    localStorage.setItem('user_obj', JSON.stringify(user_data));
  };
});
    

<!-- User Login/Singup -->
quizApp.controller('UserLoginController', function ($scope, $http, $interval, 
  $window, AuthService, $rootScope) {
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

  // List schools
  $scope.get_schools = function (city_id) {
    // get schools in a selected city
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
      // Update school list
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

  // List standards
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

  // Signup 
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
          // Store user details in local storage
          AuthService.storeUserDetails(response);
          // Redirect to home page after signup
          $window.location.href = '/';
        }
    }).error(function(data, headers, config) {
     // called asynchronously if an error occurs
     // or server returns response with an error status.
    });
  }

  // Login
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
          // Store user details in local storage
          AuthService.storeUserDetails(response);
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
  $window, AuthService, $timeout, $filter) {
  $scope.quizes = new Array();
  $scope.questions = new Array();
  $scope.now = new Date(); 
  $scope.start_btn = false;
  $scope.total_score = 0;
  $("#fail").hide();
  $("#success").hide();
  $scope.user_type = 0;
  // Fetch user details from local storage
  $scope.user_obj = JSON.parse(localStorage.getItem('user_obj'));

  $scope.compareStarts = function (starts, ends) {
    // compare current time with quiz starts time and ends time
    $scope.start_btn = false;
    if($scope.now >= new Date(starts) && $scope.now < new Date(ends)){
      $scope.start_btn = true;
      $scope.duration = (new Date(ends) - new Date(starts));
    }
  }

  // Get available quizes
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

  // Save question answers from user
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
        if(ans.indexOf(user_ans) !== -1 && user_ans.length > 0 ){
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

  // Set questions in a quiz
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
        if($scope.questions.length == $scope.index + 1)
          $scope.btn_name = "Finish";
      }
      else{
        $scope.clear_questions = true;
        $("#success").show();
          setTimeout(function () {
            $("#success").hide();
            $window.location.href = '/users/profile/';
        }, 3000);

      }
      var dict_to_save = {
        "score": $scope.total_score,
        "quiz": $scope.quiz_id,
        "owned_by": $scope.user_obj['id'],
      }
      $http.post(
        '/api/users/'+$scope.user_obj['id']+'/quizes/'+$scope.quiz_id+'/score/',
        dict_to_save
      ).success(function(response){
        
      }).error(function(data, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
      });
    }

  // Check whether the user is already attended the quiz
  $scope.start_test = function(quiz_id, quiz_name){
    $scope.user_obj = JSON.parse(localStorage.getItem('user_obj'));
    // Get scores of the user for the given quiz, to find already attended or not
    $http.get(
    '/api/users/'+$scope.user_obj['id']+'/quizes/'+quiz_id+'/score/',
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.scores = response;
      if(response.length > 0){
        // Already attended
        $scope.error_msg = "Already attended the test";
        $("#fail").show();
          setTimeout(function () {
            $("#fail").hide();
          }, 3000);
      }
      else{
        // Not attended
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
          if($scope.questions.length > 0){
            $scope.quiz_list = true;
            $scope.set_questions(); 
          }
          else{
            if(response.length < 1){
              // No questions available
              $scope.error_msg = "No questions available";
              $("#fail").show();
                setTimeout(function () {
                  $("#fail").hide();
                }, 3000);
            }
            $scope.question_list = true;
          }
        }).error(function(data, status, headers, config) {
           // called asynchronously if an error occurs
           // or server returns response with an error status.
        });
      }
    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }
});


<!-- Student Profile -->
quizApp.controller('ProfileController', function ($scope, $http, $interval, 
  $window, AuthService) {
  $scope.quizes = new Array();
  $scope.user_obj = JSON.parse(localStorage.getItem('user_obj'));

  $scope.review_quiz = function (quiz_id) {
    // Store quiz id to make available in review operations
    localStorage.setItem('selected_quiz_id', quiz_id);
  }

  <!-- List scores in quizes -->
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
  $window, AuthService, $rootScope) {
  $scope.results = new Array();

  <!-- List scores of students in scores order -->
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

  // List schools
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
  $window, AuthService) {
  $scope.quizes = new Array();
  $scope.user_obj = JSON.parse(localStorage.getItem('user_obj'));

  //List student's performance
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


<!-- Quiz Review-->
quizApp.controller('QuizReviewController', function ($scope, $http, $interval, 
  $window, AuthService, $timeout, $filter) {
  $scope.index = 0;
  $scope.selected_quiz_id = localStorage.getItem('selected_quiz_id');
  $scope.user_obj = JSON.parse(localStorage.getItem('user_obj'));

  // List questions and answers of the selected quiz attended by the user
  $scope.get_quiz_review = function () {
    $http.get(
    '/api/users/'+$scope.user_obj['id']+'/quizes/'+$scope.selected_quiz_id+'/review/',
    {
      'responseType' : 'json',
    }
    ).success(function(response, status) {
       // this callback will be called asynchronously
       // when the response is available
      $scope.reviews = response;
      if($scope.reviews.length > 0)
        $scope.set_questions_answer(); 
      else
        $scope.question_list = true;
    }).error(function(data, status, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
    });
  }
  $scope.get_quiz_review()

  // set questions and answers for review
  $scope.set_questions_answer = function() {
      $scope.essay = false;
      $scope.choice = "";
      $scope.status = false;
      // If review completed, then rediredt
      if($scope.btn_name == 'Finish' )
        $window.location.href = '/users/profile/';
      
      if($scope.reviews.length > $scope.index ){
        $scope.question = $scope.reviews[$scope.index].question_details['question'];
        $scope.choice_a = $scope.reviews[$scope.index]['choice_a'];
        if($scope.reviews[$scope.index].question_details['type'].toString() == 'm'){
          $scope.essay = true;
          $scope.choice = $scope.reviews[$scope.index].question_details['ans'];;
          $scope.choice_a = $scope.reviews[$scope.index].question_details['choice_a'];
          $scope.choice_b = $scope.reviews[$scope.index].question_details['choice_b'];
          $scope.choice_c = $scope.reviews[$scope.index].question_details['choice_c'];
          $scope.choice_d = $scope.reviews[$scope.index].question_details['choice_d'];
        }
        $scope.user_ans = $scope.reviews[$scope.index]['answer'];
        $scope.btn_name = "Next";
        if($scope.reviews[$scope.index]['status'])
          $scope.status = true;
        $scope.index = $scope.index + 1;
        if($scope.reviews.length == $scope.index)
          $scope.btn_name = "Finish";
      }
    }
});