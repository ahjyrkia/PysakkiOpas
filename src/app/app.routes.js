var MyApp = angular.module("MyApp", ["ui.router", "leaflet-directive"]);

MyApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/intro");
  
  $stateProvider
    .state("main", {
      url: "/",
      templateUrl: "templates/main/main.html",
      controller: "MainController",
      controllerAs: "main"
    })
    .state("intro", {
      url: "/intro",
      templateUrl: "templates/intro/intro.html",
      controller: "IntroController",
      controllerAs: "intro"
    })
    .state("main.login", {
      url: "login",
      templateUrl: "templates/login/login.html",
    })
    .state("main.other", {
      url: "other",
      templateUrl: "templates/other/other.html",
    })
    .state("stuff", {
      url: "/stuff",
      templateUrl: "templates/stuff/stuff.html",
      controller: "StuffController",
      controllerAs: "stuffCtrl"
    })
});
