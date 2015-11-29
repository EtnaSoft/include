var app = angular.module('app');

app.controller('Register', function($rootScope, $scope, $http) {
    $scope.fieldLogin={
      username:'',
      password:''
    };
    $scope.fieldReg={
      name:'',
      surname:'',
      email:'',
      password:'',
      passwordrip:''
    };
    $scope.fieldLostPassword={
      email:''
    };
    $scope.ngInclude="view/page/register-login.php";

    $scope.change = function(url){
      $scope.ngInclude=url;
    };
    $scope.busy=false;
    $scope.PostLogin = function(){
            $scope.busy=true;
            $http({ method:"POST", url:urlFUNCTIONV+"login.php", data: $scope.fieldLogin, headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).
             success(function(response) {
                  if(response.error==0){
                        $rootScope.readResponse(response);
                  }else{
                        $rootScope.msgPopup.open(false,response.errorMsg);
                        $scope.busy=false;
                  }
            }).
            error(function(response) {
                  $rootScope.msgPopup.open(false,'Errore dal server, una segnalazione e stata inviata');

            });
    };
    $scope.postRegister = function(){
            if(!confirm("Confermi?")){ return }
            $scope.busy=true;
            $http({ method:"POST", url:urlFUNCTIONV+"register.php", data: $scope.fieldReg, headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).
             success(function(response) {
                  if(response.error==0){
                        $rootScope.readResponse(response);
                  }else{
                        $rootScope.msgPopup.open(false,response.errorMsg);
                        $scope.busy=false;
                  }
            }).
            error(function(response) {
                  $rootScope.msgPopup.open(false,'Errore dal server, una segnalazione e stata inviata');
                  $scope.busy=false;
            });
    };

});




app.controller('Discovery2',  function( $rootScope, $scope,$http,$timeout, $filter, DiscoveryList,ServiceUpload,ADMIN, Maps) {
  //$scope.init = function(typeSearch,onStartQuery,limitItemList,orderby,type,typeSub,UserId,myLat,myLng,forUser,dateStart,dateEnd,Language){
  $scope.init = function(postValue){
      $scope.upload= new ServiceUpload();
      $scope.upload.type = postValue.typeSearch;
      $scope.postData=postValue;
      $scope.postData.posMap="";
      $scope.postData.nearComune=false;
      $scope.postData.Language=$rootScope.session.language;
      $scope.postData.typeName="";
      $scope.postData.filter = {};

      //var checkin=$rootScope.session.booking.checkin;
      //var checkout=$rootScope.session.booking.checkout;
      $scope.postData.session=$rootScope.session;
      $scope.list = new DiscoveryList();
      //$scope.New = new New();
      $scope.listType = null;

      $scope.$watch('infoPagina.q', function (files) {
        if($rootScope.infoPagina.q){
              if($rootScope.infoPagina.q.length>2){
                $scope.postData.filter.q=$rootScope.infoPagina.q;
              }else{
                $scope.postData.filter.q="";
              }
        }
      });



      if(ADMIN.test){  console.log("Parametri: ");console.log(postValue); }

      $scope.$watch('field.files', function (files) {
          $scope.formUpload = false;
          //nel caso la scelta è di un singolo file, carico il file e blocco lo script
          if (files != null) {
            if (!files.length) {
              $timeout(function () {
                $scope.upload.files.push(files);
                $scope.list.items.unshift(files);
                $scope.upload.uploadUsingUpload(files);
              });
              return;
            }
            //nel caso invece posso selezionare piu elementi aggiungo alla lista i file e gli carico immediatamente
            for (var i = 0; i < files.length; i++) {
              $scope.upload.errorMsg = null;
              (function (f) {
                if (!f.$error) {
                     $scope.list.items.unshift(f);
                     $scope.upload.files.push(f);
                     $scope.upload.uploadUsingUpload(f);
                }
              })($scope.field.files[i]);
            }
          }
      });


      //$scope.gMaps= new Maps();

      $scope.$watch('list.maps.view', function () {
                  if(($scope.list.maps.map==null && $scope.list.maps.view) || ($scope.list.maps.map!=null && $scope.list.maps.view)){
                        $timeout( function(){
                            $scope.list.maps.initialize("maps");
                            for(i=0; i<$scope.list.items.length ; i++){
                                 //console.log($scope.list.items[i]);
                                 $scope.list.maps.addMarker($scope.list.items[i].location);
                            }
                            $scope.list.maps.centerBounds();

                        }, 100);
                  }
      });

      /*$scope.$watch('gMaps.view', function () {
                  if($scope.gMaps.map==null && $scope.gMaps.view){
                        $timeout( function(){
                            $scope.gMaps.initialize("maps");
                            for(i=0; $scope.list.items.length ; i++){
                                 $scope.gMaps.addMarker($scope.list.items[i]);
                            }
                            $scope.gMaps.centerBounds();

                        }, 500);
                  }else{
                        $scope.gMaps.centerBounds();
                  }
      });*/


      $scope.$watch('upload.files', function (files) {

      });

      $scope.getNumber = function(num) {
          num=parseInt(num);
          if(num>0){
            return new Array(num);
          }else{
            return null;
          }
      }

      $scope.getListType = function() {
            $http({method: "POST", url: urlJSON+"ListType.php", data: {typeCurr:$scope.postData.typeSearch,session:$rootScope.session} ,isArray: true })
              .success(function(response){
                 $scope.listType = response;
             })
            .error(function(){
               //alert("errore");
            });
      }

      $scope.likeIt = function(cosa,position) {

            $('#msgPopup').removeClass('show');
            $('#msgPopup').removeClass('del');
            $('#msgPopup').removeClass('ok');
            if(!$rootScope.Function.checkSession()){ $rootScope.dialog.open(null,'view','login','',''); return }
            if($scope.list.busyLike){ return }

            var field= {
              cosa:cosa,
              typeCosa:$scope.list.items[position].type,
              idCosa:$scope.list.items[position].id,
              UserId:$rootScope.idUserSession
            }
            $scope.list.busyLike=true;
            $http({
                method: "POST",
                url:urlFUNCTIONV+"likeIt.php",
                data: field,
                isArray: true
            }).success(function(response){
                 //console.log(field);
                 if(cosa=="voglio"){
                        $scope.list.items[position].interactionUser.iWontHere=response.result; $scope.list.items[position].interaction.wontHere=response.numLike;
                 }
                 if(cosa=="statoqui"){
                        $scope.list.items[position].interactionUser.iBeenHere=response.result; $scope.list.items[position].interaction.beenHere=response.numLike;
                 }
                 if(response.result){
                    $('#msgPopup').addClass('show');
                    $('#msgPopup').addClass('ok');
                    $('#msgPopup').html($scope.list.items[position].nome+'<br>Aggiunto alla lista');
                 }else{
                    //$('#msgPopup').html('Rimosso dalla lista');
                 }

                 //this.list.items[position].likePhoto=response.result;
                 $scope.list.busyLike=false;
             })
            .error(function(){
               //alert("errore");
            });
      }

      $scope.$watch('[postData.where.id,postData.where.type,postData.filter, postData.data, postData.typeSub, postData.type, postData.typeSearch, postData.orderBy]', function() {
              $scope.list.nextPage(0,$scope.postData);
      }, true);

      $scope.preview = function(position) {
            $rootScope.photoView.open($scope.postData.where.type,$scope.postData.where.id,position);
      };
      $scope.pushAlloggio = function(alloggio,variante){
            var foundItem = $filter('filter')( $scope.list.items, { id: alloggio.id  }, true)[0];
            var index = $scope.list.items.indexOf( foundItem );
            if(index>=0){
                //alert(index); console.log(foundItem);
                if($scope.list.items[index].infoAlloggio.disponibility.disponibile>0){
                      $rootScope.infoPage.bookNow.data.push(
                      { idAlloggio:alloggio.id,
                      idVariante:variante.id,
                      name:alloggio.nome,
                      posti:variante.posti,
                      price:variante.price.current,
                      priceFormat:variante.price.currentFormat,
                      nameVariante:variante.name });
                      $scope.list.items[index].infoAlloggio.disponibility.disponibileCurr-=1;
                }
                ////total += $rootScope.infoPage.bookNow.data[i].price;
            }
      }

      $scope.removeAlloggio = function(idalloggio,indexs){

            var foundItem = $filter('filter')( $scope.list.items, { id: idalloggio  }, true)[0];
            var index = $scope.list.items.indexOf( foundItem );
            if(index>=0){
                //alert(index); console.log(foundItem);
                //if($scope.list.items[index].infoAlloggio.disponibility.disponibile>0){
                      $rootScope.infoPage.bookNow.data.splice( indexs, 1 );
                      $scope.list.items[index].infoAlloggio.disponibility.disponibileCurr+=1;
                //}
                ////total += $rootScope.infoPage.bookNow.data[i].price;
            }
      }




      //salvo le date del booking
      $scope.saveDateBooking = function(){
          $http({method: "POST", url:urlFUNCTIONV+"saveDate.php",data:$rootScope.session.booking, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
          .success(function(response){
                 $scope.list.nextPage(0,$scope.postData);
                 $rootScope.infoPage.bookNow.checkin=$scope.postData.session.booking.checkin;
                 $rootScope.infoPage.bookNow.checkout=$scope.postData.session.booking.checkout;
                 $rootScope.infoPage.bookNow.data=[];
          });
      }

      //salvo le date del booking
      $scope.confirmBooking = function(field){

          if(!$rootScope.infoPage.bookNow.confirm){
                $rootScope.infoPage.bookNow.confirm=1;
          }else{
                if(confirm("Vuoi confermare la prenotazione?")){
                      $rootScope.infoPage.bookNow.busy=true;
                      $http({method: "POST", url:urlFUNCTION+"new/prenotazione.php",data:field, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                      .success(function(response){
                        if(response.error==0){ $rootScope.infoPage.bookNow.confirm=2; }
                        $rootScope.infoPage.bookNow.busy=false;
                      });
                }
          }
      }


      /*$scope.$watch('postData.session.booking.checkin', function() {
              $scope.list.nextPage(0,$scope.postData);
      }, true); */

  }

});
app.factory('DiscoveryList', function($rootScope, $http, $q, ADMIN, Maps) {
  var deferredAbort  = $q.defer();

  this.postData="";
  var DiscoveryList = function() {
    this.items=[];
    this.busy = false;
    this.page = 0;
    this.busyLike = false;
    this.nextpage = false;
    this.after = 0;
    this.stopComune = false;
    this.fixedComune = true;
    this.position = 0;
    this.maps= new Maps();

 };
  DiscoveryList.prototype.cercaQui = function() {
    this.maps.setBounds();
    this.postData.posMap=this.maps.posMap;
    this.nextPage(0,this.postData);
  }

  DiscoveryList.prototype.nextPage = function(start,postData) {
        //se lo stato è in caricamento..
        if (this.busy && start!=2){  return; }

        var request = null;
        var self = this;
        //imposto busy su true
        this.busy = true;    //this.postData=postData;
        //se parto dalla posizione 0, azzero tutti i valori
        if(start==0){ this.maps.clearMarker(); this.items=[];  this.position=0; postData.nearComune=false; this.page=0; this.after=0; this.postData=postData; }
        if(ADMIN.test){  console.log("url: ");console.log(this.postData+"&onStartQuery="+this.after); }
        request = $http({
          method: "POST",
          url: urlJSON+"Discovery.php?onStartQuery="+this.after,
          data: this.postData,
          isArray: true
        });
        request.success(function(response) {
          if(angular.isArray(response.data)){
                this.busy = false;
                data=response.data;
                for (var i = 0; i < data.length; i++) {
                    this.items.push(data[i]);
                    if(self.maps.map!=null){
                      self.maps.addMarker(data[i].location);
                    }
                }
                this.page++;
                if(self.maps.map!=null && self.position==0){
                    self.maps.centerBounds();
                }

                this.after = this.position = (this.position)+(data.length);    this.busy = false;
                if(response.nextPage=="1" || response.nextPage==1){  this.nextpage = true;  }else{ this.nextpage = false;  if(angular.isDefined(this.postData.where)){  if(this.postData.where.id){ this.stopComune=true;  }  } }
          }else if(angular.isDefined(this.postData.where)){
                if(angular.isDefined(this.postData.where)){
                    this.stopComune=true;   this.busy = false;
                    //this.postData.nearComune=true;
                    //if(this.postData.typeSearch!="eventi"){ this.postData.orderBy="distance"; }
                    //this.nextPage(2,this.postData);
                } }
          this.busy = false;
        }.bind(this));



  };

  DiscoveryList.prototype.getListType = function(type) {
            var res = null;
            $http({method: "POST", url: urlJSON+"ListType.php", data: {typeCurr:type,session:$rootScope.session} ,isArray: true })
              .success(function(response){
                 res = response.data;
             })
            .error(function(){
               ////alert("errore");
            });
            return res;
  }



  DiscoveryList.prototype.addToCart = function(position,orderBy) {
        if(!this.busyLike){
            //this.likeItSave(1,0);
            $('#addToCart'+orderBy+""+position).addClass('loading');
            $('#windows').addClass('loading');

            //var dataPost = { idProdotto: this.items[position].id };
            $http({ method: "POST", url: urlFUNCTION+"carrello/addCart.php" ,data: $.param({idProdotto: this.items[position].id}) , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
              .success(function(response){
                 //likeItNow=response[0].result;
                 $('#addToCart'+orderBy+""+position).removeClass('loading');
                 $('#maschera').addClass('show');
                 $('#windows').removeClass('loading');
                 $('#windows').addClass('show');
                 $('#windows').html(response.html);
                 //PhotoList.items[position].likePhoto=likeItNow;
                 //PhotoList.prototype.likeItSave(likeItNow,position);
             })
            .error(function(){
                 $('#maschera').addClass('show');
                 $('#windows').addClass('loading');
                 $('#addToCart'+orderBy+""+position).removeClass('loading');
               ////alert("errore");
            });
        }
  };
  DiscoveryList.prototype.chooseImage = function(position) {
        showDialog();
        $http({ method: "POST", url: "view/dialog/chooseImage.php" ,data: $.param({id: this.items[position].id, type: this.items[position].type}) , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
          .success(function(response){
                $('#windows').removeClass('loading');
                $('#windows').addClass('show');
                $('#windows').html(response);
         })
        .error(function(){
             $('#windows').removeClass('loading');
             $('#windows').addClass('show');
             $('#windows').html('show');
             ////alert("errore");
        });
  };


  DiscoveryList.prototype.Delete = function(position) {
        var self = this;
        if(!confirm("Confermi?")){ return }
        $http({ method:"POST", url:urlFUNCTIONV+"delete.php", data: {idType: this.items[position].id, type: this.items[position].type}, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
          .success(function(response){
             if(response.error==0){
                self.items.splice(position, 1);
             }else{
                /*$('#windows').removeClass('loading');
                $('#windows').addClass('show');
                $('#windows').html(response.html);  */
             }
         })
        .error(function(){
             /* $('#windows').removeClass('loading');
             $('#windows').addClass('show');
             $('#windows').html('show'); */
             ////alert("errore");
        });
  };
  return DiscoveryList;
});





