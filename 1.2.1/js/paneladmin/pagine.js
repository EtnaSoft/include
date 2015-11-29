var app = angular.module('app');

app.controller('AdminPage', function($rootScope, $scope,$timeout, $http/*,ServiceUpload*/,ADMIN) {
    //$scope.upload= new ServiceUpload();
    $scope.postData={
      ip:'',
      idUser:''
    };

    $scope.list={};
    $scope.listView={};

    $scope.getList = function(){
       $http({method: "POST", url: urlJSON+"paneladmin/menu-list.php",data: $scope.postData , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){ $scope.listView=response;   }  });
    }


    $scope.save = function (){
            $scope.postData.data=$scope.listView.data;
            $rootScope.msgPopup.close();
            if($scope.busy==true){ return }
            if(!confirm("Continuare?")){ return }
            if(ADMIN.test){ console.log("Sto inviando: ");console.log($scope.postData); }
            $scope.busy=true;
            $scope.url=urlFUNCTION+"paneladmin/controller.php?action=savePage";
            $http({ method:"POST", url:$scope.url, data: $scope.postData, headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).
                     success(function(response) {
                          if(response.error!=0){
                            $('#msgPopup').addClass('show');
                            $('#msgPopup').addClass('del');
                            $('#msgPopup').html('Nessuna risposta dal server'); $scope.busy=false;
                          }
                          if(response.goToUrl=="closeDialog"){
                                $rootScope.dialog.close();
                                response.goToUrl="msg";
                          }
                          if(ADMIN.test){
                              console.log("Ho ricevuto: "); console.log(response);
                              $scope.busy=false;
                              if(response.goToUrl=="msg"){
                                  var msg;
                                  $('#msgPopup').addClass('show');
                                  if(response.error==0){ $('#msgPopup').addClass('ok'); msg="Operazione riuscita "; }else{  $('#msgPopup').addClass('del'); msg=response.errorMsg;  }
                                  $('#msgPopup').html(msg);
                              }
                          }else{
                              if(response.goToUrl=="this"){
                                  location.reload();
                              }
                              else if(response.goToUrl=="msg"){
                                  console.log("Ho ricevuto: "); console.log(response);
                                  var msg;
                                  $('#msgPopup').addClass('show');
                                  if(response.error==0){ $('#msgPopup').addClass('ok'); msg="Operazione riuscita "; }else{ msg="Errore";  }
                                  $('#msgPopup').html(msg);
                                  $scope.busy=false;
                              }else{
                                  //window.location.href=response.goToUrl;
                              }
                          }


                    }).
                    error(function(response) {
                          $('#msgPopup').addClass('show');
                          $('#msgPopup').addClass('del');
                          $('#msgPopup').html('Errore dal server, una segnalazione e stata inviata');
                    });

      };

      $scope.getNumber = function(num) {
          num=parseInt(num);
          return new Array(num);
      }


    $scope.getList();
    /*  $scope.$watch('field.files', function (files) {
          $scope.formUpload = false;
          //nel caso la scelta è di un singolo file, carico il file e blocco lo script
          if (files != null) {
            if (!files.length) {
              $timeout(function () {
                $scope.upload.files.push(files);
                $scope.upload.uploadUsingUpload($scope.upload.files[0]);
              });
              return;
            }
            //nel caso invece posso selezionare piu elementi aggiungo alla lista i file e gli carico immediatamente
            for (var i = 0; i < files.length; i++) {
              $scope.upload.errorMsg = null;
              (function (f) {
                if (!f.$error) {
                     $scope.upload.files.push(f);
                     $scope.upload.uploadUsingUpload(f);
                }
              })($scope.field.files[i]);
            }
          }
      });  */

});


