var mCtrl = require('../controllers/mainController.js'),
    sCtrl = require('../controllers/sessionController.js');

module.exports = function(app){
  // login and reg
  app.get('/user/:user_id', sCtrl.showUser);
  app.post('/session/login', sCtrl.login);
  app.post('/session/register', sCtrl.register);

  // render data from db
  app.get('/get_dashboard_data', mCtrl.getAllDataOnTopics);
  app.get('/topics', mCtrl.showTopics);
  app.post('/topics', mCtrl.createTopic);
  app.get('/topics/:topic_id', mCtrl.showOneTopic);

  app.post('/posts', mCtrl.createPost);
  app.delete('/posts/:post_id/:user_id', mCtrl.deletePost);
  app.patch('/posts/upvote', mCtrl.upvote);
  app.patch('/posts/downvote', mCtrl.downvote);
  // app.patch('/posts/updatevotes', mCtrl.updateVotes);

  app.post('/comments', mCtrl.createComment);
  app.delete('/comments/:comment_id/:user_id', mCtrl.deleteComment);

  app.patch('/admin/flushDB', mCtrl.flushDB);
}