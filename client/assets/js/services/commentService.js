app.service('commentService', ['$http', function($http){
  this.create = function(commentData, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.post('/comments', commentData).then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  };
  this.delete = function(comment_id, user_id, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.delete(`/comments/${comment_id}/${user_id}`).then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  }
}])