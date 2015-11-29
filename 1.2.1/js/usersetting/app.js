//dichiaro il modulo app
var urlJSON="/JSON-Android/1.2.5/";
var urlFUNCTION="/function/";
var app = angular
            .module('app',[
                'infinite-scroll',
                /*'ngAutocomplete', */
                'ngAnimate',
                'ngRoute',
                /*'angularModalService',*/
                '720kb.tooltips',
                /*'perfect_scrollbar',*/
                'ngFileUpload',
                'ui.sortable',
                'ui.date',
                'jerryhsia.minieditor'
            ])
            .constant('ADMIN', {
                  test: false
            })
            .config(function ($routeProvider) {
                  $routeProvider
                    .when('/informazioni', {
                      templateUrl: 'view/user/usersetting/modifica.php',
                      data: {
                          title : "Modifica informazioni",
                          label : "informazioni",
                          search : false
                      }
                    })
                    .when('/password', {
                      templateUrl: 'view/user/usersetting/cambiopassword.php',
                      data: {
                          title : "Cambia password",
                          label : "password",
                          search : true
                      }
                    })
                    .when('/disattiva', {
                      templateUrl: 'view/user/usersetting/disattiva.php',
                      data: {
                          title : "Disattiva account",
                          label : "disattiva",
                          search : true
                      }
                    })

                    .otherwise({redirectTo: '/informazioni'}) ;

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
