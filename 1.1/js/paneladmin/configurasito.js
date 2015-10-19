var app = angular.module('app');
app.controller('ConfiguraSito', function($rootScope, $scope, $http) {
    $scope.busy=false;

    $scope.getNumber = function(num) {
        num=parseInt(num);
        return new Array(num);
    }

    $scope.saveSetting = function (){
            if(!confirm("Continuare?")){ return false; }
            if($scope.busy==true){ return }
            $scope.busy=true;

            $rootScope.HTTP('POST',urlFUNCTION+"paneladmin/controller.php?action=saveInfoSito",$scope.dataPost)
                .then(function(response){
                    $scope.busy=false;
                });

    };


    $scope.getSetting = function(){
        $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=getInfoSito",data:null , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){
                $scope.dataPost=response.data;
            }   $scope.busy=false;  });
    }

    $scope.getSetting();

});