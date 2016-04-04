/* Authentication services */

var authInterceptor = function(auth) {
  return {
    // automatically attach Authorization header
    request: function(config) {
      var token = auth.getToken();
      if(config.url.indexOf('http')!=0 && token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },

    // If a token was sent back, save it
    response: function(res) {
      if(res.config.url.indexOf('http')!=0 && res.data.token) {
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
    
  self.signup = function(name, email, password, rpassword) {
  return $http.post('users/signup', {
      name: name,
      email: email,
      password: password,
      rpassword: rpassword
    }).then(function(result) {
          if (result.data.success){
             $window.localStorage.setItem('user',JSON.stringify(result.data.user));
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
            $window.localStorage.setItem('user',JSON.stringify(result.data.user));
          }
          return result;
      });
  };
    
    
  self.saveData = function(user) {
      return $http.post('users/updateProfile', {
          id: user._id,
          city: user.city,
          state: user.state
      }).then(function(result) {
          if (result.data.success){
            $window.localStorage.setItem('user',JSON.stringify(result.data.user));
          }
          return result;
      });
  };
    
  self.savePassword = function(user) {
      return $http.post('users/updatePassword', {
          id: user._id,
          cPassword: user.cPassword,
          nPassword: user.nPassword
      }).then(function(result) {
          if (result.data.success){
            $window.localStorage.setItem('user',JSON.stringify(result.data.user));
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

/* Book service */

var bookService = function($http) {
    
  var self = this;
  var bookSearchUrl = 'https://www.googleapis.com/books/v1/volumes'
  var key = 'AIzaSyBaaedeK5ybP_NI1gp9rH_acw-WP3jy5vk';
    
  self.search = function(query) {
      return $http.get(bookSearchUrl + '?q=' + query + '&orderBy=relevance&printType=books&projection=lite' + '&key=' + key).then(function(result) {
              return result;
          });
  };
    
  self.mybooks = function(user) {
      return $http.post('book/mybooks', {
              email: user.email,
          }).then(function(result) {
              return result;
          });
  };
    
  self.allBooks = function(user) {
      return $http.post('book/allBooks', {
              email: user.email,
          }).then(function(result) {
              return result;
          });
  };
    
  self.save = function(user,bookID,bookTitle,bookAuthors,bookImgUrl) {
      return $http.post('book/saveBook', {
              email: user.email,
              id:bookID,
              title:bookTitle,
              author:bookAuthors,
              imgUrl:bookImgUrl
          }).then(function(result) {
              return result;
          });
  };
    
    
  self.saveTrade = function(user,book) {
      return $http.post('trade/save', {
              userID: user._id,
              bookID:book._id
          }).then(function(result) {
              return result;
          });
  };
    
  self.myTrades = function(user) {
      return $http.post('trade/myTrades', {
              userID: user._id,
          }).then(function(result) {
              return result;
          });
  };
    
  self.tradesForYou = function(user) {
      return $http.post('trade/tradesForYou', {
              email: user.email,
          }).then(function(result) {
              return result;
          });
  };
    
  self.removeTrade = function(trade) {
      return $http.post('trade/remove', {
              id: trade._id,
          }).then(function(result) {
              return result;
          });
  };
    
  self.updateTradeStatus = function(trade,status) {
      return $http.post('trade/updateTradeStatus', {
              tradeID: trade._id,
              status: status
          }).then(function(result) {
              return result;
          });
  };
    
  self.remove = function(id) {
      return $http.post('book/removeBook', {
              id:id,
          }).then(function(result) {
              return result;
          });
  };
    
    
};


/* End book service */

/* Main controller definition */

AppController.$routeConfig = [
    { path: '/', component: 'main', as:'main' },
    { path: '/user/login', component: 'user_login', as:'login' },
    { path: '/user/signup', component: 'user_signup', as:'signup' },
    { path: '/user/profile', component: 'user_profile', as:'profile' },
    { path: '/user/mybooks', component: 'book_mybooks', as:'mybooks' },
    { path: '/user/allbooks', component: 'book_allbooks', as:'allbooks' }
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

var app = angular.module('appMain', ['ngNewRouter','main','user.signup','user.login','user.profile','book.mybooks','book.allbooks']).controller('AppController', ['$scope', '$router', 'user', 'auth', '$location', AppController]);

app.factory('authInterceptor', authInterceptor)
.service('user', userService)
.service('auth', authService)
.service('book',bookService)
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});