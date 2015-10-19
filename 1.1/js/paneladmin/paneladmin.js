var app = angular.module('app');

app.controller('panelAdmin', function($rootScope, $scope, $window, $http,$routeParams) {
    $rootScope.addNew=null;
    $scope.menu=[];
    $scope.breadcrumb=[];
    $scope.include={
      url:'view/user/paneladmin/home.php',
      name:'Pannello di controllo'
    };


    $scope.$on('$routeChangeSuccess', function() {
        $scope.breadcrumb=[];
        var namePage=$rootScope.infoPagina.name;
        if(namePage!="Dashboard" && namePage!="home" && namePage!=""){ $scope.breadcrumb.push({name:"dashboard",url:'paneladmin/#/dashboard'}); }

        //if($routeParams.id){ namePage="Modifica "+$rootScope.infoPagina.name; }
        if($routeParams.id=="new"){
            $scope.breadcrumb.push({name:$rootScope.infoPagina.name,url:'paneladmin/#/'+$rootScope.infoPagina.type});
            $scope.breadcrumb.push({name:"nuovo",url:''});
            $rootScope.infoPagina.title="Nuovo";
            $rootScope.addNew=$rootScope.infoPagina.type;
            $rootScope.urlNew='view/user/mypages/new/'+$rootScope.infoPagina.type+'.php';
            $rootScope.infoPagina.id="";
            $rootScope.infoPagina.typeInfoPage="";
            $rootScope.addNewUrl=urlFUNCTION+"new/"+$rootScope.infoPagina.type+".php";
        }else if($routeParams.id){
            $scope.breadcrumb.push({name:$rootScope.infoPagina.type,url:'paneladmin/#/'+$rootScope.infoPagina.type});
            $scope.breadcrumb.push({name:"modifica",url:'paneladmin/#/'+$rootScope.infoPagina.type+"/"+$routeParams.id});
            $rootScope.infoPagina.id=$routeParams.id;
            $rootScope.infoPagina.typeInfoPage=$routeParams.page;
            $rootScope.addNew=$rootScope.infoPagina.type;
            $rootScope.urlNew='view/user/mypages/new/'+$rootScope.infoPagina.type+'.php';
            $rootScope.addNewUrl=urlFUNCTION+"new/"+$rootScope.infoPagina.type+".php";
        }else{
            $rootScope.infoPagina.title=namePage;
            $scope.breadcrumb.push({name:$rootScope.infoPagina.name,url:'paneladmin/#/'+$rootScope.infoPagina.type});
        }
        if($routeParams.page){
            $scope.breadcrumb.push({name:$routeParams.page,url:'paneladmin/#/'+$rootScope.infoPagina.type+"/"+$routeParams.id+"/"+$routeParams.page});
        }
    });

    $scope.getMenu = function(){
       $http({method: "POST", url: urlJSON+"paneladmin/menu.php",data: $scope.postData , headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
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

    $scope.getMenu();

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

