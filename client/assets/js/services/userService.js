app.service('userService', ['$http', function($http){
  this.login = function(userdata, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.post('/session/login', userdata).then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  };
  this.register = function(userdata, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.post('/session/register', userdata).then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  };
  this.show = function(user_id, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.get(`/user/${user_id}`).then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  }
}])
