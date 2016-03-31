/* Authentication services */

var authInterceptor = function(auth) {
  return {
    // automatically attach Authorization header
    request: function(config) {
      var token = auth.getToken();
      if(token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },

    // If a token was sent back, save it
    response: function(res) {
      if(res.data.token) {
        auth.saveToken(res.data.token);
      }
      return res;
    },
      
  }
};


var authService = function($window) {
    
  var self = this;

  self.parseJwt = function(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  };
    
  self.saveToken = function(token) {
    $window.localStorage['jwtToken'] = token;
  };
    
  self.getToken = function() {
    return $window.localStorage['jwtToken'];
  };
    
  self.isAuthed = function(){
    var token = self.getToken();
    if(token) {
        return true;
    } else {
        return false;
    }
  };
    
  self.logout = function() {
    $window.localStorage.removeItem('jwtToken');
    $window.localStorage.removeItem('user');
  };
    
};

var userService = function($http, auth, $window) {
    
  var self = this;
    
  self.signup = function(email, password, rpassword) {
  return $http.post('users/signup', {
      email: email,
      password: password,
      rpassword: rpassword
    }).then(function(result) {
          if (result.data.success){
             $window.localStorage.setItem('user',JSON.stringify({username: email}));
          }
          return result;
      });
  };
    
  self.login = function(email, password) {
      return $http.post('users/login', {
          email: email,
          password: password
      }).then(function(result) {
          if (result.data.success){
            $window.localStorage.setItem('user',JSON.stringify({username: email}));
          }
          return result;
      });
  };
    
    
  self.currentUser = function() {
    if ($window.localStorage.getItem('user'))
      return JSON.parse($window.localStorage.getItem('user'));
    else
      return {};
  };
    
};


/* End authentication services */

/* Main controller definition */

AppController.$routeConfig = [

];

function AppController($scope, $router, user, auth, $location) {
    
  $scope.logout = function() {
    auth.logout && auth.logout();
    $location.path('/');
  };
    
  $scope.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };
    
  $scope.getUser = function(){
      return user.currentUser();
  }
  
    
};

/* End main controller definition */

var app = angular.module('appMain', ['ngNewRouter']).controller('AppController', ['$scope', '$router', 'user', 'auth', '$location', AppController]);

app.factory('authInterceptor', authInterceptor)
.service('user', userService)
.service('auth', authService)
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});