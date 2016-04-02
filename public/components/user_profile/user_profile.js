angular.module('user.profile', ['ngNewRouter'])
  .controller('UserProfileController', ['$scope','user','$location','$routeParams', function ($scope,user,$location, $routeParams){
    
    //model initialization
    $scope.user = user.currentUser();  
      
    $scope.saveData = function() {
        user.saveData($scope.user).then(function(result) {
            if (result.data.success){
                bootbox.alert("Profile updated");
            }
            else
                 bootbox.alert(result.data.message);
       }, function(reason) {
         bootbox.alert("Error: " + reason);
       });
    };
      
    $scope.savePassword = function() {
        user.savePassword($scope.user).then(function(result) {
            if (result.data.success){
                bootbox.alert("Password updated");
                $scope.user = user.currentUser();
            }
            else
                 bootbox.alert(result.data.message);
       }, function(reason) {
         bootbox.alert("Error: " + reason);
       });
    };  
      
  }]);