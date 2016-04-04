var express = require('express');

/* token service */
var token_service = require('../service/token_service.js');

var User = require('../model/user'); // get our mongoose model
var Book = require('../model/book'); // get our mongoose model
var Trade = require('../model/trade'); // get our mongoose model

var ObjectId = require('mongoose').Types.ObjectId; 

var router = express.Router();

router.post('/save', token_service.isAuthenticated, function(req, res) {
    
    Trade.findOne({requester: new ObjectId(req.body.userID), bookID: new ObjectId(req.body.bookID)}, function(err, trade) {
            
           if (err) throw err;
        
           if (trade)
             return res
                  .status(200)
                  .send({success: true, message: "You already requested this book"});
            else{
                var trade = new Trade({
                    requester: new ObjectId(req.body.userID), 
                    bookID: new ObjectId(req.body.bookID),
                    status: 0
                });
                
                trade.save(function(err,trade){
                    
                    if (err) throw err;
                    
                    return res
                        .status(200)
                        .send({success: true, message: "Your request was processed successfully"});
                });
            }
            
    });
    
});


router.post('/myTrades', token_service.isAuthenticated, function(req, res) {
    
    Trade.find({requester: new ObjectId(req.body.userID)}).populate('bookID').exec(function(err, trades) {
            
           if (err) throw err;
        
            return res
                .status(200)
                .send({success: true, trades: trades});
        
    });
    
});


router.post('/tradesForYou', token_service.isAuthenticated, function(req, res) {
    
    console.log(req.body.email);
    
    Trade.find({status:0}).populate( 'bookID', null, { owner: req.body.email}).exec(function(err, trades) {
        
            trades = trades.filter(function(trade){
                return trade.bookID;
            });
            
           if (err) throw err;
        
            return res
                .status(200)
                .send({success: true, trades: trades});
        
    });
    
});


router.post('/remove', token_service.isAuthenticated, function(req, res) {
    
    Trade.findOne({_id: req.body.id}).remove(function(err) {
            
       if (err) throw err;
        
           return res
                    .status(200)
                    .send({success: true});
    });
        
});


router.post('/updateTradeStatus', token_service.isAuthenticated, function(req, res) {

  // find the user
  Trade.findOne({_id: req.body.tradeID}, function(err, trade) {

    if (err) throw err;

        trade.status = req.body.status;
      
        console.log(trade);

        trade.save(function(err,user){
            if (err) throw err;

            return res
                .status(200)
                .send({success: true, message: ""});
        });
  });
    
});




module.exports = router;