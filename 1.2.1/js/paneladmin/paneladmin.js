var app = angular.module('app');

app.controller('panelAdmin', function($rootScope, $scope, $window, $http, $timeout, $routeParams) {
        $scope.init = function(data){
            $scope.dataPanelAdmin=data;
            $rootScope.addNew=null;
            $rootScope.saveBar=false;
            $scope.menu=[];
            $scope.breadcrumb=[];
            $scope.include={
              url:'view/user/paneladmin/home.php',
              name:'Pannello di controllo'
            };
            $scope.$on('$routeChangeStart', function() {
                $rootScope.busyPage=true;
                /*$rootScope.infoPagina = {
                    name : '',
                    type : $routeParams.page
                };*/
            });
            $scope.$on('$viewContentLoaded', function() {
                  $timeout( function(){ $rootScope.busyPage=false;  }, 400);

                  $scope.breadcrumb=[];
                  var namePage=$rootScope.infoPagina.name;

                  //imposto home
                  if(namePage!="Dashboard" && namePage!="home" && namePage!=""){ $scope.breadcrumb.push({name:"dashboard",url:$scope.dataPanelAdmin.url+'#/dashboard'}); }
                  if($rootScope.infoPagina.id=="new"){
                      $scope.breadcrumb.push({name:$rootScope.infoPagina.type,url:$scope.dataPanelAdmin.url+'#/'+$rootScope.infoPagina.type});
                      $scope.breadcrumb.push({name:"aggiungi",url:''});
                      $rootScope.infoPagina.title="Aggiungi ";
                      $rootScope.addNew=$rootScope.infoPagina.type;
                      $rootScope.urlNew='view/user/mypages/new/'+$rootScope.infoPagina.type+'.php';
                      $rootScope.infoPagina.id="";
                      $rootScope.infoPagina.typeInfoPage="";
                      $rootScope.addNewUrl=urlFUNCTION+"new/"+$rootScope.infoPagina.type+".php";
                  }else if($rootScope.infoPagina.id){
                      $scope.breadcrumb.push({name:$rootScope.infoPagina.type,url:$scope.dataPanelAdmin.url+'#/'+$rootScope.infoPagina.type});
                      $scope.breadcrumb.push({name:"modifica",url:$scope.dataPanelAdmin.url+'#/'+$rootScope.infoPagina.type+"/"+$rootScope.infoPagina.id});
                      $rootScope.infoPagina.id=$rootScope.infoPagina.id;
                      $rootScope.infoPagina.typeInfoPage=$rootScope.infoPagina.tabs;
                      $rootScope.addNew=$rootScope.infoPagina.type;
                      $rootScope.urlNew='view/user/mypages/new/'+$rootScope.infoPagina.type+'.php';
                      $rootScope.addNewUrl=urlFUNCTION+"new/"+$rootScope.infoPagina.type+".php";
                  }else{
                      $rootScope.infoPagina.title=namePage;
                      $scope.breadcrumb.push({name:$rootScope.infoPagina.name,url:$scope.dataPanelAdmin.url+'#/'+$rootScope.infoPagina.type});
                  }


        });
        $scope.saveForm = function(){
            angular.element('#saveForm').trigger('click');
        };
        $scope.getMenu = function(){
           var urlMenu=urlJSON+"paneladmin/menu.php";
           if($scope.dataPanelAdmin.type=="attivita"){
              //var urlMenu=urlJSON+"panelcontrol/menu.php";
              $rootScope.infoPage={};
              $rootScope.infoPage.type=$scope.dataPanelAdmin.type;
              $rootScope.infoPage.id=$scope.dataPanelAdmin.id;
              $scope.getInfoPage($rootScope.infoPage.type,$rootScope.infoPage.id);
           }
           $http({method: "POST", url: urlMenu,data: $scope.dataPanelAdmin , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                .success(function(response){ if(response.error==0){ $scope.menu=response;   }  });
        }
        $scope.chInclude = function(position){
                $rootScope.addNew="";
                $scope.include.url='view/user/paneladmin/'+$scope.menu[position].label+'.php';
                $scope.include.urlNew='view/user/mypages/new/'+$rootScope.infoPagina.type+'.php';
                $scope.include.name=$scope.menu[position].name;
                $scope.include.label=$scope.menu[position].label;
        }
        $scope.onload = function(){
                $('#searchPanel').focus();
        }
        $scope.savePage = function(){
                $('#searchPanel').focus();
        }

        $scope.getSavePage = function(){

                      if ( angular.element('#saveForm').length ) {
                          return true;
                      }else{
                        return false;
                      }
        }
        $scope.getMenu();
    }
});

app.factory('ListAdmin', function($rootScope, $http, $q, ADMIN) {
  position=0;
  var deferredAbort  = $q.defer();
  this.postData="";
  var ListAdmin = function() {
    this.items=[];
    this.busy = false;
    this.page = 0;
    this.busyLike = false;
    this.nextpage = false;
    this.after = position;
  };

  ListAdmin.prototype.nextPage = function(start,postData) {
        //se lo stato è in caricamento..
        if (this.busy){  return; }
        var request = null;
        //imposto busy su true
        this.busy = true;
        //se parto dalla posizione 0, azzero tutti i valori
        if(start==0){ this.items=[];  this.postData=postData; position=0; this.after=0; }

        if(ADMIN.test){  console.log("url: ");console.log(this.postData+"&onStartQuery="+this.after); }
        request = $http({
          method: "POST",
          url: urlJSON+""+this.postData.urlPost+"?onStartQuery="+this.after,
          data: this.postData,
          isArray: true
        });
        //
        var promise = request.success(function(response) {
          if(angular.isArray(response.data)){
                data=response.data;
                this.page++;
                for (var i = 0; i < data.length; i++) {
                  this.items.push(data[i]);
                }   console.log(this.items);
                this.after = position=(position)+(data.length);
                this.nextpage=response.nextPage;
          }
          this.busy = false;
        }.bind(this));
  };
  return ListAdmin;
 });

