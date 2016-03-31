// services.js
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.createToken = function(user) {  
  console.log(app.get('superSecret')); 
  return jwt.sign(user, app.get('superSecret'), {
          expiresIn: 86400 // expires in 24 hours
        });
};


/* jwt util to verify token existence */

exports.isAuthenticated = function(req, res, next){

  // check header or url parameters or post parameters for token
  //var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var bearerHeader = req.headers["authorization"];

  // decode token
  if (typeof bearerHeader !== 'undefined') {
      
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];
    
    // verifies secret and checks exp
    jwt.verify(bearerToken, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
    
};


/*exports.ensureAuthorized = function(req, res, next) {
    
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
    
};*/