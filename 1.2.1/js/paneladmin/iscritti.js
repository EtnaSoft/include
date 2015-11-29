var app = angular.module('app');

app.controller('AdminIscritti', function($rootScope, $scope, $http, ListAdmin) {
    $scope.postData={
      ip:'',
      limit:30,
      onStartQuery:0,
      orderBy:'lastupdate',
      urlPost:'paneladmin/iscritti-list.php'
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
        $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=chPermiss",data:data , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){
                if(permiss=="risorsa"){ $scope.list.items[position].privilegi.risorsa = response.newValue; }
                if(permiss=="foto"){ $scope.list.items[position].privilegi.foto = response.newValue; }
                if(permiss=="evento"){ $scope.list.items[position].privilegi.evento = response.newValue; }
                if(permiss=="contenuto"){ $scope.list.items[position].privilegi.contenuto = response.newValue; }
                if(permiss=="commerciale"){ $scope.list.items[position].privilegi.commerciale = response.newValue; }
                if(permiss=="traduttore"){ $scope.list.items[position].privilegi.traduttore = response.newValue; }
                if(permiss=="amministratore"){ $scope.list.items[position].privilegi.amministratore = response.newValue; }
                if(permiss=="accesso"){ $scope.list.items[position].privilegi.accesso = response.newValue; }

            }  $scope.busy=false;  });
    }
});