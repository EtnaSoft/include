//dichiaro il modulo app
var include = "https://svn.riouxsvn.com/paneladmin/";
var app = angular
            .module('app',[
                'infinite-scroll',
                /*'ngAutocomplete', */
                'ngAnimate',
                'ngRoute',
                'chart.js',
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
            .config(['ChartJsProvider', function (ChartJsProvider) {
              // Configure all charts
              ChartJsProvider.setOptions({
                //colours: ['#2196F3', '#FF8A80'],
                responsive: true
              });
              // Configure all line charts
              ChartJsProvider.setOptions('Line', {
                datasetFill: true
              });
            }])
            .config(function ($routeProvider) {
                  $routeProvider
                    .when('/:page', {
                      templateUrl: function(params){
                            var url = 'view/user/paneladmin/'+params.page+'.php';
                            var request = new XMLHttpRequest();
                            request.open('HEAD', url, false);
                            request.send();
                            if(request.status != 200) {
                                url=  'view/user/paneladmin/error.php';
                                params.page = "error";
                            }
                            return url;

                      },
                      controller : 'routePage',
                      resolve:{
                        infoPage: ['getInfoPage', '$route',
                                    function(getInfoPage, $route) {
                                      //console.log('resolving someData');
                                      return getInfoPage.getData($route.current.params).then(
                                        function(response) {
                                          return response;
                                        });
                                    }
                                  ]
                      }
                    }).when('/:page/:id', {
                      templateUrl: 'view/user/paneladmin/nuovo.php',
                      controller : 'routePage',
                      resolve:{
                        infoPage: ['getInfoPage', '$route',
                                    function(getInfoPage, $route) {
                                      //console.log('resolving someData');
                                      return getInfoPage.getData($route.current.params).then(
                                        function(response) {
                                          return response;
                                        });
                                    }
                                  ]
                      }
                    }).when('/:page/:id/:tabs', {
                      templateUrl: 'view/user/paneladmin/nuovo.php',
                      controller : 'routePage',
                      resolve:{
                        infoPage: ['getInfoPage', '$route',
                                    function(getInfoPage, $route) {
                                      //console.log('resolving someData');
                                      return getInfoPage.getData($route.current.params).then(
                                        function(response) {
                                          return response;
                                        });
                                    }
                                  ]
                      }
                    })
                    .otherwise({redirectTo: '/error'}) ;

                   //$locationProvider.html5Mode(true);
            });


app.factory('getInfoPage', ['$rootScope','$q','$http', '$timeout', function( $rootScope, $q, $http, $timeout) {

    return {
      getData: function(params) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http({method: "POST", url: urlFUNCTION+"paneladmin/route.php", data:params, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                  .success(function(response){
                        console.log("infoPage");
                        console.log(response);
                        deferred.resolve(response.data);
                  });
        return promise;
      }
    };
  }])

app.controller('routePage', function($scope, $rootScope, $routeParams, infoPage) {
    $rootScope.onLoad=true; $rootScope.infoPagina=infoPage;


});

app.run(['$rootScope', '$location', '$routeParams', '$http' , function($rootScope,Dialog, $location, $http, $routeParams ){
    $rootScope.$on('$stateChangeStart', function (event, next, current) {   });
    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {  $("body").animate({scrollTop: 0}, 0); });
  }]);








