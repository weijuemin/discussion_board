var User = require('../models/users.js');

function sessionControllerCustr(User){
  this.showUser = function(req, res){
    var user_id = req.params.user_id;
    User.findById(user_id, function(err, user){
      if(err) return handleError(err);
      res.json(user);
    })
  };

  this.register = function(req, res){
    User.findOne({email: req.body.email}, function(err, user){
      if(err){
        res.json(err);
        return;
      }else{
        var user = new User(req.body);
        user.save(function(err, user){
          if(err){
            res.json(err);
          }else{
            res.json(user);
          }
        })
      }
    });
  };
  this.login = function(req, res){
    User.findOne({email: req.body.email}, function(err, user){
      if(err){
        res.json(err);
        return;
      }else{
        if(user){
          var isMatch = user.comparePassword(req.body.password);
          if (isMatch) {
            res.json(user);
          }else{
            res.json({errors: "Password incorrect"});
          }
        }else{
          res.json({errors: "User not found"});
        }
      }
    });
  }
}
module.exports = new sessionControllerCustr(User);