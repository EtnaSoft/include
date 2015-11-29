 var app = angular.module('app');



app.controller('Messaggi', function($rootScope, $scope,$http,$interval, MessaggiList ) {
  //$scope.init = function(typeSearch,onStartQuery,limitItemList,orderby,type,typeSub,UserId,myLat,myLng,forUser,dateStart,dateEnd,Language){
  $scope.init = function(postValue){
      $scope.postData={ idConversazione:0,nicknameConversazione:"",type:"user",idType:"",testo:"",idUserLogin:$scope.ADMIN.idUser };
      $scope.getNumber = function(num) {
          num=parseInt(num);
          return new Array(num);
      }
      $scope.list = new MessaggiList();
      $scope.busyNewMessage = false;

      $interval( function(){ $scope.viewNewMessage(); }, 5000);
      $scope.viewConversazione = function(id,iduser,nickname) {
          $scope.postData.idType= iduser;
          $scope.postData.nicknameConversazione= nickname;
          $scope.postData.testo= "";
          $scope.postData.idLastMessage= "";
          $scope.postData.idUserSession= $rootScope.idUserSession;
          $scope.postData.idConversazione= id;
      }


      $scope.viewNewMessage = function() {
                  if($scope.postData.idConversazione!=0){
                        $scope.postData.idLastMessage=$scope.list.idLastMessage;
                        $scope.list.request = $http({
                          method: "GET",
                          url: urlJSON+"MessageView.php?idConversazione="+$scope.postData.idConversazione+"&idUserLogin="+$scope.postData.idUserSession+"&idLastMessage="+$scope.list.idLastMessage,
                          isArray: true,
                        });

                        var promise = $scope.list.request
                        .success(function(response) {
                            if(response.count!=0){
                                data=response.data;
                                for (var i = 0; i < data.length; i++) {
                                    $scope.list.items.push(data[i]);
                                    $scope.list.idLastMessage=data[i].id;
                                  }
                            }
                            $scope.busyNewMessage = false;
                        })
                        .error(function(response) {
                                  $scope.busyNewMessage = false;
                        });

                  }
      }


      $scope.sentMessage = function (){
            if($scope.busyNewMessage==true){ return }
            if($scope.list.busy==true){ return }
            //if(!confirm("Vuoi inviare il messaggio?")){ return; }
            $scope.busyNewMessage = true;
            //if(ADMIN.test){ console.log("Sto inviando: "); console.log( $scope.postData); }
            $http({ method:"POST", url:urlFUNCTION+"sentMessage.php", data: $scope.postData, headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).
                     success(function(response) {
                        $scope.postData.testo="";
                        $scope.viewNewMessage();
                    });

      };


      $scope.$watch('postData.idConversazione', function() {
            if($scope.postData.idConversazione!=0){  $scope.list.nextPage(0,urlJSON+"MessageView.php?idConversazione="+$scope.postData.idConversazione+"&idUserLogin="+$scope.postData.idUserSession+" "); }


      }, true);

  }

});


app.factory('MessaggiList', function($http, $q) {
  position=0;
  var deferredAbort  = $q.defer();

  this.url="";
  var MessaggiList = function() {
    this.items=[];
    this.idLastMessage = false;
    this.busy = false;
    this.request = null;
    this.nextpage = false;
    this.after = position;
  };

  MessaggiList.prototype.nextPage = function(start,url) {
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
            this.idLastMessage=data[i].id;
          }
          this.after = position=(position)+(data.length);
          if(response.nextPage=="1" || response.nextPage==1){  this.nextpage = true;  }else{ this.nextpage = false;  }
          //alloggi=data.infoAlloggio; alert(alloggi);
          this.busy = false;
         // $("#viewConversazione").animate({ scrollTop: $('#viewConversazione').height()});
        }.bind(this));

  };


  return MessaggiList;
});
