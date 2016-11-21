app.controller('mainController', ['$scope', 'topicService', 'postService', 'commentService', 'userService', '$location', '$routeParams', '$cookies', '$timeout', function($scope, topicService, postService, commentService, userService, $location, $routeParams, $cookies, $timeout){
  var myCookie = $cookies.getObject('user');
  $scope.curUser = myCookie;
  if(myCookie){
    if($location.url() === '/login' || $location.url() === '/register'){
      $location.url('/dashboard');
    }
  }else{
    if($location.url() !== '/login' && $location.url() !== '/register'){
      $location.url('/login');
    }
  }

  function getTopics(){
    topicService.index(function(err, topics){
      if(err){
        $scope.errors = err;
        return;
      }
      $scope.topics = topics;
    })
  }
  getTopics();

  $scope.createTopic = function(){
    var user_id = $scope.curUser._id;
    if(!user_id){
      return "Error: current user undefined!";
    }
    var data = $scope.newTopic;
    data._user = user_id;
    topicService.create(data, function(err, topic){
      if(err){
        $scope.topicError = err;
        return;
      }
      $scope.newTopic = {};
      getTopics();
    })
  };



  $scope.createPost = function(topic_id){
    var postData = $scope.newPost;
    postData._topic = topic_id;
    postData._user = $scope.curUser._id;
    postService.create(postData, function(err, post){
      if(err){
        $scope.errors = err;
      }else{
        $scope.newPost = {};
        showTopic(topic_id);
      }
    })
  }

  function showTopic(topic_id){
    topicService.showTopic(topic_id, function(err, topic){
      if(err){
        $location.url('/dashboard');
        alert(err);
      }else{
        $scope.topic = topic;
      }
    })
  };
  if($routeParams.topic_id){
    showTopic($routeParams.topic_id);
  };

  function showUser(user_id){
    userService.show(user_id, function(err, user){
      if(err){
        $location.url('/dashboard');
        alert(err);
      }else{
        $scope.showedUser = user;
      }
    })
  }
  if($routeParams.user_id){
    showUser($routeParams.user_id);
  };

  // vote section starts ------
  // need to fix: disable button, dynamically show changes


  // Old update votes function. getting an obj from db like {upvoted: true, downvoted: false}
  // function updateVotes(post){
  //   console.log("Step 3.5: in updateVote fn");
  //   postService.updateVotes($scope.curUser._id, post._id, function(err, res){
  //     console.log("Step 6: get data from service, res: ", res);
  //     if(err){
  //       $scope.errors = err;
  //     }else{
  //       showTopic($routeParams.topic_id);
  //     }
  //   })
  // }

  $scope.upvote = function(post){
    var data = {
      user_id: $scope.curUser._id,
      post_id: post._id
    };
    postService.vote(data, "upvote", function(err, post){
      if(err){
        $scope.votedError = err;
        $timeout(function(){
          $scope.votedError = undefined;
        }, 2000);
      }else{
        showTopic($routeParams.topic_id);
        // updateVotes(post._id);
      }
    })
  };
  $scope.downvote = function(post){
    var data = {
      user_id: $scope.curUser._id,
      post_id: post._id
    };
    postService.vote(data, "downvote", function(err, post){
      if(err){
        $scope.votedError = err;
        $timeout(function(){
          $scope.votedError = undefined;
        }, 2000);
      }else{
        showTopic($routeParams.topic_id);
        // updateVotes(post._id);
      }
    })
  }
  // vote section ends ------


  $scope.createComment = function(post, topic_id){
    var commentData = {content: post.newComment};
    commentData._post = post._id;
    commentData._user = $scope.curUser._id;
    commentService.create(commentData, function(err, comment){
      if(err){
        $scope.commentErrors = err;
      }else{
        post.newComment = "";
        showTopic(topic_id);
      }
    })
  };
  $scope.deleteComment = function(comment){
    if($scope.curUser._id !== comment._user._id){
      $scope.deletingError = "No authorization to delete this comment!";
      return;
    }
    commentService.delete(comment._id, $scope.curUser._id, function(err){
      if(err){
        $scope.deletingError = err;
      }
      showTopic($routeParams.topic_id);
    })
  };
  $scope.deletePost = function(post){
    if($scope.curUser._id !== post._user._id){
      $scope.deletingError = "No authorization to delete this post!";
      return;
    }
    postService.delete(post._id, $scope.curUser._id, function(err){
      if(err){
        $scope.deletingError = err;
      }
      showTopic($routeParams.topic_id);
    })
  }
  $scope.logout = function(){
    $cookies.remove('user');
    $scope.curUser = undefined;
    $location.url('/login');
  }
}])
