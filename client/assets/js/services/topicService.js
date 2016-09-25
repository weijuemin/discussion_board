app.service('topicService', ['$http', function($http){
  this.index = function(callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.get('/topics').then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  };
  this.showTopic = function(topic_id, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.get(`/topics/${topic_id}`).then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  };
  this.create = function(topicData, callback){
    if(typeof callback !== 'function'){
      return "Wrong arg type";
    }
    $http.post('/topics', topicData).then(function(res){
      if(res.data.errors){
        callback(res.data.errors, null);
      }else{
        callback(null, res.data);
      }
    })
  };
}])