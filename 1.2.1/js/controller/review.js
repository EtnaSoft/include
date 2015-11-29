 var app = angular.module('app');

app.controller('Review', function( $scope, ReviewList) {
  $scope.init = function(typePage,idPage,UserId,cosa,onStartQuery,limitItemList,orderBy){
      $scope.postData={
        typeView : 'review',
        typePage : typePage,
        idPage : idPage,
        UserId : UserId,
        cosa : cosa,
        onStartQuery : onStartQuery,
        limitItemList : limitItemList,
        orderBy : orderBy,
      };
      $scope.list = new ReviewList();

      $scope.getNumber = function(num) {
          num=parseInt(num);
          return new Array(num);
      }
      $scope.$watch('postData.cosa', function() {
              $scope.list.nextPage(0,urlJSON+"Comments.php?idUserLogin="+$scope.postData.UserId+"&typePage="+$scope.postData.typePage+"&idPage="+$scope.postData.idPage+"&cosa="+$scope.postData.cosa+"&orderBy="+$scope.postData.orderBy+"&limitItemList="+$scope.postData.limitItemList);
      }, true);

      $scope.$watch('postData.typePage', function() {
       //       $scope.reviewlist.nextPage(0,urlJSON+"Discovery.php?typePage="+$scope.postData.typePage+"&idPage="+$scope.postData.idPage+"&UserId="+$scope.postData.UserId+"&orderBy="+$scope.postData.orderBy+"&limitItemList="+$scope.postData.limitItemList);
      }, true);
  }
});
app.factory('ReviewList', function($http, $q) {
  position=0;
  var deferredAbort  = $q.defer();
  this.url="";
  var ReviewList = function() {
    this.items=[];
    this.busy = false;
    this.after = position;
  };

  ReviewList.prototype.nextPage = function(start,url) {
        //se lo stato è in caricamento..
        if (this.busy){  return; }

        var request = null;

        //imposto busy su true
        this.busy = true;
        //se parto dalla posizione 0, azzero tutti i valori
        if(start==0){ this.url=url; position=0; this.after=0; this.items=[]; }
        request = $http({method: "GET", url: this.url+"&onStartQuery="+this.after, isArray: true, timeout: deferredAbort.promise  });
        var promise = request.success(function(response) {
          data=response.data;
          if(response.count > 0){
              for (var i = 0; i < data.length; i++) {
                this.items.push(data[i]);
              }

              this.after = position=(position)+(data.length);
          }
          this.busy = false;
        }.bind(this));
  };




  ReviewList.prototype.Delete = function(position) {
        var self = this;
        if(!confirm("Confermi?")){ return }
        $http({ method:"POST", url:urlFUNCTIONV+"delete.php", data: {idType: this.items[position].idCommento, type: 'review'}, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
          .success(function(response){
             if(response.error==0){
                self.items.splice(position, 1);
             }else{
                /*$('#windows').removeClass('loading');
                $('#windows').addClass('show');
                $('#windows').html(response.html);  */
             }
         })
        .error(function(){
             /* $('#windows').removeClass('loading');
             $('#windows').addClass('show');
             $('#windows').html('show'); */
             ////alert("errore");
        });
  };


  return ReviewList;
});










