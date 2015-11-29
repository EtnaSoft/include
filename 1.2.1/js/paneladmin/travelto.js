var app = angular.module('app');
app.controller('AdminTravel', function($rootScope, $scope, $http, ListAdmin) {
    $scope.postData={
      ip:'',
      limit:30,
      onStartQuery:0,
      orderBy:'new',
      urlPost:'paneladmin/traveltosicily-list.php'
    };
    $scope.list = new ListAdmin();
    $scope.busy=false;

    $scope.$watch('postData.orderBy', function () {
        $scope.list.items=[];
        $scope.list.nextPage(0,$scope.postData);
    });

    $scope.chPermiss = function(position,permiss,value){
        data={
          id : $scope.list.items[position].id,
          permiss : permiss,
          value : value
        }
        $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=chPermissAttivita",data:data , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){
                if(permiss=="stato"){ $scope.list.items[position].privilegi.stato = response.newValue; }
                if(permiss=="banner"){ $scope.list.items[position].privilegi.banner = response.newValue; }
                if(permiss=="eventi"){ $scope.list.items[position].privilegi.eventi = response.newValue; }
                if(permiss=="booking"){ $scope.list.items[position].privilegi.booking = response.newValue; }
                if(permiss=="ecommerce"){ $scope.list.items[position].privilegi.ecommerce = response.newValue; }

            }  $scope.busy=false;  });
    }
});

