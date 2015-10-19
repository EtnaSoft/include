var app = angular.module('app');
var urlJSON="/JSON-Android/1.2.5/";
var urlFUNCTION="/function/";
var urlFUNCTIONV="/function/1.1/";
var version = '7.3.7';


app.directive('fadeIn', function($timeout){
    return {
        restrict: 'A',
        link: function($scope, $element, attrs){
            $element.addClass('loading');
            $element.on('load', function() {
                $element.removeClass('loading');
            });
        }
    }
})


app.directive('htmldiv', function($compile, $parse) {
return {
  restrict: 'E',
  link: function(scope, element, attr) {
    scope.$watch(attr.content, function() {
      element.html($parse(attr.content)(scope));
      $compile(element.contents())(scope);
    }, true);
  }
}
});

app.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);

app.directive('fallbackSrc', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
   }
   return fallbackSrc;
});

app.filter('getVideoId', function() {
  return function(input) {
    output="";
    if(input){
        // recupero video id di youtube, passando un link
        var output = input.substr(input.indexOf("=") + 1);
    }
    return output;
  }
})

app.directive('myYoutube', function($sce) {
  return {
    restrict: 'EA',
    scope: { code:'=' },
    replace: true,
    template: '<iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe>',
    link: function (scope) {
        console.log('here');
        scope.$watch('code', function (newVal) {
           if (newVal) {
               scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
           }
        });
    }
  };
});

