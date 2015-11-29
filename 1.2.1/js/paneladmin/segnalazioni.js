var app = angular.module('app');
app.controller('AdminSegnalazioni', function($rootScope, $scope, $http, ListAdmin) {
    $scope.postData={
      ip:'',
      limit:30,
      onStartQuery:0,
      orderBy:'new',
      urlPost:'paneladmin/segnalazioni-list.php'
    };
    $scope.list = new ListAdmin();
    $scope.busy=false;

    $scope.$watch('postData.orderBy', function () {
        $scope.list.items=[];
        $scope.list.nextPage(0,$scope.postData);
    });
});
