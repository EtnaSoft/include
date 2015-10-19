var app = angular.module('app');
//dichiaro il controller che gestisce la lista degli utenti
app.controller('Translation', function( $rootScope,$scope, $http) {
  $scope.init = function(table,id,col){
      $scope.lanView = "en";
      $scope.postData = {
        table:table,
        id:id,
        col:col,
        translation:{}
      };

      //recupero le traduzione per il campo richiesto
      $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=getTranslation", data: $scope.postData ,isArray: true })
        .success(function(response){
          $scope.postData.translation = response.data;
      })
      .error(function(){
         //alert("errore");
      });

      //cambio la visualizzazione della lingua, visto che da html non me lo faceva cambiare
      $scope.changeViewLanguage = function(lan) {
          $scope.lanView = lan;
      }

      //salvo le traduzioni, per il campo richiesto
      $scope.saveTranslation = function() {
            $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=saveTranslation", data: $scope.postData ,isArray: true })
                .success(function(response) {
                      $rootScope.readResponse(response);
                })
                .error(function(response) {
                      $rootScope.msgPopup(false,'Errore dal server, una segnalazione e stata inviata');
                });
      }
  }
});