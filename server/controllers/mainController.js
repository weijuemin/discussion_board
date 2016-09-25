var Comment = require('../models/comments.js'),
    Post = require('../models/posts.js'),
    Topic = require('../models/topics.js'),
    User = require('../models/users.js');

function mainControllerCustr(Comment, Post, Topic, User){
  
  this.createTopic = function(req, res){
    var user_id = req.body._user;
    Topic.create(req.body, function(err, topic){
      if(err){
        res.json(err);
      }else{
        if(!topic){
          res.json({errors: "Error creating/finding this topic"});
        }else{
          User.update({_id: user_id}, {$push: {_topics: topic}}, function(err){
            if(err){
              res.json(err);
            }else{
              res.json(topic);
            }
          })
        }
      }
    })
  };
  this.createPost = function(req, res){
    var topic_id = req.body._topic;
    var user_id = req.body._user;
    Post.create(req.body, function(err, post){
      if(err){
        res.json(err);
      }else{
        Topic.update({_id: topic_id}, {$push: {_answers: post}}, function(err, topic){
          if(err){
            res.json(err);
          }else{
            if(!topic){
              res.json({errors: "Error finding this topic"});
            }else{
              User.update({_id: user_id}, {$push: {_answers: post}}, function(err){
                if(err){
                  res.json(err);
                }else{
                  res.json(post);
                }
              })
            }
          }
        })
      }  
    })
  };
  this.createComment = function(req, res){
    var post_id = req.body._post;
    var user_id = req.body._user;
    Comment.create(req.body, function(err, comment){
      if(err){
        res.json(err);
      }else{
        Post.update({_id: post_id}, {$push: {_comments: comment}}, function(err, post){
          if(err){
            res.json(err);
          }else{
            if(!post){
              res.json({errors: "Error finding this post"});
            }else{
              User.update({_id: user_id}, {$push: {_comments: comment}}, function(err){
                if(err){
                  res.json(err);
                }else{
                  res.json(comment);
                }
              })
            }
          }
        })
      }  
    })
  };
  
  // for admins
  this.getAllDataOnTopics = function(req, res){
    Topic.find({}).populate([
      {
        path: '_answers',
        populate: 
        [{
          path: '_comments',
          populate: {
            path: '_user'
          }
        },
        {
            path: '_user'
        }]
      },
      {
        path: '_user'
      }
    ])
    .exec(function(err, topics){
      if(err){
        res.json(err);
      }else if(!topics.length){
        res.json({errors: "No topics found yet"});
      }else{
        res.json(topics);
      }
    });
  };

  this.showTopics = function(req, res){
    Topic.find({}).populate('_user').exec(function(err, topics){
      if(err){
        res.json(err);
        return;
      }else{
        if(!topics.length){
          res.json({errors: "No topics found in database"});
          return;
        }else{
          res.json(topics);
        }
      }
    })
  };

  this.showOneTopic = function(req, res){
    var topic_id = req.params.topic_id;
    Topic.findById(topic_id).populate([{
      path: '_user'
    },
    {
      path: '_answers',
      populate: [{
        path: '_user'
      },
      {
        path: '_comments',
        populate: {
          path: '_user'
        }
      }]
    }]).exec(function(err, topic){
      if(err){
        res.json(err);
        return;
      }else{
        if(topic){
          res.json(topic);
        }else{
          res.json({errors: "Error: topic no longer exists!"});
        }
      }
    })
  };

  // vote section starts ------
  this.upvote = function(req, res){
    var user_id = req.body.user_id,
        post_id = req.body.post_id;

    User.findById(user_id, function(err, user){
      if(user && (user._upvotes.indexOf(post_id) > -1 || user._downvotes.indexOf(post_id) > -1)){
        res.json({errors: "Already voted"});
      }else{
        User.update({_id: user_id}, {$push: {_upvotes: post_id}}, function(err, user){
          if(err) return res.json(err);
          Post.update({_id: post_id}, {$push: {_upvoters: user_id}}, function(err, post){
            if(err) return res.json(err);
            if(!post){
              return res.json({errors: "Error: post not found!"});
            }
            res.json(post);
          })
        })    
      }
    })
  };
  this.downvote = function(req, res){
    var user_id = req.body.user_id,
        post_id = req.body.post_id;
    User.findById(user_id, function(err, user){
      if(user && (user._upvotes.indexOf(post_id) > -1 || user._downvotes.indexOf(post_id) > -1)){
        res.json({errors: "Already voted"});
      }else{
        User.update({_id: user_id}, {$push: {_downvotes: post_id}}, function(err, user){
          if(err) return res.json(err);
          Post.update({_id: post_id}, {$push: {_downvoters: user_id}}, function(err, post){
            if(err) return res.json(err);
            if(!post){
              return res.json({errors: "Error: post not found!"});
            }
            res.json(post);
          })
        })
      }
    })
  };

  // Deprecated fn. Sending an obj like {upvoted: true, downvoted: false} to front end
  // this.updateVotes = function(req, res){
  //   var user_id = req.body.user_id,
  //       post_id = req.body.post_id;
  //   User.findById(user_id, function(err, user){
  //     if(err) return handleError(err);
  //     if(user){
  //       var upvotes = user._upvotes,
  //           downvotes = user._upvotes;
  //       res.json({upvoted: upvotes.indexOf(post_id)>-1, downvoted: downvotes.indexOf(post_id)>-1});
  //     }else{
  //       res.json({errors: "Error: user not found"});
  //     }
  //   });
  // }
  // vote section ends ------


  this.deleteComment = function(req, res){
    var comment_id = req.params.comment_id;
    var user_id = req.params.user_id;
    Comment.findById(comment_id, function(err, comment){
      if(err){
        res.json(err);
        return;
      }
      if(!comment){
        res.json({errors: "Error: comment not found!"});
        return;
      }
      Post.update({_id: comment._post}, {$pull: {_comments: comment._id}}, function(err, post){
        if(err) return res.json(err);
        User.update({_id: user_id}, {$pull: {_comments: comment._id}}, function(err, user){
          Comment.remove({_id: comment._id}, function(err){
            if(err) return res.json(err);
            res.json(post);
          });
        })
      })
    })
  };
  this.deletePost = function(req, res){
    var post_id = req.params.post_id;
    var user_id = req.params.user_id;
    Post.findById(post_id, function(err, post){
      if(err){
        res.json(err);
        return;
      }
      if(!post){
        res.json({errors: "Error: post not found!"});
        return;
      }
      Topic.update({_id: post._topic}, {$pull: {_answers: post._id}}, function(err, topic){
        console.log("step 0: in topic update");
        if(err) return res.json(err);
        User.update({_id: user_id}, {$pull: {_answers: post._id}}, function(err, user){
          if(err) return handleError(err);
          User.update({_id: user_id}, {$pull: {_comments: {$in: post._comments}}}, function(err, user){
            if(err) return handleError(err);
            Comment.remove({_id: {$in: post._comments}}, function(err){
              if(err) return res.json(err);
              Post.remove({_id: post._id}, function(err){
                if(err) return res.json(err);
                res.json(post);
              })
            })
          })
        })
      })
    })
  }

  // for development use.
  this.flushDB = function(req, res){
    Topic.remove({}, function(err){
      if(!err){
        Post.remove({}, function(err){
          if(!err){
            Comment.remove({}, function(err){
              if(err){
                res.json(err);
              }else{
                User.remove({}, function(err){
                  if (err) return handleError(err);
                  res.json("DB flushed");
                })
              }
            });
          }else{
            res.json(err);
          }
        });
      }else{
        res.json(err);
      }
    });
  }
}

module.exports = new mainControllerCustr(Comment, Post, Topic, User);