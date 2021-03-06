policyApp.controller('selectedContainerVersionCtrl', [
  '$scope',
  '$http',
  '$window',
  'close',
  '$localStorage',
  'ApiService',
  'RulesService',
  'ModalService',
  'alertService',
  '$element',
  '$timeout',
  '$rootScope',
  '$filter',
  'containerIdVersionArray',
  function (
    $scope,
    $http,
    $window,
    close,
    $localStorage,
    ApiService,
    RulesService,
    ModalService,
    alertService,
    $element,
    $timeout,
    $rootScope,
    $filter,
    containerIdVersionArray
  ) {
    $scope.verStatusTypes = [{
      id: 'ACTIVE',
      name: 'ACTIVE'
    }, {
      id: 'INACTIVE',
      name: 'INACTIVE'
    }];
    $scope.checkContainerLength = false;
    $scope.selectedContainerVersionTemplate = true;
    $scope.addSelectedVersionTemplate = false;
    $scope.selectedContainerId = null;
    $scope.selectedContainerVersion = null;
    $scope.containerIdVersionArray = containerIdVersionArray;

    $scope.displayVersions = function () {
      $scope.selectedItem = $filter('filter')($scope.containerIdVersionArray, $scope.selectedContainerId);
    }
    $scope.selSuccessMsg = function () {
      alertService.success("Selected successfully!");
      $element.modal('hide');
      close(null, 500);
      $rootScope.hideNotification();
    };
    $scope.createVersionNotification = function () {
      alertService.success("New version created successfully!");
      $element.modal('hide');
      close(null, 500);
      $rootScope.hideNotification();
    };
    $scope.selectBtn = function () {
      RulesService.init($scope.selectedContainerId, $scope.selectedContainerVersion);
      $scope.selSuccessMsg();
    }
    $scope.addNewContainerLink = function () {
      $element.modal('hide');
      close(null, 500);
      $rootScope.addNewContainerVersion();
    }
    $scope.showVersionMessages = function () {
      alertService.info("Please add version!");
      $rootScope.hideNotification();
    };
    $scope.addVersionLink = function () {
      $scope.selectedContainerVersionTemplate = false;
      $scope.addSelectedVersionTemplate = true;
      $scope.showVersionMessages();
      $scope.contName = $scope.containerIdVersionArray[0].containerName;
      $localStorage.selectedId = $rootScope.selectedContainerId;
    }
    $scope.addNewVersion = function () {
      var url = 'version' + '/' + $localStorage.selectedId;
      ApiService.postAllData($scope.verObj, url).then(function () {
        $rootScope.getAllData();
        $scope.createVersionNotification();
      }, function (error) {
        $rootScope.errorNotification();
      });
    }
  }]);
