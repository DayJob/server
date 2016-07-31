angular.module('postService', []).factory('Post', function($http){

    return {
      get : function() {
        return $http.get('/posts');
      },
      paginate : function(offset, limit) {
        return $http.get('/posts/paginate/' + offset + '/' + limit);
      },
      show : function(id) {
        return $http.get('/posts/' + id);
      },
      save : function(post) {
        return $http({
          method: 'POST',
          url: '/posts',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(post)
        });
      },
      destroy : function(id) {
        return $http.delete('/posts/' + id);
      },
      search : function(keyword){
        return $http.get('/search/' + keyword);
      }
    };
});
