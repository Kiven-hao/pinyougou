app.controller('indexController',function($scope,$controller,loginService){
	$scope.showLoginName=function(){
		alert(loginName);
		loginService.loginName().success(
			function(response){
				$scope.loginName=response.loginName;
				
			}
		);
	}
});