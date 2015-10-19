var app = angular.module('app');


app.controller('uploadFile', ['$rootScope','$scope', '$http', '$timeout', 'Upload', function ($rootScope, $scope, $http, $timeout,  Upload) {
  $scope.init = function(item,type){


        $scope.upload={
          type:'',
          files:[]
        }
        $scope.fieldItem=item;
        $scope.typeUpload=type;
        $scope.files=[];

        $scope.$watch('field.files', function (files) { 
          console.log(files);
          $scope.formUpload = false;

          //nel caso la scelta è di un singolo file, carico il file e blocco lo script
          if (files != null) {
            if (!files.length) {
              $timeout(function () {
                $scope.files.push(files);
                uploadUsingUpload($scope.files[0]);
              });
              return;
            }

            //nel caso invece posso selezionare piu elementi aggiungo alla lista i file e gli carico immediatamente
            for (var i = 0; i < files.length; i++) {
              $scope.errorMsg = null;
              (function (f) {
                if (!f.$error) {
                     $scope.files.push(f);
                     uploadUsingUpload(f);
                }
              })(files[i]);
            }
          }
        });


        $scope.chunkSize = 100000;
        function uploadUsingUpload(file) {

          console.log("upload:");
          console.log($scope.fieldItem);
          file.upload = Upload.upload({
            url: urlFUNCTION +"upload.php"+ $scope.getReqParams(),
            headers: {
              'optional-header': 'header-value'
            },
            fields: {
              idUserSession: '',
              typeUpload: $scope.typeUpload,
              type: $scope.fieldItem.type,
              id: $scope.fieldItem.id
            },
            file: file,
          });

          file.upload.then(function (response) {
            $timeout(function () {
              file.result = response.data;
            });
          }, function (response) {
            if (response.status > 0)
              $scope.errorMsg = response.status + ': ' + response.data;
          });

          file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });

          file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
          });
        }
        $scope.Delete = function (position) {
            $http({ method:"POST", url:urlFUNCTION+"delete.php", data: $scope.files[position].result.data, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                    .success(function(response) {
                          if(response.error==0){
                                $scope.files.splice(position,1);
                          }
                    })
                    .error(function(response) {

                    });
            //f.upload.abort(); f.upload.aborted=true; f=null;
        };




        //confermo l'upload, settando lo stato degli elementi a 2 = confermato, 1 = In attesa di conferma, 3 = foto utenti
        //setto lo stato in base all'utente che sta caricando la foto, e dove
        //es. Utente x ( non ammPage ) carica foto su attività commerciale, lo stato andrà su 1: non appenena confermata andrà su 3
        $scope.Save = function (files) {
            submit = {
              data:$scope.fieldItem,
              files:files
            }
            //su files, posso passare pure i valori del link da youtube
            $http({ method:"POST", url:urlFUNCTION+"uploadSave.php", data: submit, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                    .success(function(response) {
                          if(response.error==0){
                                $rootScope.dialog.close();
                                location.reload();
                          }
                    })
                    .error(function(response) {

                    });
        };


        $scope.getReqParams = function () {
          return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
          '&errorMessage=' + $scope.serverErrorMsg : '';
        };

        angular.element(window).bind('dragover', function (e) {
          e.preventDefault();
        });
        angular.element(window).bind('drop', function (e) {
          e.preventDefault();
        });

        $scope.$watch('validate', function (v) {
          $scope.validateObj = eval('(function(){return ' + v + ';})()');
        });



        $timeout(function () {
          $scope.capture = localStorage.getItem('capture' + version) || 'camera';
          if($scope.typeUpload=="video"){
              $scope.pattern = 'video/*';
              $scope.acceptSelect = 'video/*';

          }else{
              $scope.pattern = 'image/*';
              $scope.acceptSelect = 'image/*';

          }
          $scope.disabled = localStorage.getItem('disabled' + version) == 'true' || false;
          $scope.multiple = localStorage.getItem('multiple' + version) == 'true' || false;
          $scope.allowDir = localStorage.getItem('allowDir' + version) == 'true' || true;
          $scope.validate = localStorage.getItem('validate' + version) || '{size: {max: \'20MB\', min: \'10B\'}, height: {max: 5000}, width: {max: 5000}, duration: {max: \'5m\'}}';
          $scope.keep = localStorage.getItem('keep' + version) == 'true' || false;
          $scope.keepDistinct = localStorage.getItem('keepDistinct' + version) == 'true' || false;
          $scope.$watch('validate+capture+pattern+acceptSelect+disabled+capture+multiple+allowDir+keep+keepDistinct', function () {
            localStorage.setItem('capture' + version, $scope.capture);
            localStorage.setItem('pattern' + version, $scope.pattern);
            localStorage.setItem('acceptSelect' + version, $scope.acceptSelect);
            localStorage.setItem('disabled' + version, $scope.disabled);
            localStorage.setItem('multiple' + version, $scope.multiple);
            localStorage.setItem('allowDir' + version, $scope.allowDir);
            localStorage.setItem('validate' + version, $scope.validate);
            localStorage.setItem('keep' + version, $scope.keep);
            localStorage.setItem('keepDistinct' + version, $scope.keepDistinct);
          });
        });

  }
}]);

