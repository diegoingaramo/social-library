var express = require('express');

/* token service */
var token_service = require('../service/token_service.js');

var User = require('../model/user'); // get our mongoose model
var Book = require('../model/book'); // get our mongoose model

var router = express.Router();

router.post('/mybooks', token_service.isAuthenticated, function(req, res) {
    
    Book.find({owner: {'$ne':req.body.email }, enabled: true}, function(err, books) {
            
           if (err) throw err;
            
           return res
                  .status(200)
                  .send({success: true, books: books});

            
    });
        
});

router.post('/allbooks', token_service.isAuthenticated, function(req, res) {
    
    Book.find({owner: req.body.email, enabled: true}, function(err, books) {
            
           if (err) throw err;
            
           return res
                  .status(200)
                  .send({success: true, books: books});

            
    });
        
});


router.post('/saveBook', token_service.isAuthenticated, function(req, res) {
    
    var book = new Book({
                    owner: req.body.email,
                    title: req.body.title,
                    author: req.body.author,
                    imgUrl: req.body.imgUrl,
                    enabled: true
    });

    book.save(function(err,book){
                    
                    return res
                        .status(200)
                        .send({success: true, book: book});
    });
        
});

router.post('/removeBook', token_service.isAuthenticated, function(req, res) {
    
    console.log(req.body);
    
    Book.findOne({_id: req.body.id}, function(err, book) {
            
       if (err) throw err;
        
       book.enabled = false;
             
       book.save(function(err,book){
                    
           return res
                    .status(200)
                    .send({success: true, book: book});
        });
            
    });
        
});


module.exports = router;