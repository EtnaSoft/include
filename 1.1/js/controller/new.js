var app = angular.module('app');
app.controller('panelControl', function($rootScope, $scope, $window, $http, ADMIN) {
  $scope.init = function(info){
    $scope.info=info;
    console.log(info);
  }
});


app.filter('makeRange', function() {
        return function(input) {
            var lowBound, highBound;
            switch (input.length) {
            case 1:
                lowBound = 0;
                highBound = parseInt(input[0]) - 1;
                break;
            case 2:
                lowBound = parseInt(input[0]);
                highBound = parseInt(input[1]);
                break;
            default:
                return input;
            }
            var result = [];
            for (var i = lowBound; i <= highBound; i++)
                result.push(i);
            return result;
        };
    });


app.controller('addNew', function( $rootScope,$scope,$location,$window, $http, $timeout, ADMIN,Dialog,ServiceUpload) {
  //$scope.init = function(typeSearch,onStartQuery,limitItemList,orderby,type,typeSub,UserId,myLat,myLng,forUser,dateStart,dateEnd,Language){
  $scope.init = function(type,item,whereId){
      $scope.upload= new ServiceUpload();

      $scope.type=type;

      //carico
      if($scope.type=="risorse"){ $scope.type="risorsa"; }
      $scope.layout='view/user/mypages/new/'+$scope.type+'.php';

      $scope.whereId=whereId;
      $scope.listType=[];
      $scope.busy=false;
      $scope.busyInfo=false;
      $scope.field = {};
      if(item){  $scope.field.dataPost = $scope.upload.item = item; }
      $scope.listLocation = null;
      $scope.map=null;
      $scope.markerCenter=null;
      $scope.lat=null;
      $scope.lng=null;
      $scope.getNumber = function(num) {
          num=parseInt(num);
          return new Array(num);
      }
      $scope.$watch('field.files', function (files) {
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
      });



      //cambio la tipologia dell'inserimeto ( solo nel caso del paneladmin ), e quindi ricarico la listea delle tipologie
      $scope.chType = function(url){
            $scope.type=url;
            $scope.getListType();
      }



      $scope.getListType = function() {
            var typeList=$scope.type; if($scope.type=="risorsa"){ typeList="cosavedere"; }
            $http({method: "POST", url: urlJSON+"ListType.php", data: {typeCurr:typeList} ,isArray: true })
              .success(function(response){
                 $scope.listType = response.data;
                 $scope.filter = response.filter;
             })
            .error(function(){
               alert("errore");
            });
      }



      //$scope.field.idUserSession=[];
      $scope.url=urlFUNCTION+"new/"+$scope.type+".php";
      if(type==""){
           $scope.url=$rootScope.addNewUrl;
      }
      else if($scope.type=="saveBooking"){      $scope.url=urlFUNCTION+"panelcontrol/controller.php?action=saveSetting";  }
      else if($scope.type=="saveCalendario"){   $scope.url=urlFUNCTION+"panelcontrol/controller.php?action=saveCalendario";  }
      else if($scope.type=="accessibilita"){    $scope.url=urlFUNCTION+"panelcontrol/controller.php?action=saveAccessibilita";  }
      else if($scope.type=="idealein"){         $scope.url=urlFUNCTION+"panelcontrol/controller.php?action=saveIdealein";  }
      else if($scope.type=="pagamento"){        $scope.url=urlFUNCTION+"panelcontrol/controller.php?action=savePagamenti";  }
      else if($scope.type=="tariffe"){          if(!angular.isArray($scope.field.data)){ $scope.field.data=[]; } if($scope.field.data.length==0 ){ $scope.field.data.push($scope.field.data.length); } $scope.url=urlFUNCTION+"panelcontrol/controller.php?action=saveTariffe";  }
      else if($scope.type=="orario"){           if(!angular.isArray($scope.field.data)){ $scope.field.data=[]; } if($scope.field.data.length==0){  $scope.field.data.push($scope.field.data.length); } $scope.url=urlFUNCTION+"panelcontrol/controller.php?action=saveOrario";  }
      else if($scope.type=="trasporti"){        $scope.field={dataPost:{nazionali:[{idtipotrasporto:0}]}}; $scope.url=urlFUNCTION+"panelcontrol/controller.php?action=saveTrasporti";  }
      else if($scope.type=="alloggi"){          $scope.field={dataPost:{infoAlloggio:{variante:[{id:"",name:""}]}}};  }

      else if($scope.type=="userInfo"){         $scope.url=urlFUNCTION+"usersetting/controller.php?action=saveInfo";  }
      else if($scope.type=="userNotifiche"){    $scope.url=urlFUNCTION+"usersetting/controller.php?action=saveNotifiche";  }
      else if($scope.type=="userPassword"){     $scope.url=urlFUNCTION+"usersetting/controller.php?action=savePassword";  }
      else if($scope.type=="userDisattiva"){    $scope.url=urlFUNCTION+"usersetting/controller.php?action=disattiva";  }


      if(!angular.isObject($scope.field)){ $scope.field={}; } $scope.field.idUserSession=$rootScope.idUserSession;

      $scope.pushRow = function (){
        data = angular.toJson($scope.field.dataPost.nazionale);
        length = $scope.field.data.length;
        $scope.field.data.push({length:data});
      }
      $scope.pushRow2 = function (){
        console.log("default");
        console.log($scope.field.dataPost.nazionali);
        console.log("new");
        console.log($scope.field.dataPost.nazionali);

        data = angular.toJson($scope.field.dataPost.nazionali);
        length = $scope.field.dataPost.nazionali.length;

        $scope.field.dataPost.nazionali.push(length);
      }
      $scope.pushTrasporto = function (){
        $scope.field.dataPost.nazionali.push({idtipotrasporto:0,priceadd:0,price:0});
      }
      $scope.pushVariante = function (){
        $scope.field.dataPost.infoAlloggio.variante.push({id:"",name:"",posti:"",posti:"",price:{}});
      }


      //quando su chooseLocation cambio il comune, calcolo le coordinate e sposto il puntatore
      $scope.$watch('field.dataPost.location.idcomune', function () {
          //$scope.list = new ListAdmin();
          //$scope.list.nextPage(0,$scope.postData);
          if(!$scope.busyInfo && $scope.field.dataPost && $scope.listLocation){
              var center = new google.maps.LatLng($scope.listLocation[$scope.field.dataPost.location.provincia].comuni[$scope.field.dataPost.location.idcomune].lat, $scope.listLocation[$scope.field.dataPost.location.provincia].comuni[$scope.field.dataPost.location.idcomune].lng);
              if($scope.markerCenter){
                    $scope.markerCenter.setPosition(center);
              }else{
                    $scope.addMarker(center);
              }
              $scope.map.setCenter(center);
              $scope.map.setZoom(14);
              $scope.map.panTo(center);
              //if(!$scope.field.dataPost.location.lat){
              $scope.field.dataPost.location.lat = $scope.listLocation[$scope.field.dataPost.location.provincia].comuni[$scope.field.dataPost.location.idcomune].lat;
              $scope.field.dataPost.location.lng = $scope.listLocation[$scope.field.dataPost.location.provincia].comuni[$scope.field.dataPost.location.idcomune].lng;
              //}
          }
      });


      $scope.$watch('field.dataPost.location.lat', function () {
         if($scope.field.dataPost){
                $scope.lat=$scope.field.dataPost.location.lat;
                $scope.lng=$scope.field.dataPost.location.lng;
         }
      });

      //quando su chooseLocation cambio la localita, calcolo le coordinate e sposto il puntatore
      $scope.$watch('field.dataPost.location.idlocalita', function () {
          if($scope.listLocation[$scope.field.dataPost.location.provincia].comuni[$scope.field.dataPost.location.idcomune].localita[$scope.field.dataPost.location.idlocalita].lat){
              if(!$scope.busyInfo && $scope.field.dataPost && $scope.listLocation){
                    var center = new google.maps.LatLng($scope.listLocation[$scope.field.dataPost.location.provincia].comuni[$scope.field.dataPost.location.idcomune].localita[$scope.field.dataPost.location.idlocalita].lat, $scope.listLocation[$scope.field.dataPost.location.provincia].comuni[$scope.field.dataPost.location.idcomune].localita[$scope.field.dataPost.location.idlocalita].lng);
                    if($scope.markerCenter){
                          $scope.markerCenter.setPosition(center);
                    }else{
                          $scope.addMarker(center);
                    }
                    $scope.map.setCenter(center);
                    $scope.map.setZoom(14);
                    $scope.map.panTo(center);
                    //if(!$scope.field.dataPost.location.lat){
                      $scope.field.dataPost.location.lat = $scope.listLocation[$scope.field.dataPost.location.provincia].comuni[$scope.field.dataPost.location.idcomune].localita[$scope.field.dataPost.location.idlocalita].lat;
                      $scope.field.dataPost.location.lng = $scope.listLocation[$scope.field.dataPost.location.provincia].comuni[$scope.field.dataPost.location.idcomune].localita[$scope.field.dataPost.location.idlocalita].lng;
                    //}
              }
          }
      });

      $scope.$watch('lat', function () {
          if(!$scope.map){
                $scope.initializeMap();
          }else{
              if($scope.lat){
                      var center = new google.maps.LatLng($scope.lat, $scope.lng);
                      if($scope.markerCenter){
                            $scope.markerCenter.setPosition(center);
                      }else{
                            $scope.addMarker(center);
                      }
              }
          }
      });

      //se sto modificando un oggetto, mi faccio ritornare le informazioni
      $scope.getInfoPageEdit = function(type,id){
          if($scope.whereId){
                 var field = {
                   typeSearch : $scope.type,
                   typePage : $scope.type,
                   idTypeSearch : $scope.whereId,
                   idPage : $scope.whereId,
                   UserId:$rootScope.idUserSession
                 }
                 $scope.busyInfo=true;
                 var urlInfoUser=urlJSON+"Discovery.php";
                 //if($scope.type=="proverbi" || $scope.type=="modididire" || $scope.type=="miti"){ var urlInfoUser=urlJSON+"Proverbi.php";  }
                 if($scope.type=="trasporti" ){ var urlInfoUser=urlJSON+"ecommerce/getTrasporti.php";  }
                 if($scope.type=="pagine" ){ var urlInfoUser=urlJSON+"paneladmin/menu-list.php";  }
                 $http({method: "POST", url: urlInfoUser, data:field, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                      .success(function(response){  if(response.error==0){
                              //se sono nella pagina paneladmin, imposto il titolo
                              $scope.field.dataPost=$scope.upload.item=response.data[0];

                              $rootScope.infoPagina.title=$scope.field.dataPost.nome;

                              if(angular.isDefined($scope.field.dataPost.location)){
                                $scope.lat=$scope.field.dataPost.location.lat;
                                $scope.lng=$scope.field.dataPost.location.lng;
                              }
                      }else{ $scope.field.dataPost={}; } $scope.busyInfo=false; });

          }
          return $rootScope.infoPage;
      }

      if($scope.whereId){  $scope.getInfoPageEdit(); }

      //recupero la lista delle province, comuni e località
      $scope.getLocation = function (){
              $scope.initializeMap();

              var urlInfoUser=urlJSON+"getLocalita.php";
              $http({method: "GET", url: urlInfoUser, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                  .success(function(response){ if(response.error==0){  $scope.listLocation=response.data; }else{ $scope.listLocation={}; } });
      }

      $scope.initializeMap = function() {
            if(!$scope.map){
                  var zoom=7;
                  var center=new google.maps.LatLng(37.45,14.26);
                  if($scope.lat){
                      var zoom=14;
                      center=new google.maps.LatLng($scope.lat, $scope.lng);
                  }

                  var mapOptions = {
                      zoom: zoom,
                      center: center,
                      mapTypeId: google.maps.MapTypeId.TERRAIN
                  }

                  if($('#map').length){
                      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                      if($scope.lat){
                            if($scope.markerCenter){
                                  $scope.markerCenter.setPosition(center);
                            }else{
                                  $scope.addMarker(center);
                            }
                      }
                  }
            }
      }

      //aggiungo un marker a $scope.map
      $scope.addMarker = function (center){
            if(center.lat()){
                  $scope.markerCenter = new google.maps.Marker({
                      map: $scope.map,
                      position: center,
                      title: "Trascinami",
                      draggable:true
                  });
                  $scope.busyInfo=false;
                  $scope.map.setCenter(center);
                  $scope.map.setZoom(14);
                  $scope.map.panTo(center);

                  google.maps.event.addListener($scope.markerCenter,'dragend',function(event) {
                      $scope.field.dataPost.location.lat = this.position.lat();
                      $scope.field.dataPost.location.lng = this.position.lng();
                      var center=new google.maps.LatLng( this.position.lat(), this.position.lng());
                      $scope.map.setCenter(center);
                      $scope.map.panTo(center);
                  });
            }
      }
      //funzione che invia i dati
      $scope.submitData = function (){
            $rootScope.msgPopup.close();
            if(ADMIN.test){ console.log("Sto inviando: ");console.log( $scope.field); }
            if($scope.busy==true){ return }
            if(!confirm("Continuare?")){ return }

            $scope.busy=true;

            $http({ method:"POST", url:$scope.url, data: $scope.field, headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).
                     success(function(response) {
                          if(ADMIN.test){  console.log("Ho ricevuto: "); console.log(response);   }

                          if(response.error!=0){
                              if(!response.errorMsg){ response.errorMsg="Operazione non riuscita, aggiorna la pagina e riprova.<br> Se il problema persiste contattare l'assistenza.<br>Una segnalazione è stata inviata"; }
                              $rootScope.msgPopup.open(false,response.errorMsg);
                              $scope.busy=false;
                              return;
                          }else{
                              //se mi trovo nel paneladmin
                              if($rootScope.addNew){
                                    if(response.goToUrl=="closeDialog"){
                                        location.reload();
                                        //$rootScope.dialog.close();
                                    }else{
                                        $window.history.back();
                                    }
                              }else{
                                    if(response.goToUrl=="closeDialog"){
                                          $rootScope.dialog.close();
                                          response.goToUrl="msg";
                                    }
                                    else if(response.goToUrl=="this"){
                                        location.reload();
                                    }
                                    else if(response.goToUrl=="msg"){
                                        if(response.error==0){
                                          $rootScope.msgPopup.open(true,"Operazione riuscita");
                                        }else{
                                          $rootScope.msgPopup.open(false,response.errorMsg);
                                        }
                                    }else{
                                          window.location.href=response.goToUrl;
                                    }
                              }
                          }
                          $scope.busy=false;
                    }).
                    error(function(response) {
                          $rootScope.msgPopup.open(false,'Errore dal server, una segnalazione e stata inviata');
                          $scope.busy=false;
                    });

      };


      //funzione che invia i dati
      $scope.Delete = function (){
            $('#msgPopup').removeClass('show');
            $('#msgPopup').removeClass('del');
            $('#msgPopup').removeClass('ok');
            if($scope.busy==true){ return }
            if(ADMIN.test){ console.log("Sto inviando: ");console.log( $scope.field); }console.log("Sto inviando: ");console.log( $scope.field);
            var config = {
                    params: {
                            field: $scope.field
                    }
            };
            //var jsonPost=JSON.stringify($scope.field);
            $scope.busy=true;
            /*if($rootScope.addNewUrl){
               $scope.url=$rootScope.addNewUrl;
            } */
            $http({ method:"POST", url:urlFUNCTIONV+"/delete.php", data: $scope.field, headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).
                     success(function(response) {
                          $scope.busy=false;
                          if(response.error!=0){
                            $('#msgPopup').addClass('show');
                            $('#msgPopup').addClass('del');
                            $('#msgPopup').html('Errore'+response);
                            $scope.busy=false;
                          }
                          if(response.goToUrl=="closeDialog"){
                                $rootScope.dialog.close();
                                response.goToUrl="msg";
                          }
                          if(ADMIN.test){
                              console.log("Ho ricevuto: ");
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
  }
  angular.element(window).bind('dragover', function (e) {
    e.preventDefault();
  });
  angular.element(window).bind('drop', function (e) {
    e.preventDefault();
  });
  angular.element(document.querySelector( '.drop-box' )).bind('click', function (e) {
    e.preventDefault();
  });

});


