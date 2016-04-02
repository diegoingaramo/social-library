angular.module('user.login', ['ngNewRouter'])
  .controller('UserLoginController', ['$scope','user','$location','$routeParams', function ($scope,user,$location, $routeParams) {
      
    //model initialization
    $scope.email = "";
    $scope.username = "";
      
    $scope.login = function() {
    user.login($scope.email, $scope.password).then(function(result) {
       if (result.data.success){
           //$scope.$parent.user = user.currentUser();
           $location.path('/');
       }
        else
            bootbox.alert(result.data.message);
       }, function(reason) {
         bootbox.alert("Error: " + reason);
    });
  };
      
  }]);