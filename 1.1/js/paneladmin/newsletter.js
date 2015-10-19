var app = angular.module('app');
app.controller('AdminNewsletter', function($rootScope, $scope, $http, ListAdmin) {
    $scope.postData={
      ip:'',
      limit:30,
      onStartQuery:0,
      orderBy:'lastupdate',
      urlPost:'paneladmin/newsletter-list.php'
    };
    $scope.list = new ListAdmin();

    $scope.getNumber = function(num) {
        num=parseInt(num);
        return new Array(num);
    }

    $scope.saveSetting = function (){

            if(!confirm("Continuare?")){ return false; }
            if($scope.busy==true){ return }
            $scope.busy=true;

            $rootScope.HTTP('POST',urlFUNCTION+"paneladmin/controller.php?action=saveSetting",$scope.setting)
                .then(function(response){
                    $scope.busy=false;
                });

    };


    $scope.getSetting = function(){
        $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=getSettingNewsletter",data:null , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){
                $scope.setting=response.data;
            }   $scope.busy=false;  });
    }
    $scope.setting = $scope.getSetting();

    $scope.busy=false;
    $scope.$watch('postData.orderBy', function () {
        $scope.list.items=[];
        $scope.list.nextPage(0,$scope.postData);
    });

});