app.service('postService', ['$http', function($http){
  this.create = function(postData, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.post('/posts', postData).then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  };
  this.delete = function(post_id, user_id, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.delete(`/posts/${post_id}/${user_id}`).then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  }

  // vote section starts ------
  // need to fix: disable button, dynamically show changes
  this.vote = function(data, which, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    if(which === "upvote" || which === "downvote"){
      $http.patch(`/posts/${which}`, data).then(function(res){
        if(res.data.errors){
          callback(res.data.errors, null);
        }else{
          callback(null, res.data);
        }
      })
    }else{
      return "Wrong arg type: vote-direction undefined";
    }
  };
  // this.updateVotes = function(user_id, post_id, callback){
  //   if(typeof callback !== 'function'){
  //     return "Wrong arg type";
  //   }
  //   var data = {
  //     user_id: user_id,
  //     post_id: post_id
  //   };
  //   console.log("Step 4: service, called updateVotes in ctrl. Data sent: ", data);
  //   $http.patch('/posts/updatevotes', data).then(function(res){
  //     console.log("Step 5: get res back from server: ", res.data);
  //     if(res.data.errors){
  //       callback(res.data.errors, null);
  //     }else{
  //       callback(null, res.data);
  //     }
  //   })
  // }
  // vote section ends ------
}])
