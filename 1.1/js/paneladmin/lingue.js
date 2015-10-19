var app = angular.module('app');



app.controller('AdminLingue', function($rootScope, $scope, $http, ADMIN) {

    $scope.postData={
      ip:'',
      idUser:'',
      Language: "it"
    };

    $scope.busy=false;
    $scope.saveBusy=false;
    $scope.list={};
    $scope.listView={};

    $scope.getList = function(){ $scope.busy=true;
       $http({method: "POST", url: urlJSON+"language.php",data: $scope.postData , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){ $scope.list=response;   } $scope.busy=false;  });
    }

    $scope.$watch('postData.ip', function () { $scope.busy=true;
       $http({method: "POST", url: urlJSON+"language.php",data: $scope.postData , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){  if(response.error==0){ $scope.listView=response;   } $scope.busy=false;  });
    });

    $scope.$watch('postData.Language', function () {$scope.busy=true;     $scope.list={};
       $http({method: "POST", url: urlJSON+"language.php",data: $scope.postData , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){  if(response.error==0){ $scope.list=response;   } $scope.busy=false;  });
    });



    $scope.save = function (){
            $scope.postData.data=$scope.list;
            $('#msgPopup').removeClass('show');
            $('#msgPopup').removeClass('del');
            $('#msgPopup').removeClass('ok');
            if($scope.saveBusy==true){ return }
            if(!confirm("Continuare?")){ return }
            if(ADMIN.test){ console.log("Sto inviando: ");console.log($scope.postData); }
            $scope.saveBusy=true;
            $scope.url=urlFUNCTION+"paneladmin/controller.php?action=saveLanguage";
            $http({ method:"POST", url:$scope.url, data: $scope.postData, headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).
                     success(function(response) {
                          if(response.error!=0){
                            $('#msgPopup').addClass('show');
                            $('#msgPopup').addClass('del');
                            $('#msgPopup').html('Nessuna risposta dal server');
                          }
                          if(response.goToUrl=="closeDialog"){
                                $rootScope.dialog.close();
                                response.goToUrl="msg";
                          }
                          if(ADMIN.test){
                              console.log("Ho ricevuto: "); console.log(response);
                              $scope.saveBusy=false;
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
                                  $scope.saveBusy=false;
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


    $scope.getList();

});