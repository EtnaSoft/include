//dichiaro il modulo app
var urlJSON="/JSON-Android/1.2.5/";
var urlFUNCTION="/function/";
var app = angular
            .module('app',[
                'infinite-scroll',
                'ngAutocomplete',
                'ngAnimate',
                'ngRoute',
                'angularModalService',
                '720kb.tooltips',
                'perfect_scrollbar',
                'ngFileUpload',
                'ui.sortable'
            ])
            .constant('ADMIN', {
                  test: false
            })
            .config(function ($routeProvider) {
                  $routeProvider
                    .when('/dashboard', {
                      templateUrl: 'view/user/paneladmin/home.php',
                      data: {
                          title : "Dashboard",
                          label : "home",
                          search : false
                      }
                    })
                    .when('/home', {
                      templateUrl: 'view/user/paneladmin/home.php',
                      data: {
                          title : "Dashboard",
                          label : "home",
                          search : false
                      }
                    })
                    .when('/accessi', {
                      templateUrl: 'view/user/paneladmin/accessi.php',
                      data: {
                          title : "Accessi",
                          label : "accessi",
                          search : true
                      }
                    })
                    .when('/iscritti', {
                      templateUrl: 'view/user/paneladmin/iscritti.php',
                      data: {
                          title : "Iscritti",
                          label : "iscritti",
                          search : true
                      }
                    })
                    .when('/attivitacommerciali', {
                      templateUrl: 'view/user/paneladmin/attivitacommerciali.php',
                      data: {
                          title : "Attività commerciali",
                          label : "attivitacommerciali",
                          search : true
                      }
                    })
                    .when('/newsletter', {
                      templateUrl: 'view/user/paneladmin/newsletter.php',
                      data: {
                          title : "Newsletter",
                          label : "newsletter",
                          search : true
                      }
                    })
                    .when('/itinerari', {
                      templateUrl: 'view/user/paneladmin/itinerari.php',
                      data: {
                          title : "Gestione itinerari",
                          label : "itinerari",
                          search : true
                      }
                    })
                    .when('/eventi', {
                      templateUrl: 'view/user/paneladmin/eventi.php' ,
                      data: {
                          title : "Gestione eventi",
                          label : "eventi",
                          search : true
                      }
                    })
                    .when('/speciealieutiche', {
                      templateUrl: 'view/user/paneladmin/speciealieutiche.php',
                      data: {
                          title : "Gestione specie alieutiche",
                          label : "speciealieutiche",
                          search : true
                      }
                    })
                    .when('/tipologie', {
                      templateUrl: 'view/user/paneladmin/tipologie.php',
                      data: {
                          title : "Gestione tipologie",
                          label : "tipologie",
                          search : true
                      }
                    })
                    .when('/verifiche', {
                      templateUrl: 'view/user/paneladmin/verifiche.php',
                      data: {
                          title : "Verifiche",
                          label : "verifiche",
                          search : true
                      }
                    })
                    .when('/pagine', {
                      templateUrl: 'view/user/paneladmin/pagine.php',
                      data: {
                          title : "Gestione pagine",
                          label : "pagine",
                          search : true
                      }
                    })
                    .when('/segnalazioni', {
                      templateUrl: 'view/user/paneladmin/segnalazioni.php',
                      data: {
                          title : "Segnalazioni",
                          label : "segnalazioni",
                          search : true
                      }
                    })
                    .when('/richiestecontatti', {
                      templateUrl: 'view/user/paneladmin/richiestecontatti.php',
                      data: {
                          title : "Richieste contatti",
                          label : "richiestecontatti",
                          search : true
                      }
                    })
                    .when('/statistiche', {
                      templateUrl: 'view/user/paneladmin/statistiche.php',
                      data: {
                          title : "Statistiche",
                          label : "statistiche",
                          search : false
                      }
                    })
                    .when('/itinerari', {
                      templateUrl: 'view/user/paneladmin/itinerari.php',
                      data: {
                          title : "Itinerari",
                          label : "itinerari",
                          search : true
                      }
                    })
                    .when('/video', {
                      templateUrl: 'view/user/paneladmin/video.php',
                      data: {
                          title : "Video",
                          label : "video",
                          search : true
                      }
                    })
                    .when('/ricette', {
                      templateUrl: 'view/user/paneladmin/ricette.php',
                      data: {
                          title : "Ricette",
                          label : "ricette",
                          search : true
                      }
                    })
                    .when('/offerte', {
                      templateUrl: 'view/user/paneladmin/offerte.php',
                      data: {
                          title : "Offerte",
                          label : "offerte",
                          search : true
                      }
                    })



                    .when('/attivitacommerciali/:id', {
                      templateUrl: 'view/user/paneladmin/nuovo.php',
                      data: {
                          title : "attività commerciali",
                          label : "attivitacommerciali" ,
                          search : false
                      }
                    })
                    .when('/eventi/:id', {
                      templateUrl: 'view/user/paneladmin/nuovo.php',
                      data: {
                          title : "evento",
                          label : "eventi",
                          search : false
                      }
                    })
                    .when('/speciealieutiche/:id', {
                      templateUrl: 'view/user/paneladmin/nuovo.php',
                      data: {
                          title : "specie alieutiche",
                          label : "speciealieutiche",
                          search : false
                      }
                    })
                    .when('/itinerari/:id', {
                      templateUrl: 'view/user/paneladmin/nuovo.php',
                      data: {
                          title : "itinerari",
                          label : "itinerari",
                          search : false
                      }
                    })
                    .when('/video/:id', {
                      templateUrl: 'view/user/paneladmin/nuovo.php',
                      data: {
                          title : "video",
                          label : "video",
                          search : false
                      }
                    })
                    .when('/offerte/:id', {
                      templateUrl: 'view/user/paneladmin/nuovo.php',
                      data: {
                          title : "offerte",
                          label : "offerte",
                          search : false
                      }
                    })
                    .when('/ricette/:id', {
                      templateUrl: 'view/user/paneladmin/nuovo.php',
                      data: {
                          title : "ricette",
                          label : "ricette",
                          search : false
                      }
                    })
                    .when('/lingue', {
                      templateUrl: 'view/user/paneladmin/lingue.php',
                      data: {
                          title : "lingue",
                          label : "lingue",
                          search : false
                      }
                    })


                    .when('/speciealieutiche/:id/:page', { templateUrl: 'view/user/paneladmin/nuovo.php', data: { title : "specie alieutiche", label : "speciealieutiche", search : false    } })
                    .when('/itinerari/:id/:page', { templateUrl: 'view/user/paneladmin/nuovo.php', data: { title : "itinerari", label : "itinerari", search : false    } })
                    .when('/eventi/:id/:page', { templateUrl: 'view/user/paneladmin/nuovo.php', data: { title : "eventi", label : "eventi", search : false    } })
                    .when('/attivitacommerciali/:id/:page', { templateUrl: 'view/user/paneladmin/nuovo.php', data: { title : "attività commerciali", label : "attivitacommerciali", search : false    } })
                    .when('/ricette/:id/:page', { templateUrl: 'view/user/paneladmin/nuovo.php', data: { title : "ricette", label : "ricette", search : false    } })
                    .when('/offerte/:id/:page', { templateUrl: 'view/user/paneladmin/nuovo.php', data: { title : "offerte", label : "offerte", search : false    } })




                    .otherwise({redirectTo: '/dashboard'}) ;

                   //$locationProvider.html5Mode(true);
            });




app.run(['$rootScope', '$location', '$routeParams' ,   '$http', function($rootScope,Dialog, $location, $http, $routeParams ){
                                  // alert(con);


    $rootScope.searchItem="";
    $rootScope.idUserSession=null;
    $rootScope.infoPagina={
      title:'Pannello di controllo',
      type:'home'
    };
    $rootScope.infoUser=null;
    $rootScope.Dialog=null;
    $rootScope.Function=null;
    setInterval(function(){
        $rootScope.$apply(function(){
           //alert($rootScope.idUser);
           $rootScope.now = new Date().getTime();
           $rootScope.test = false;
        });
    }, 6000);

  $rootScope.$on('$stateChangeStart', function (event, next, current) {
      //alert("ca");
  });
  $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
      //alert($routeParams.id);

      $rootScope.infoPagina=next.data;
      $rootScope.infoPagina.type=next.data.label;
      $rootScope.infoPagina.name=next.data.title;
      $rootScope.infoPagina.data="";
      $rootScope.addNew="";


  });






}]);



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