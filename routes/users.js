var express = require('express');

/* token service */
var token_service = require('../service/token_service.js');

var User = require('../model/user'); // get our mongoose model

var router = express.Router();

/* GET users listing. */
router.post('/signup', function(req, res) {
    
    if (req.body.password != req.body.rpassword)
        res.send({ success: false, message: 'Passwords don\'t match.' });
    else if (!req.body.name)
        res.send({ success: false, message: 'You must enter your name.' });
     else if (!req.body.email)
        res.send({ success: false, message: 'You must enter your email.' });
    else{
        
        // find the user
        User.findOne({email: req.body.email}, function(err, user) {
            
            if (err) throw err;
            
            if (!user) {

                var user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                user.save(function(err,user){
                    user.password = '';
                    return res
                        .status(200)
                        .send({success: true, token: token_service.createToken(user), user: user});
                });

            }else {
                 res.send({ success: false, message: 'User exists.' });
            }
        });
        
    }
});


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/login', function(req, res) {

  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = token_service.createToken(user);
          
        user.password = '';

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          user: user
        });
      }   

    }

  });
});


router.post('/updatePassword', token_service.isAuthenticated, function(req, res) {

  // find the user
  User.findOne({
    _id: req.body.id
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'User not found.' });
    } else {
        
        // check if password matches
      if (user.password != req.body.cPassword)
          res.json({ success: false, message: 'Invalid password.' });
      else{
            user.password = req.body.nPassword
            user.save(function(err,user){
                if (err) throw err;
                user.password = '';
                return res
                    .status(200)
                    .send({success: true, user: user});
            });
      }

    }

  });
});


router.post('/updateProfile', token_service.isAuthenticated, function(req, res) {

  // find the user
  User.findOne({
    _id: req.body.id
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'User not found.' });
    } else {
        
        user.city = req.body.city;
        user.state = req.body.state;
        
        user.save(function(err,user){
            if (err) throw err;
            user.password = '';
            return res
                .status(200)
                .send({success: true, user: user});
        });

    }

  });
});



// route to return all users (GET http://localhost:8080/users/list)
router.get('/list', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
}); 

module.exports = router;