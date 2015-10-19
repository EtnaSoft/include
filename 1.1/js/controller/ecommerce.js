var app = angular.module('app');

app.service('eCommerce', function($rootScope, $http, $q, $timeout ) {
  var eCommerce = function() {
    this.busyUpdate = false;
    this.busyTruncate = false;
    this.cart = {
      idCart : null,
      total : 0,
      item : this.getCart()
    };
    this.ordini = [];
  };
  eCommerce.prototype.getCart = function() {
    var self = this;
    $http({ method:"POST", url:urlFUNCTIONV+"/carrello/controller.php?action=getCart", data: $rootScope.session, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                    .success(function(response) {
                          self.cart.idCart = response.idCart;
                          self.cart.item = response.data;
                          self.cart.total = response.total;
                    })
  };
  eCommerce.prototype.getOrdini = function() {
    var self = this;
    $http({ method:"POST", url:urlFUNCTIONV+"/carrello/controller.php?action=getCart", data: $rootScope.session, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                    .success(function(response) {
                          self.cart.idCart = response.idCart;
                          self.cart.item = response.data;
                          self.cart.total = response.total;
                    })
  };
  eCommerce.prototype.getOrdini = function() {
    $http({ method:"POST", url:urlFUNCTIONV+"/carrello/controller.php?action=getOrdini", data: $rootScope.session, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                    .success(function(response) {
                          return response.data;
                    })

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

                  $rootScope.HTTP('POST',urlFUNCTIONV+"paneladmin/controller.php?action=savePagamenti",$scope.dataPagamenti)
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




