app.controller('sessionController', ['$scope', 'userService', '$cookies', '$location', function($scope, userService, $cookies, $location){

  var myCookie = $cookies.getObject('user');
  if(myCookie){
    if($location.url() === '/login' || $location.url() === '/register'){
      $location.url('/dashboard');
    }
  }else{
    if($location.url() !== '/login' && $location.url() !== '/register'){
      $location.url('/login');
    }
  }

  $scope.login = function(){
    userService.login($scope.lUser, function(err, user){
      if(err){
        $scope.loginErrors = err;
      }else{
        $cookies.putObject('user', user);
        $location.url('/dashboard');
      }
    })
  };
  $scope.register = function(){
    userService.register($scope.rUser, function(err, user){
      if(err){
        $scope.regErrors = err;
      }else{
        $location.url('/login');
      }
    })
  };

}])