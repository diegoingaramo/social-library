angular.module('book.allbooks', ['ngNewRouter'])
  .controller('BookAllBooksController', ['$scope','book','user','$location','$routeParams', function ($scope,book,user,$location, $routeParams) {
      
    //model initialization
    $scope.search = "";
    $scope.books = [];
    $scope.bookRequests = []; 
      
    $scope.saveTrade = function(bookDoc) {
       book.saveTrade(user.currentUser(), bookDoc).then(function(result) {       
                 bootbox.alert(result.data.message);
                 book.myTrades(user.currentUser()).then(function(result) {       
                    if (result.data.success){
                        $scope.bookRequests = result.data.trades;
                    }
                    else
                         bootbox.alert(result.data.message); 
                   }, function(reason) {
                     bootbox.alert("Error: " + reason);
                });
        }, function(reason) {
             bootbox.alert("Error: " + reason);
        });
    };
       
    $scope.init = function() {
        book.allBooks(user.currentUser()).then(function(result) {       
            if (result.data.success){
                $scope.books = result.data.books;
            }
            else
                 bootbox.alert(result.data.message); 
           }, function(reason) {
             bootbox.alert("Error: " + reason);
        });
        
        book.myTrades(user.currentUser()).then(function(result) {       
            if (result.data.success){
                $scope.bookRequests = result.data.trades;
            }
            else
                 bootbox.alert(result.data.message); 
           }, function(reason) {
             bootbox.alert("Error: " + reason);
        });
    };
      
    $scope.init();
      
  }]);