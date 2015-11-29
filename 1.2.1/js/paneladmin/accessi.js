var app = angular.module('app');
app.controller('AdminAccessi', function($rootScope, $scope, $http) {
    var d=new Date();
    var year=d.getFullYear();
    var month=d.getMonth()+1;
    if (month<10){
    month="0" + month;
    };
    var day=d.getDate();
    $scope.date=year + "-" + month + "-" + day;
    $scope.min=year + "-" + month + "-" + day;
    $scope.max=year + "-" + month + "-" + day;

    $scope.postData={
      ip:'',
      idUser:'',
      date: $scope.date
    };

    $scope.list={};
    $scope.listView={};

    $scope.getList = function(){
       $http({method: "POST", url: urlJSON+"paneladmin/accessi-list.php",data: $scope.postData , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){ $scope.list=response;   }  });
    }

    $scope.$watch('postData.ip', function () {
       $http({method: "POST", url: urlJSON+"paneladmin/accessi-view.php",data: $scope.postData , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){  if(response.error==0){ $scope.listView=response;   }  });
    });
    $scope.$watch('postData.date', function () { $scope.list={};
       $http({method: "POST", url: urlJSON+"paneladmin/accessi-list.php",data: $scope.postData , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){  if(response.error==0){ $scope.list=response;   }  });
    });
    $scope.getList();

});
