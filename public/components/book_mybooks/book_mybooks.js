angular.module('book.mybooks', ['ngNewRouter'])
  .controller('BookMyBooksController', ['$scope','book','user','$location','$routeParams', function ($scope,book,user,$location, $routeParams) {
      
    //model initialization
    $scope.search = "";
    $scope.books = [];
    $scope.bookRequests = [];  
      
    $scope.searchMyBook = function() {
        book.search($scope.search).then(function(result) {       
               result.data.items = result.data.items.filter(function (book){
                   return book.volumeInfo.imageLinks
               });
               var googleBook = result.data.items[0];
               book.save(user.currentUser(), googleBook.id,googleBook.volumeInfo.title,googleBook.volumeInfo.authors.join(),googleBook.volumeInfo.imageLinks.thumbnail).then(function(result) { 
                    if (result.data.success)
                        $scope.books.push(result.data.book);
                   else
                        bootbox.alert(result.data.message);
               }, function(reason) {
                    bootbox.alert("Error: " + reason);
              });
           }, function(reason) {
             bootbox.alert("Error: " + reason);
        });
    };
      
      
    $scope.removeBook = function(id, index) {
        book.remove(id).then(function(result) { 
            if (result.data.success)
                $scope.books.splice(index,1);
            else
                bootbox.alert(result.data.message);
            }, function(reason) {
                bootbox.alert("Error: " + reason);
        });
    };
      
    $scope.removeTrade = function(trade, index) {
        book.removeTrade(trade).then(function(result) { 
            if (result.data.success)
                $scope.bookRequests.splice(index,1);
            else
                bootbox.alert(result.data.message);
            }, function(reason) {
                bootbox.alert("Error: " + reason);
        });
    };  
       
    $scope.init = function() {
        
        book.mybooks(user.currentUser()).then(function(result) {       
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