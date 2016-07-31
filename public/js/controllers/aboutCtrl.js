angular.module('aboutCtrl', [])
	.controller('aboutController', function($scope) {
		
	$scope.searchData = {option : "제목", search: "스타벅스 서울대점"};
	$scope.company = {};
	
	$scope.placement = {
		options: [
		  '제목',
		  '회사',
		  '글쓴이'
		],
		selected: '제목'
	};

  $scope.getCompany = function() {
		$scope.mapsrc = 'https://www.google.com/maps/embed/v1/place?q='+$scope.searchData.search+'&key=AIzaSyCeEzdW1QCze-iw6RHr1m0uDMsUiCgMrDw';
	};
	
	$scope.getCompany();
	
    
    
}).filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);