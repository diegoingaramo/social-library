angular.module('user.signup', ['ngNewRouter'])
  .controller('UserSignupController', ['$scope','user','$location','$routeParams', function ($scope,user,$location, $routeParams){
    
    //model initialization
    $scope.name = "";  
    $scope.email = "";
    $scope.password = "";
    $scope.rpassword = "";
      
      
    $scope.signup = function() {
        user.signup($scope.name, $scope.email, $scope.password, $scope.rpassword).then(function(result) {
            if (result.data.success){
                $location.path('/');
            }
            else
                 bootbox.alert(result.data.message);
       }, function(reason) {
         bootbox.alert("Error: " + reason);
       });
    };
      
  }]);