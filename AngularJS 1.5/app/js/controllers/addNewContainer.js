policyApp.controller('addNewContainerCtrl', ['$scope', '$http', '$window', 'close', '$localStorage', 'ApiService', 'alertService', '$element', '$timeout', '$rootScope',
 function ($scope, $http, $window, close, $localStorage, ApiService, alertService, $element, $timeout, $rootScope) {
    $scope.statusTypes = [{
        id: 'ACTIVE',
        name: 'ACTIVE'
    }, {
        id: 'INACTIVE',
        name: 'INACTIVE'
    }];
    $scope.verStatusTypes = [{
        id: 'ACTIVE',
        name: 'ACTIVE'
    }, {
        id: 'INACTIVE',
        name: 'INACTIVE'
    }];
    $scope.checkContainerLength = false;
    $scope.addNewContainerFlag = true;
    $scope.addNewVersionFlag = false;
    $scope.selectContainerFlag = false;
    $scope.containerId = null;
    $scope.verSuccessMsg = function () {
        alertService.success("Version created successfully!");
        $element.modal('hide');
        close(null, 500);
        $rootScope.hideNotification();
    };
    $scope.selectContNotification = function () {
        alertService.info("Container created successfully!");
        $rootScope.hideNotification();
    };
    $scope.cancelBtnModal = function () {
        $element.modal('hide');
        close(null, 500);
        $rootScope.hideNotification();
        $rootScope.getAllData();
    };
    $rootScope.addContainer = function () {
        $scope.addNewContainerFlag = true;
        $scope.addNewVersionFlag = false;
        $scope.selectContainerFlag = false;
        var url = 'container';
        ApiService.postAllData($scope.contObj, url)
            .then(function () {
                $scope.containerId = $scope.contObj.id;
                $scope.getContainerList();
            }, function (error) {
                $rootScope.errorNotification();
            });
    }
    $scope.getContainerList = function () {
        $scope.addNewContainerFlag = false;
        $scope.selectContainerFlag = true;
        $scope.addNewVersionFlag = false;
        $scope.selectContNotification();
        var url = 'container';
        ApiService.getAllData(url)
            .then(function (getResponse) {
                $scope.containerData = getResponse.containers;
            }, function (error) {
                $rootScope.errorNotification();
            });
    };
    $scope.addVersionNotification = function () {
        alertService.info("Please add Version!");
        $rootScope.hideNotification();
    };
    $scope.addNewVersion = function () {
        $scope.addNewContainerFlag = false;
        $scope.selectContainerFlag = false;
        $scope.addNewVersionFlag = true;
        $scope.addVersionNotification();
        $scope.containerName = $scope.containerData[0].name;
        $localStorage.selectedId = $scope.containerId;
    }
    $scope.addVersion = function () {
        var url = 'version' + '/' + $localStorage.selectedId;
        ApiService.postAllData($scope.verObj, url)
            .then(function () {
                $scope.containerVersion = $scope.verObj.version;
                $rootScope.getAllData();
                $scope.verSuccessMsg();
                $scope.addVersionNotification();
            }, function (error) {
                $rootScope.errorNotification();
            });
    };
}]);
