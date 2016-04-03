angular.module('book.allbooks', ['ngNewRouter'])
  .controller('BookAllBooksController', ['$scope','book','$location','$routeParams', function ($scope,book,$location, $routeParams) {
      
    //model initialization
    $scope.search = "";
      
    $scope.searchMyBook = function() {
    book.search($scope.search).then(function(result) {       
           console.log(result);
           //book.save();
        }, function(reason) {
            bootbox.alert("Error: " + reason);
    });
  };
      
  }]);