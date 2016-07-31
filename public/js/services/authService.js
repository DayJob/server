angular.module('authService', []).factory('Auth', function($http){

    return {
      login : function(user) {
        return $http({
          method: 'POST',
          url: '/api/login',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(user)
        })
      },

      signup : function(user) {
        return $http({
          method: 'POST',
          url: '/api/signup',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(user)
        });
      },

      logout : function() {
        return $http.get('/api/logout');
      },

      status : function() {
        return $http.get('/api/status');
      }
      
    };
})

.service('Session', function () {
  this.create = function (userData) {
    this.currentUser = userData;
  };
  this.destroy = function () {
    this.currentUser = null;
  };
})
