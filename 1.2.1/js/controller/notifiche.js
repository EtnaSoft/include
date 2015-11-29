var app = angular.module('app');


app.controller('Notifiche', function( $scope, NotificheList) {
  //$scope.init = function(typeSearch,onStartQuery,limitItemList,orderby,type,typeSub,UserId,myLat,myLng,forUser,dateStart,dateEnd,Language){
  $scope.init = function(postValue){
      $scope.postData=postValue;
      //alert(ADMIN.idUser);

      //$scope.list = new NotificheList();

      //$scope.list.nextPage(0,urlJSON+"notifiche.php?userId="+$scope.postData.userId);
  }

});


app.factory('NotificheList', function($http, $q) {
  position=0;
  var deferredAbort  = $q.defer();

  this.url="";
  var NotificheList = function() {
    this.items=[];
    this.busy = false;
    this.request = null;
    this.nextpage = false;
    this.after = position;
  };

  NotificheList.prototype.nextPage = function(start,url) {
        //se lo stato è in caricamento..
        if (this.busy ){  return; }

        //if(this.request!=null){ this.request.abort(); }

        //imposto busy su true
        this.busy = true;
        //se parto dalla posizione 0, azzero tutti i valori
        if(start==0){ this.url=url; position=0; this.after=0; this.items=[]; }

        this.request = $http({
          method: "GET",
          url: this.url+"&onStartQuery="+this.after,
          isArray: true,
          timeout: deferredAbort.promise
        });


        var promise = this.request.success(function(response) {
          data=response.data;
          for (var i = 0; i < data.length; i++) {
            this.items.push(data[i]);
          }
          this.after = position=(position)+(data.length);
          if(response.nextPage=="1" || response.nextPage==1){  this.nextpage = true;  }else{ this.nextpage = false;  }
          //alloggi=data.infoAlloggio; alert(alloggi);
          this.busy = false;
        }.bind(this));

  };


  return NotificheList;
});
