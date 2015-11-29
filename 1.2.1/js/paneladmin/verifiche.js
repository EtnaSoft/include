var app = angular.module('app');
app.controller('AdminVerifiche', function($rootScope, $scope, $http, ListAdmin) {
    $scope.postData={
      ip:'',
      limit:100,
      onStartQuery:0,
      typeView:'foto',
      orderBy:'lastupdate',
      urlPost:'paneladmin/verifiche-list.php'
    };
    $scope.list = new ListAdmin();
    $scope.busy=false;
    $scope.$watch('postData.typeView', function () {
        $scope.list.items=[];
        $scope.list.nextPage(0,$scope.postData);
    });

    $scope.typeView={}
    $scope.getType = function(position,permiss,value){
        $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=getTypeVerifiche",data:null , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){
                $scope.typeView=response.data; console.log(response.data);
            }  $scope.busy=false;  });
    }
    $scope.getType();

    $scope.elimina = function(position){
        if(!confirm("Conferami?")){ return }
        $http({ method: "POST", url: urlFUNCTIONV+"delete.php" ,data: {idType: $scope.list.items[position].id, type: $scope.postData.typeView} , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
          .success(function(response){
             if(response.error==0){
                $scope.list.items.splice(position, 1);
             }else{

             }
         })
        .error(function(){

        });
    }
    $scope.confirm = function(position,value){
        if(!confirm("Confermi?")){ return }
        data={
          id : $scope.list.items[position].id,
          type : $scope.postData.typeView,
          value : value
        }
        $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=chStato",data:data , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){
                 $scope.list.items.splice(position, 1);
            }  $scope.busy=false;  });
    }


});
