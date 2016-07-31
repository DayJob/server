var myApp = angular.module('myApp', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'aboutCtrl', 'authCtrl', 'postService', 'userService', 'authService']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
  
  $httpProvider.defaults.cache = false;
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    
  $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';


  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "/views/home.html"
    })
    .state('post', {
      url: "/post",
      templateUrl: "/views/posts.html"
    })
    .state('google_map', {
      url: "/google_map",
      templateUrl: "/views/google_map.html",
      controller: "aboutController"
    })
    .state('android_app', {
      url: "/android_app",
      templateUrl: "/views/android_app.html",
      controller: "aboutController"
    })
});

myApp.controller('myController', function($scope, $window, Post, User, Auth, $uibModal){
    $scope.userLoading = true;
    $scope.postLoading = false;
    $scope.showMoreLoading = false;
    $scope.searchLoading = false;
    
    $scope.postData = {creator: '', title: '', body: ''};
    $scope.posts = [];
    
    $scope.keyword = "";
    $scope.result = [];

    $scope.users = [];
    
    $scope.currentInfo = {};
    $scope.logginIn = false;

    $scope.remainingPosts = null;

    $scope.status = function(){
      Auth.status().success(function(response){
        if(response){
          $scope.currentInfo = response;
          $scope.logginIn = true;
        }
      });
    };

    $scope.status();

    $scope.getPost = function(){
      $scope.showMoreLoading = true;
      
      $scope.posts = [];
      
      Post.paginate(0, 1).success(function(response){
          //$scope.posts = response.data.docs;
          //Convert to local timezone
          //console.log(new Date($scope.posts[0].createdAt));
          $scope.limit = 3;
          $scope.offset = response.data.total;
          $scope.remainingPosts = $scope.offset;

          $scope.showMore($scope.offset);

      });
    };

    $scope.getPost();

    $scope.showMore = function(offset){
      $scope.showMoreLoading = true;
      
      $scope.offset -= $scope.limit;

      if($scope.offset < 0){
        $scope.limit = $scope.limit + $scope.offset;

        $scope.offset = 0;
      }

      Post.paginate($scope.offset, $scope.limit).success(function(response){
          $scope.posts = $scope.posts.concat(response.data.docs);
          $scope.remainingPosts = $scope.offset;
          
          $scope.showMoreLoading = false;
      });

    };


    $scope.post = function(){
      $scope.postLoading = true;
      $scope.postData.creator = $scope.currentInfo._id;
      Post.save($scope.postData).success(function(response){
        $scope.postData = {};

        $scope.postLoading = false;
        $scope.showMoreLoading = true;
        
        $scope.posts = [];
        
        Post.paginate(0, 1).success(function(response){
            //$scope.posts = response.data.docs;
            //Convert to local timezone
            //console.log(new Date($scope.posts[0].createdAt));
            $scope.limit = 3;
            $scope.offset = response.data.total;
            $scope.remainingPosts = $scope.offset;
  
            $scope.showMore($scope.offset);
  
        });
      }).error(function(response){
        console.log(response);
        $scope.postLoading = false;
      });

    };

    $scope.destory = function(post){
      if($window.confirm('정말 이 게시물을 삭제합니까?')){
        Post.destroy(post._id).success(function(response){
          if(response.success){
             var index = $scope.posts.indexOf(post);
             $scope.posts.splice(index, 1);

          } else {
             $window.alert(response.message);
          }
  
        }).error(function(response){
          console.log(response);
        });
      }
    };

    $scope.search = function(keyword){
      if(keyword == null || $scope.keyword == keyword){
        //think it as a uselsss request
      } else {
        $scope.searchLoading = true;
        $scope.keyword = keyword;
        
        Post.search(keyword).success(function(response){
            $scope.result = response.data.docs;
            $scope.searchLoading = false;
        }).error(function(response){
          console.log(response);
        });
      }
    };

    $scope.getUsers = function(){
      User.get().success(function(response){
        $scope.users = response.data;
        
         $scope.userLoading = false;
      });
    };

    $scope.getUsers();

    $scope.destoryUser = function(id){
      
      if($window.confirm('정말 이 계정을 삭제합니까?')){
        User.destroy(id).success(function(response){
          $scope.getUsers();
        }).error(function(response){
          console.log(response);
        });
      }

    };

    $scope.logout = function(){
      Auth.logout().success(function(response){
        if(response == null){
          $scope.currentInfo = {};
          $scope.logginIn = false;

        } else {
          $window.confirm('비정상적인 로그아웃.. 다시시도해 주세요.')
        }
        
      }).error(function(response){
        console.log(response);
      });
    };
    
    $scope.open = function (size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'authController',
        size: size
        // resolve: {
        //   items: function () {
        //     return $scope.items;
        //   }
        // }
      });
      
      modalInstance.result.then(function (response) {
        $scope.currentInfo = response;
        $scope.logginIn = true;
      }, function () {
        //cancel
      });
    };
  
    
});