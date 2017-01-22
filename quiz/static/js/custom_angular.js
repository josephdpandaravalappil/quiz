var quizApp = angular.module('quiz', ['ngRoute','ngCookies']).config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

quizApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

<!-- User Login/Singup -->
quizApp.controller('UserLoginController', function ($scope, $http, $interval, 
  $window, $cookieStore) {


});