app.service('Function', function($rootScope, $http, $q,  ADMIN ) {
  $rootScope.Function = function() {
    $rootScope.Function.functionBusy = false;
    //this.dialog = new Dialog();
    $rootScope.Function.field = {};
   // this.idUserSession = ADMIN.idUser;
  };
  $rootScope.Function.functionBusy = false;


  Function.prototype.checkSession = function() {
    if($rootScope.idUserSession==null){
      return false;
    }else{
      return true;
    }
  }


  Function.prototype.Delete = function(type,id) {
        if(!confirm("Confermi?")){ return }

        $http({ method: "POST", url: urlFUNCTIONV+"delete.php" ,data: $.param({id: id, type: type}) , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
          .success(function(response){
             if(response.error==0){
                return true;
             }else{
                return false;
             }
         })
        .error(function(){
             return false;
        });
  };

  Function.prototype.chooseImage = function(field) {
    $rootScope.Function.field=field;
    $rootScope.msgPopup.close();

    if($rootScope.Function.functionBusy==true){ return }
    if(!confirm("Continuare?")){ return }
    $rootScope.Function.url=urlFUNCTIONV+"chooseImage.php";
    $rootScope.Function.functionBusy=true;

    if(ADMIN.test){ console.log("Sto inviando: ");console.log( $rootScope.Function.field); }

    $http({ method:"POST", url:$rootScope.Function.url, data: $rootScope.Function.field, headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).
             success(function(response) {
                  $rootScope.Function.functionBusy=false;

                  if(ADMIN.test){ console.log("Ho ricevuto: "); console.log(response); }

                  if(response.error!=0){
                      $rootScope.msgPopup.open(false,'Operazione non riuscita, una segnalazione e stata inviata');
                  }else{
                      $rootScope.dialog.close();
                      $rootScope.Function.functionBusy=false;
                      if(response.goToUrl=="msg"){   var msg;
                          if(response.error==0){
                                $rootScope.msgPopup.open(true,'Operazione riuscita ');  $('#msgPopup').addClass('ok'); msg="Operazione riuscita ";
                          }else{
                                $rootScope.msgPopup.open(false,response.errorMsg);
                          }
                      }else{
                          if(response.goToUrl=="this"){
                              location.reload();
                          }else{
                              window.location.href=response.goToUrl;
                          }
                      }
                  }
            }).
            error(function(response) {   $rootScope.msgPopup.open(false,'Errore dal server, una segnalazione e stata inviata');   });

  }



  return Function;
});


app.service('photoView', function($rootScope, $http, $q, $timeout) {
  $rootScope.photoView = function() {
        $rootScope.photoView.busy = false;
        $rootScope.photoView.show = false;
        $rootScope.photoView.type = null;
        $rootScope.photoView.id = null;
        $rootScope.photoView.position = null;
        $rootScope.photoView.total = null;
        $rootScope.photoView.data = null;
  };

  $rootScope.photoView.prototype.open = function(type,id,position) {
        $rootScope.photoView.type = type;
        $rootScope.photoView.id = id;
        $rootScope.photoView.position = position;
        $rootScope.dialog.open(null,'view','photo','','');
        $rootScope.photoView.view();
  };

  $rootScope.photoView.prototype.view = function() {
          $rootScope.photoView.busy=true;
          $http({method: "GET", url: urlJSON+"Photo.php?typePage="+$rootScope.photoView.type+"&idPage="+$rootScope.photoView.id+"&type=&UserId=&orderBy=&limitItemList=1&position="+$rootScope.photoView.position })
            .success(function(response){
              $rootScope.photoView.data = response;
              $rootScope.photoView.busy=false;
              $rootScope.dialog.open($rootScope.photoView.data,'view','photo','','');
           })
          .error(function(){

          });
  };
  $rootScope.photoView.prototype.next = function() {
          if($rootScope.photoView.position<$rootScope.photoView.data.allCount-1){
              $rootScope.photoView.position++;
          }else{
              $rootScope.photoView.position=0;
          }
          $rootScope.photoView.view();
  };
  $rootScope.photoView.prototype.back = function() {
          if($rootScope.photoView.position>0){
              $rootScope.photoView.position--;
          }else{
              $rootScope.photoView.position=$rootScope.photoView.data.allCount-1;
          }
          $rootScope.photoView.view();
  };

  $rootScope.photoView.prototype.close = function() {

  };

  return $rootScope.photoView;
});

/*servicemsgpopup*/
app.service('msgPopup', function($rootScope, $http, $q, $timeout, ADMIN ) {
  $rootScope.msgPopup = function() {
        $rootScope.msgPopup.busy = false;
        $rootScope.msgPopup.show = false;
  };

  $rootScope.msgPopup.prototype.open = function(validate,text) {
        $('#msgPopup').addClass('show');
        if(validate){
            $('#msgPopup').addClass('ok');
        }else{
            $('#msgPopup').addClass('del');
        }
        $('#msgPopup').html(text);
        $timeout( function(){ $rootScope.msgPopup.close(); }, 3000);
  };

  $rootScope.msgPopup.prototype.close = function() {
        $('#msgPopup').removeClass('show');
        $('#msgPopup').removeClass('del');
        $('#msgPopup').removeClass('ok');
  };

  return $rootScope.msgPopup;
});


app.service('Dialog', function($rootScope, $http, $q, $timeout, ADMIN ) {
  $rootScope.dialog = function() {
    $rootScope.dialog.busy = false;
    $rootScope.dialog.show = false;
    $rootScope.dialog.template =  null;
    $rootScope.dialog.templateLoad =  null;
    $rootScope.dialog.data=null;
    $rootScope.dialog.infoUser = $rootScope.infoUser;
    $rootScope.dialog.photo = { id:null, busy:false, prev:null, next:null, post:null };
    $rootScope.dialog.action = null;
    $rootScope.dialog.actioncosa = null;
  };

  $rootScope.dialog.prototype.open = function(data,action,actioncosa,type,idtype) {
        $('body').css('overflow-y','hidden');
        $('#maschera').addClass('show');
        $rootScope.dialog.show=true;
        $rootScope.dialog.template =  null;
        $rootScope.dialog.data=data;
        $rootScope.dialog.action = action;
        $rootScope.dialog.actioncosa = actioncosa;
            $rootScope.dialog.shows(data,action,actioncosa,type,idtype);
        if(data!=null){
        }

  };
  $rootScope.dialog.prototype.shows = function(data,action,actioncosa,type,idtype) {
        console.log("User");
        console.log($rootScope.infoUser);
        if(action=="selected"){
            if(actioncosa=="localita"){
                 $.post('selLocalita.php', { idtype: ""+idtype+"", type: ""+type+""}, function(data){
                        if(data.length>0){ }
                 });
            }
            if(actioncosa=="imm"){
                  if(!$rootScope.Function.checkSession()){ $rootScope.dialog.open(null,'view','login','',''); return }
                  $rootScope.dialog.templateLoad =  { name:'chooseImage',url:'/view/dialog/chooseImage.php' };
            }
            if(actioncosa=="video"){
                  if(!$rootScope.Function.checkSession()){ $rootScope.dialog.open(null,'view','login','',''); return }
                  $rootScope.dialog.templateLoad =  { name:'chooseVideo',url:'/view/dialog/chooseVideo.php' };
            }


            if(actioncosa=="type"){

                 $.post('selimm.php', {  type: ""+type+"", idtype: ""+idtype+""}, function(data){
                        if(data.length>0){  }
                 });
            }
        }
        if(action=="view"){
             $rootScope.dialog.templateLoad =  { name:actioncosa,url:'/view/dialog/'+actioncosa+'.php' };
        }

        if(action=="delete"){ if(!$rootScope.Function.checkSession()){ $rootScope.dialog.open(null,'view','login','',''); return }  $rootScope.dialog.templateLoad =  { name:action, url:'/view/dialog/delete.php' };   }
        if(action=="edit"){ if(!$rootScope.Function.checkSession()){ $rootScope.dialog.open(null,'view','login','',''); return }  $rootScope.dialog.templateLoad =  { name:action, url:'/view/user/mypages/new/nuovo.php?id='+idtype+'' };  }
        if(action=="new"){ if(!$rootScope.Function.checkSession()){ $rootScope.dialog.open(null,'view','login','',''); return }  $rootScope.dialog.templateLoad =  { name:action, url:'/view/dialog/new/'+actioncosa+'.php' };  }
        if(action=="nuovo"){ if(!$rootScope.Function.checkSession()){ $rootScope.dialog.open(null,'view','login','',''); return }  $rootScope.dialog.templateLoad =  { name:action, url:'/view/user/mypages/new/'+actioncosa+'.php' };  }

        $('#windows').addClass('show');

        $rootScope.dialog.busy=false;
        $rootScope.dialog.template=$rootScope.dialog.templateLoad;
  };

  $rootScope.dialog.prototype.onload = function() {
         $timeout(function() {
         });

  };

  $rootScope.dialog.prototype.close = function() {
       $rootScope.dialog.template =  null;
       $('#maschera').removeClass('show');
       $('#windows').removeClass('show');
       $('body').css('overflow-y','auto');
       setInterval(function(){
       }, 500);

       $rootScope.dialog.show=false;

  };

  return $rootScope.dialog;
});

app.service('New', function( $rootScope,$scope, $window, $http, ADMIN ) {
  //$scope.init = function(typeSearch,onStartQuery,limitItemList,orderby,type,typeSub,UserId,myLat,myLng,forUser,dateStart,dateEnd,Language){
      $scope.type=type;
      //carico
      if($scope.type=="risorse"){ $scope.type="risorsa"; }
      $scope.layout='view/user/mypages/new/'+$scope.type+'.php';

      $scope.whereId=whereId;

      $scope.listType=[];
      $scope.busy=false;
      $scope.busyInfo=false;
      $scope.field = $window.field;
      if(where){ $scope.field.dataPost = where; }
      $scope.listLocation = null;
      $scope.map=null;
      $scope.markerCenter=null;
      $scope.lat=null;
      $scope.lng=null;

      var New = function() {
          this.items=[];
          this.busy = false;
          this.page = 0;
          this.busyLike = false;
          this.nextpage = false;
          this.after = 0;
          this.stopComune = false;
          this.position = 0;
      };




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

      if(ADMIN.test){ console.log("$scope.field on start:");  console.log($scope.field); }

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
                 if($scope.type=="ricette" || $scope.type=="proverbi" || $scope.type=="modididire" || $scope.type=="miti"){ var urlInfoUser=urlJSON+"Proverbi.php";  }
                 if($scope.type=="trasporti" ){ var urlInfoUser=urlJSON+"ecommerce/getTrasporti.php";  }

                 $http({method: "POST", url: urlInfoUser, data:field, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                      .success(function(response){  if(response.error==0){
                            $scope.field.dataPost=response.data[0];
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

            if($scope.busy==true){ return }
            if(!confirm("Continuare?")){ return }
            $scope.busy=true;

            if(ADMIN.test){ console.log("Sto inviando: ");console.log( $scope.field); }

            $http({ method:"POST", url:$scope.url, data: $scope.field, headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).
                     success(function(response) {
                          $scope.busy=false;
                          if(response.error!=0){
                                $rootScope.msgPopup.open(false,'Errore'+response);
                                $scope.busy=false;
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
                          $rootScope.msgPopup.open(false,'Errore dal server, una segnalazione e stata inviata');
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
            var jsonPost=JSON.stringify($scope.field);
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
});

app.service('ServiceUpload', function ($rootScope,  $http, $timeout,  Upload) {
  var ServiceUpload = function() {
    this.files=[];
    this.item={
      type: null,
      id: null
    };

    this.type="image";
    this.busy = false;
    this.chunkSize = 100000;
    this.pattern=null;
    this.capture = localStorage.getItem('capture' + version) || 'camera';
    if(this.type=="video"){
        this.pattern = 'video/*';
        this.acceptSelect = 'video/*';

    }else{
        this.pattern = 'image/*';
        this.acceptSelect = 'image/*';
    }
    this.disabled = localStorage.getItem('disabled' + version) == 'true' || false;           
    this.multiple = localStorage.getItem('multiple' + version) == 'true' || false;
    this.allowDir = localStorage.getItem('allowDir' + version) == 'true' || true;
    this.validate = localStorage.getItem('validate' + version) || '{size: {max: \'20MB\', min: \'10B\'}, height: {max: 5000}, width: {max: 5000}, duration: {max: \'5m\'}}';
    this.keep = localStorage.getItem('keep' + version) == 'true' || false;
    this.keepDistinct = localStorage.getItem('keepDistinct' + version) == 'true' || false;
  };


  ServiceUpload.prototype.uploadUsingUpload = function(file) {

          //nel file upload passo, l'oggetto su cui sto inserendo l'immagine ( attivita,evento etc..,  ) type e id appunto dell'oggetto, e il tipo di upload ( youtube,video,foto )
          file.upload = Upload.upload({
            url: urlFUNCTIONV +"upload.php",
            headers: {
              'optional-header': 'header-value'
            },
            fields: {
              idUserSession: '',
              typeUpload: this.type,  /* foto,video */
              item: this.item,        /* array con info dell'oggetto ( quasi sempre da discovery.php ) */
              type: this.item.type,   /* tipo dell'oggetto ( quasi sempre da discovery.php ), attivita, eventi */
              id: this.item.id        /* id dell'oggetto ( quasi sempre da discovery.php ) */
            },
            file: file,               /*il file da caricare, carico un file per volta*/
          });

          file.upload.then(function (response) {
            $timeout(function () {
              file.result = response.data;
              file.id = file.result.data.id;
              //alert(file.result.data.type);
              file.types = file.result.data.type;

              //carico l'array files con i valori che mi ritornano discovery.php, aggiungo in tempo reale alla lista di foto/video un nuovo elemento, con caricamento etc..
              if(file.types=="video"){
                file.video={
                  type:'video',
                  video:{
                    src:file.result.data.video.src
                  }
                };
              }
              else if(file.types=="foto"){
                file.foto={
                  type:'foto',
                  url:file.result.data.foto.src
                };
              }


            });
          }, function (response) {
            //if (response.status > 0)
              //$scope.errorMsg = response.status + ': ' + response.data;
          });

          file.upload.progress(function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });

          file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
          });
  }

  ServiceUpload.prototype.Save = function (files) {
            var self=this;
            self.busy=true;
            submit = {
              data:this.item,
              files:files
            }
            //su files, posso passare pure i valori del link da youtube
            $http({ method:"POST", url:urlFUNCTIONV+"uploadSave.php", data: submit, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                    .success(function(response) {
                          if(response.error==0){
                                $rootScope.dialog.close();
                                location.reload();
                          }else{
                                $('#msgPopup').addClass('show');
                                $('#msgPopup').addClass('del');
                                $('#msgPopup').html('Errore nel caricamento dei file, attedi il completamento di tutti i file');
                          }
                          self.busy=false;
                    })
                    .error(function(response) {
                                self.busy=false;
                    });
  };

  ServiceUpload.prototype.Delete = function (position) {
      var self=this;
      $http({ method:"POST", url:urlFUNCTIONV+"delete.php", data: self.files[position].result.data, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
              .success(function(response) {
                    if(response.error==0){
                          self.files.splice(position,1);
                    }
              })
              .error(function(response) {

              });
              //f.upload.abort(); f.upload.aborted=true; f=null;
  };

  //$timeout(function () {
        //alert(ServiceUpload.chunkSize);
        /*this.capture = localStorage.getItem('capture' + version) || 'camera';
        if(this.type=="video"){
            this.pattern = 'video/*';
            this.acceptSelect = 'video/*';

        }else{
            this.pattern = 'image/*';
            this.acceptSelect = 'image/*';
        }
        this.disabled = localStorage.getItem('disabled' + version) == 'true' || false;
        this.multiple = localStorage.getItem('multiple' + version) == 'true' || false;
        this.allowDir = localStorage.getItem('allowDir' + version) == 'true' || true;
        this.validate = localStorage.getItem('validate' + version) || '{size: {max: \'20MB\', min: \'10B\'}, height: {max: 5000}, width: {max: 5000}, duration: {max: \'5m\'}}';
        this.keep = localStorage.getItem('keep' + version) == 'true' || false;
        this.keepDistinct = localStorage.getItem('keepDistinct' + version) == 'true' || false; */
        //this.$watch('validate+capture+pattern+acceptSelect+disabled+capture+multiple+allowDir+keep+keepDistinct', function () {
          /*localStorage.setItem('capture' + version, this.capture);
          localStorage.setItem('pattern' + version, this.pattern);
          localStorage.setItem('acceptSelect' + version, this.acceptSelect);
          localStorage.setItem('disabled' + version, this.disabled);
          localStorage.setItem('multiple' + version, this.multiple);
          localStorage.setItem('allowDir' + version, this.allowDir);
          localStorage.setItem('validate' + version, this.validate);
          localStorage.setItem('keep' + version, this.keep);
          localStorage.setItem('keepDistinct' + version, this.keepDistinct);  */
        //});

  //},1000);


  return ServiceUpload;
});

