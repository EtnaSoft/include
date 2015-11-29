var app = angular.module('app');
app.controller('AdminCosaVedere', function($rootScope, $scope, $http, ListAdmin, ADMIN) {
    $scope.postData={
      view:null,
      data:null
    };
    $scope.list = new ListAdmin();
    $scope.busy=false;

    $scope.$watch('postData.typeView', function () {
        $scope.list.items=[];
        $scope.list.nextPage(0,$scope.postData);
    });

    $scope.typeView={}
    $scope.dataType={}
    $scope.getType = function(position,permiss,value){
        $http({method: "POST", url: urlFUNCTION+"paneladmin/controller.php?action=getTypeCosaVedere",data:null , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .success(function(response){ if(response.error==0){
                $scope.typeView=response.data; $scope.postData.data=response.dataType; console.log(response.data);
            }  $scope.busy=false;  });
    }
    $scope.getType();
    $scope.checked = function(url){
            if(angular.isDefined($scope.postData.view.associate[url])){
               $scope.postData.data[url].value=$scope.postData.view.associate[url];
                alert($scope.postData.view.associate[url]+" - "+$scope.postData.data[url].url);
            }
    }



    $scope.elimina = function(position){
        if(!confirm("Confermi?")){ return }
        $http({ method: "POST", url: urlFUNCTION+"delete.php" ,data: $.param({id: $scope.list.items[position].id, type: $scope.postData.typeView}) , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
          .success(function(response){   $scope.list.items.splice(position, 1);
             if(response.error==0){
             }else{

             }
         })
        .error(function(){

        });
    }




    $scope.submitData = function (){
            $('#msgPopup').removeClass('show');
            $('#msgPopup').removeClass('del');
            $('#msgPopup').removeClass('ok');
            if($scope.busy==true){ return }
            if(!confirm("Continuare?")){ return }
            if(ADMIN.test){ console.log("Sto inviando: ");console.log($scope.postData); }
            $scope.busy=true;
            $scope.url=urlFUNCTION+"paneladmin/controller.php?action=saveCosaVedere";
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
                                  window.location.href=response.goToUrl;
                              }
                          }


                    }).
                    error(function(response) {
                          $('#msgPopup').addClass('show');
                          $('#msgPopup').addClass('del');
                          $('#msgPopup').html('Errore dal server, una segnalazione e stata inviata');
                    });

      };


});


