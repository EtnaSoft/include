var app = angular.module('app');

app.service('payNow', function($rootScope, $http, $q, $timeout ) {
  var payNow = function() {
    this.busy = false;
  };
  payNow.prototype.pay = function(field) {
              var dataPost = field;
              var self = this;
              this.busy=true;
              $http({ method: "POST",url: urlFUNCTIONV+"/payNow.php", headers: {'Content-Type': 'application/x-www-form-urlencoded'} , data:dataPost })
                .success(function (response, status, headers, config) {
                      console.log(response);
                      if(dataPost.pagamento=="paypal" || dataPost.pagamento=="contrassegno"){
                          window.location.href=response.goToUrl;
                      }else{
                          $rootScope.dialog.open(response.data,'view','payment','','');
                          self.busy=false;
                      }
              })
  }
  return payNow;
});

app.service('eCommerce', function($rootScope, $http, $q, $timeout,$window ) {
  var eCommerce = function() {
    this.busyUpdate = false;
    this.busyTruncate = false;
    this.cart = {
      idCart : null,
      total : 0,
      item : this.getCart()
    };
    this.ordini = {
      total : 0,
      field : {},
      list : []
    };
  };
  eCommerce.prototype.getCart = function() {
    var self = this;
    $http({ method:"POST", url:urlFUNCTIONV+"/carrello/controller.php?action=getCart", data: $rootScope.session, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                    .success(function(response) {
                          self.cart.idCart = response.idCart;
                          self.cart.item = response.data;
                          self.cart.total = response.total;
                          self.ordini.list = response.dataOrdini;
                    })
  };

  eCommerce.prototype.getOrdini = function(idSearch) {
    var data = {
       session: $rootScope.session,
       idSearch: idSearch
    }
    return $http({ method:"POST", url:urlJSON+"/ecommerce/ordini.php", data: data, headers: {'Content-Type': 'application/x-www-form-urlencoded'} });
  };
  eCommerce.prototype.updateQtn = function() {
    this.busyUpdate=true;
    var self = this;
    $http({ method:"POST", url:urlFUNCTIONV+"/carrello/controller.php?action=updateQtn", data: this.cart, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                    .success(function(response) {
                          self.busyUpdate=false;
                          if(response.error==0){
                            self.getCart();
                            $rootScope.msgPopup.open(true,"Quantità aggiornata");
                            //location.reload();
                          }
                          self.busyUpdate=false;
                    }).error(function(response) {
                        self.busyUpdate=false;
                    })

  };
  eCommerce.prototype.changeStatus = function(data,newStato) {
    if(!confirm("Confermi?")){ return }
    this.busyUpdate=true;
    var self = this;
    data.newStato=newStato;
    $http({ method:"POST", url:urlFUNCTIONV+"/carrello/controller.php?action=changeStatus", data: data, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                    .success(function(response) {
                          //$rootScope.readResponse(response);
                          if(response.error==0){
                            $rootScope.msgPopup.open(true,"Operazione riuscita");
                            //se sto annullando l'ordine imposto annullato su true, altrimento cambio lo stato dell'ordine
                            if(data.newStato==0){
                                data.annullato = true;
                            }else{
                                data.annullato = false;
                                data.stato=data.newStato;
                            }
                          }else{
                            $rootScope.msgPopup.open(false,"Impossibile completare l'operazione");
                          }
                          self.busyUpdate=false;
                    }).error(function(response) {
                        self.busyUpdate=false;
                    })

  };
  eCommerce.prototype.addItem = function(id,qtn) {
        var self = this;
        post = {
          session : $rootScope.session,
          idCart : this.cart.idCart,
          item : {
            id : id,
            qtn : qtn
          }
        }

        $http({ method:"POST", url:urlFUNCTIONV+"/carrello/controller.php?action=addItem", data: post, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                        .success(function(response) {
                              self.getCart();
                              if(response.error==0){
                                $rootScope.msgPopup.open(true,"Prodotto inserito nel tuo carrello");
                              }else{
                                $rootScope.msgPopup.open(false,"Hai superato la quantità massima disponibile per questo prodotto");
                              }
                        })
  };
  eCommerce.prototype.delItem = function(id) {
        if(id=="truncate"){ if(!confirm('Svuotare carrello?')){ return } }else{ if(!confirm('Eliminare prodotto dal carrello?')){ return } }
        this.busyTruncate=true;
        var self = this;
        post = {
          session : $rootScope.session,
          idCart : this.cart.idCart,
          item : {
            id : id
          }
        }

        $http({ method:"POST", url:urlFUNCTIONV+"/carrello/controller.php?action=delItem", data: post, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                        .success(function(response) {
                              this.busyTruncate=false;
                              self.getCart();
                        })
                        .error(function(response) {
                            this.busyTruncate=false;
                        })

  };




  /************* CHECKOUT ***************/

  eCommerce.prototype.initializeCheckOut = function (idAttivita){
        var self = this;
        this.ordini.field.idAttivita=idAttivita;
        this.ordini.field.costoProdotti=0;
        this.ordini.field.costoTrasporto=0;
        this.ordini.field.costoTotale=0;
        this.ordini.field.idTrasporto=0;

        this.ordini.field.session=$rootScope.session;

        this.ordini.field.item=this.getItemCheckOut();
        this.ordini.trasporti=[];

        //recuper la lista dei trasporti disponibile per il carrello X del fornitore Y ( l'id carrello lo ricavo all'interno dei file .php )
        this.getTrasportiCheckOut('carrello',idAttivita).success(function(response){
              data=response.trasporti; console.log(data);
              for (var i = 0; i < data.length; i++) {
                 self.ordini.trasporti.push(data[i]);
              }
        });
  }

  //recupero la liste dei prodotti per il checkout
  eCommerce.prototype.getItemCheckOut = function (){
    var self = this;
    var post = {
        session:$rootScope.session,
        idAttivita:this.ordini.field.idAttivita
    }
    $http({ method:"POST", url:urlFUNCTIONV+"/carrello/controller.php?action=getCart", data: post, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
        .success(function(response) {
            self.ordini.field.item = response.data;
            self.ordini.field.total = self.ordini.field.costoProdotti = response.total;
        })
  }


  //recupero la lista dei trasporti disponibili
  eCommerce.prototype.getTrasportiCheckOut = function (type,id){
    return $http({method: "POST", url:urlJSON+"/ecommerce/trasporti.php",data: $.param({type: type, idtype: id }) , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
  }


  $rootScope.$watch('eCommerce.ordini.field.spedizione.ritiro.value', function() {
            $rootScope.eCommerce.ordini.field.costoTotale = parseFloat($rootScope.eCommerce.ordini.field.costoProdotti) ;
            $rootScope.eCommerce.ordini.field.costoTotale = $rootScope.eCommerce.ordini.field.costoTotale.toFixed(2);
            $rootScope.eCommerce.ordini.field.trasporto = {};
            //$rootScope.eCommerce.ordini.field.costoTrasporto = 0;
            //if(angular.isDefined($rootScope.eCommerce.ordini.field.spedizione.nazione)){ $rootScope.eCommerce.ordini.field.spedizione.nazione = ""; }
  }, true);
  $rootScope.$watch('eCommerce.ordini.field.trasporto.priceTot', function() {
        $rootScope.eCommerce.ordini.field.costoTotale = parseFloat($rootScope.eCommerce.ordini.field.costoProdotti) + parseFloat($rootScope.eCommerce.ordini.field.trasporto.priceTot);
        $rootScope.eCommerce.ordini.field.costoTotale = $rootScope.eCommerce.ordini.field.costoTotale.toFixed(2);
  }, true);
  $rootScope.$watch('[eCommerce.ordini.field.spedizione.nazione,eCommerce.ordini.field.tipoSpedizione]', function() {
        $rootScope.eCommerce.ordini.field.trasporto = {};
        if($rootScope.eCommerce.ordini.field.tipoSpedizione=="domicilio"){
            $rootScope.eCommerce.ordini.field.trasporto = $rootScope.eCommerce.ordini.trasporti[0].servizi.domicilio.data;

        }
        //$rootScope.eCommerce.ordini.field.costoTrasporto = 0;
  }, true);
  $rootScope.$watch('[eCommerce.ordini.field.spedizione.stassoIndirizzo, eCommerce.ordini.field.spedizione.regione,eCommerce.ordini.field.spedizione.citta,eCommerce.ordini.field.spedizione.indirizzo,eCommerce.ordini.field.fatturazione.regione,eCommerce.ordini.field.fatturazione.citta,eCommerce.ordini.field.fatturazione.indirizzo]', function() {
        delete $rootScope.eCommerce.checkDomicilio;
  }, true);



  eCommerce.prototype.checkDistanceDomicilio = function (){
        this.checkDomicilio = {
          busy:true
        };
        var self = this;
        var origin = $rootScope.eCommerce.ordini.field.addressAttivita;



        if($rootScope.eCommerce.ordini.field.spedizione.stassoIndirizzo){
            var destination = $rootScope.eCommerce.ordini.field.fatturazione.indirizzo+", "+$rootScope.eCommerce.ordini.field.fatturazione.citta+", "+$rootScope.eCommerce.ordini.field.fatturazione.regione+", "+$rootScope.eCommerce.ordini.field.fatturazione.nazione;
        }else{
            var destination = $rootScope.eCommerce.ordini.field.spedizione.indirizzo+", "+$rootScope.eCommerce.ordini.field.spedizione.citta+", "+$rootScope.eCommerce.ordini.field.spedizione.regione+", "+$rootScope.eCommerce.ordini.field.spedizione.nazione;
        }

        var directionsService = new google.maps.DirectionsService();
         var request = {
              origin:origin,
              destination:destination,
              travelMode: google.maps.TravelMode.DRIVING
          };
          directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              //self.checkDomicilio = response;
              //self.checkIndirizzo = response;
              if(($rootScope.eCommerce.ordini.trasporti[0].servizi.domicilio.raggio*1000)-response.routes[0].legs[0].distance.value>0){
                self.checkDomicilio.value=true;
              }else{
                self.checkDomicilio.value=false;
              }
              self.checkDomicilio.distance=response.routes[0].legs[0].distance.text;


            }
            self.checkDomicilio.busy = false;
          });
        /*$http({method: "GET", url:"https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"$key="+keyGoogle })
            .success(function(response){
                self.busyCheckDomicilio=false;
                self.checkDomicilio=true;
            }).error(function(response){
                self.busyCheckDomicilio=false;
            });*/
  }
  //completo l'ordine
  eCommerce.prototype.completaOrdine = function (){
        if(!this.ordini.field.trasporto.id && !this.ordini.field.tipoTrasporto=="corriere"){
          $rootScope.msgPopup.open(false,"Seleziona un trasporto");
          return;
        }
        if(confirm("Vuoi confermare l'ordine?")){
              var self = this;
              this.busyUpdate=true;
              var urlPost=urlFUNCTIONV+"carrello/checkOut.php";
              var postData = {
                session: $rootScope.session,
                data : this.ordini.field
              }
              $http({
                method: "POST",
                url: urlPost,
                data: postData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
              .success(function (data, status, headers, config) {
                      console.log(data);
                      if(data.error==0){
                        if(self.ordini.field.pagamento=="paypal" || self.ordini.field.pagamento=="contrassegno"){
                            //se ho scelto di pagare con paypal, quando inserisco un nuovo ordine, mi faccio ritpornare l'id ( "data.data.id" ) , e reindirzzo alla pagina di paypal
                            var fieldPay= {
                              cosa :'ordine',
                              idCosa : data.data.id,
                              pagamento : self.ordini.field.pagamento
                            }
                            $rootScope.payNow.pay(fieldPay);
                        }else{
                            if($rootScope.addNew){
                                  if(data.goToUrl=="closeDialog"){
                                      location.reload();
                                  }else{
                                      $window.history.back();
                                  }
                              }else{
                                    $rootScope.readResponse(data);
                              }
                            self.busyUpdate=false;
                        }
                      }else{
                            if($rootScope.addNew){
                                  if(data.goToUrl=="closeDialog"){
                                      location.reload();
                                  }else{
                                      $window.history.back();
                                  }
                              }else{
                        $rootScope.readResponse(data);
                              }
                        self.busyUpdate=false;
                      }
              })
              .error(function (data, status, headers, config){
                  alert("error");

              });
        }
  };

  return eCommerce;
});



app.controller('Pagamenti', function($rootScope, $scope, $http) {
    $scope.init = function(idAttivita) {
          $scope.getNumber = function(num) {
              num=parseInt(num);
              return new Array(num);
          }
          $scope.busy=false;

          $scope.dataPagamenti = {
            idAttivita : idAttivita,
            data: []
          }
          $scope.savePagamenti = function (){

                  if(!confirm("Continuare?")){ return false; }
                  if($scope.busy==true){ return }
                  $scope.busy=true;

                  $rootScope.HTTP('POST',urlFUNCTION+"paneladmin/controller.php?action=savePagamenti",$scope.dataPagamenti)
                      .then(function(response){
                          $scope.busy=false;
                      });

          };


          $scope.getPagamenti = function(){
              $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=getPagamenti",data:$scope.dataPagamenti , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                  .success(function(response){ if(response.error==0){
                      $scope.dataPagamenti.data=response.data;
                  }   $scope.busy=false;  });
          }
          $scope.getPagamenti();
    }

});

app.controller('Trasporti', function($rootScope, $scope, $http) {
    $scope.init = function(idAttivita) {
          $scope.getNumber = function(num) {
              num=parseInt(num);
              return new Array(num);
          }
          $scope.busy=false;

          $scope.dataTrasporti = {
            idAttivita : idAttivita,
            data: []
          }
          $scope.saveTrasporti = function (){

                  if(!confirm("Continuare?")){ return false; }
                  if($scope.busy==true){ return }
                  $scope.busy=true;

                  $rootScope.HTTP('POST',urlFUNCTION+"paneladmin/controller.php?action=saveTrasporti",$scope.dataTrasporti)
                      .then(function(response){
                          $scope.busy=false;
                      });

          };

          $scope.getTrasporti = function(){
              $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=getTrasporti",data:$scope.dataTrasporti , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                  .success(function(response){ if(response.error==0){
                      $scope.dataTrasporti.data=response.data;
                  }   $scope.busy=false;  });
          }
          $scope.getTrasporti();
    }


});

app.controller('Pagamento', function( $scope, $http) {
  //$scope.init = function(typeSearch,onStartQuery,limitItemList,orderby,type,typeSub,UserId,myLat,myLng,forUser,dateStart,dateEnd,Language){
  $scope.init = function(idAttivita){
      $scope.postData={
        typeView : 'ChoosePagamenti'
      };
      $scope.list = [];
      $http({method: "POST", url:urlJSON+"/ecommerce/pagamenti.php",data: $.param({idAttivita: idAttivita}) , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
      .success(function(response){
              data=response.pagamenti;
              console.log(data);
              for (var i = 0; i < data.length; i++) {
                 $scope.list.push(data[i]);
              }

              //console.log(response.pagamenti);
              //$scope.list=response.pagamenti;
          })
      .error(function(){
       //alert("errore");
      });
  }

});


app.controller('Prenotazioni', function( $scope, PrenotazioniList) {
  //$scope.init = function(typeSearch,onStartQuery,limitItemList,orderby,type,typeSub,UserId,myLat,myLng,forUser,dateStart,dateEnd,Language){
  $scope.init = function(postValue){
      $scope.postData=postValue;

      $scope.getNumber = function(num) {
          num=parseInt(num);
          return new Array(num);
      }

      $scope.list = new PrenotazioniList();
      $scope.$watch('postData.stato', function() {
              $scope.list.nextPage(0,urlJSON+"booking/prenotazioni.php?idSearch="+$scope.postData.idSearch+"&limitItemList="+$scope.postData.limitItemList+"&idUser="+$scope.postData.idUser+"&idUserLogin="+$scope.postData.idUserLogin+"&idAttivita="+$scope.postData.idAttivita+"&dateDa="+$scope.postData.dateDa+"&dateA="+$scope.postData.dateA+"&stato="+$scope.postData.stato+"&Language="+$scope.postData.Language);
      }, true);
  }

});
app.factory('PrenotazioniList', function($http, $q) {
  position=0;
  var deferredAbort  = $q.defer();

  this.url="";
  var PrenotazioniList = function() {
    this.items=[];
    this.busy = false;
    this.request = null;
    this.nextpage = false;
    this.after = position;
  };

  PrenotazioniList.prototype.nextPage = function(start,url) {
        //se lo stato è in caricamento..
        if (this.busy){  return; }

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


  return PrenotazioniList;
});


app.controller('Ordini', function( $rootScope, $scope, OrdiniList) {
  //$scope.init = function(typeSearch,onStartQuery,limitItemList,orderby,type,typeSub,UserId,myLat,myLng,forUser,dateStart,dateEnd,Language){
  $scope.init = function(postValue){
      $scope.postData=postValue;
      $scope.postData.session=$rootScope.session;

      $scope.getNumber = function(num) {
          num=parseInt(num);
          return new Array(num);
      }

      $scope.list = new OrdiniList();
      $scope.$watch('[postData.stato,postData.filter]', function() {
              $scope.list.nextPage(0,$scope.postData);
      }, true);
  }

});
app.factory('OrdiniList', function($http, $q) {
  position=0;
  var deferredAbort  = $q.defer();

  this.url="";
  var OrdiniList = function() {
    this.items=[];
    this.busy = false;
    this.request = null;
    this.nextpage = false;
    this.after = position;
    this.postData = position;
  };

  OrdiniList.prototype.nextPage = function(start,postData) {
        //se lo stato è in caricamento..
        if (this.busy){  return; }

        //if(this.request!=null){ this.request.abort(); }

        //imposto busy su true
        this.busy = true;
        //se parto dalla posizione 0, azzero tutti i valori
        if(start==0){  this.items=[]; this.postData=postData; this.position=0;  this.page=0; this.after=0;  }

        this.request = $http({
          method: "POST",
          url: urlJSON+"ecommerce/"+this.postData.typeView+".php?onStartQuery="+this.after,
          data: this.postData,
          isArray: true,
          timeout: deferredAbort.promise
        });


        var promise = this.request.success(function(response) {
          data=response.data;
          if(angular.isArray(data)){
                for (var i = 0; i < data.length; i++) {
                  this.items.push(data[i]);
                }
                this.after = position=(position)+(data.length);
                if(response.nextPage=="1" || response.nextPage==1){  this.nextpage = true;  }else{ this.nextpage = false;  }
                //alloggi=data.infoAlloggio; alert(alloggi);
          }
          this.busy = false;
        }.bind(this));

  };

  return OrdiniList;
});









