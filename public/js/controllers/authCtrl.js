angular.module('authCtrl', []).controller('authController', function ($scope, Auth, $uibModalInstance, Session) {
    
    $scope.message = "";
    $scope.messageOn = false;
    
    $scope.loginData = {};
    $scope.newUser = {};
    
    $scope.loading = false;
    
    $scope.tab = 1;

    $scope.setTab = function (tabId) {
        $scope.messageOn = false;
        $scope.tab = tabId;
    };
    
    $scope.isSet = function (tabId) {
        return $scope.tab === tabId;
    };
    
    $scope.login = function(){
      if($scope.loginData.email!=null&&$scope.loginData.password!=null){
        $scope.loading = true;
        
        Auth.login($scope.loginData).success(function(response){
          if(response.email == $scope.loginData.email){
            Session.create(response);
            $scope.messageOn = false;
            
            //console.log(Session.currentUser);
            $scope.loginData = {};
            
            $uibModalInstance.close(response);
          } else {
          $scope.message = response.message;
          $scope.messageOn = true;
          }
          
          $scope.loading = false;
        }).error(function(response){
          console.log(response);
          
          $scope.loading = false;
        });
      } else if($scope.loginData.email==null){
        $scope.message = "이메일 형식이 바르지 않습니다."
        $scope.messageOn = true;
      } else if($scope.loginData.password==null){
        $scope.message = "비밀번호를 입력해야 합니다."
        $scope.messageOn = true;
      }
    };
    
    $scope.signup = function(){
      if($scope.newUser.email==null){
        $scope.message = "이메일 형식이 바르지 않습니다."
        $scope.messageOn = true;
      } else if($scope.newUser.password==null){
        $scope.message = "비밀번호를 입력해야 합니다."
        $scope.messageOn = true;
      } else if($scope.newUser.password!=$scope.newUser.password_confirm) {
        $scope.message = "확인 비밀번호가 일치하지 않습니다."
        $scope.messageOn = true;
      } else if($scope.newUser.nickname==null){
        $scope.message = "닉네임을 입력해야 합니다."
        $scope.messageOn = true;
      } else {
        $scope.loading = true;
        Auth.signup($scope.newUser).success(function(response){
          
          if(response.email == $scope.newUser.email){
            Session.create(response);
            $scope.messageOn = false;
            $scope.newUser = {};
            
            $uibModalInstance.close(response);
          } else {
          $scope.message = response.message;
          $scope.messageOn = true;
          }
          
          $scope.loading = false;
        }).error(function(response){
          console.log(response);
          
          $scope.loading = true;
        });
      
      } 
    };
    
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});