angular.module('userService', []).factory('User', function($http){

    return {
      get : function() {
        return $http.get('/users');
      },
      show : function(id) {
        return $http.get('/users/' + id);
      },
      save : function(post) {
        return $http({
          method: 'POST',
          url: '/users',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(post)
        });
      },
      destroy : function(id) {
        return $http.delete('/users/' + id);
      },
      search : function(keyword){
        return $http.get('/search/' + keyword);
      }
    };
});
