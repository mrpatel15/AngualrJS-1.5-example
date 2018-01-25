policyApp.controller('policyRuleCtrl', ['$scope', '$filter', '$location', '$window', '$http', '$localStorage', '$sessionStorage', 'ApiService', 'ModalService', 'alertService', '$rootScope', '$timeout', 'notifications', '$state', 'RulesService',
    function ($scope, $filter, $location, $window, $http, $localStorage, $sessionStorage, ApiService, ModalService, alertService, $rootScope, $timeout, notifications, $state, RulesService) {
        $scope.tabs = [{
            title: 'Lists',
            state: 'lists'
        }, {
            title: 'Rules',
            state: 'rules'
        }];

        RulesService.init();

        $scope.checkContainerLength = false;
        $rootScope.hideCancelBtn = false;
        $scope.selectedContainerId = RulesService.selectedContainerId;
        $scope.selectedContainerVersion = RulesService.selectedContainerVersion;

        $scope.showError = function () {
            notifications.showError({
                message: 'You are not authorized to access this page.',
                hideDelay: 2000, //ms
                hide: true
            });
        };
        $scope.showWarning = function () {
            notifications.showWarning({
                message: 'Error! Looks like something has gone wrong. Please try again later.',
                hideDelay: 2000, //ms
                hide: true
            });
        };
        $scope.showSuccess = function () {
            notifications.showSuccess({
                message: 'You have successfully logged in.',
                hideDelay: 2000, //ms
                hide: true
            });
        };
        $rootScope.hideNotification = function () {
            $timeout(function () {
                alertService.hide();
            }, 2000);
        };
        $rootScope.deleteNotification = function () {
            $rootScope.scroll();
            alertService.danger("Deleted successfully!");
            $rootScope.hideNotification();
        };
        $rootScope.successNotification = function () {
            $rootScope.scroll();
            alertService.success("Updated successfully!");
            $rootScope.hideNotification();
        };
        $rootScope.infoNotification = function () {
            $rootScope.scroll();
            alertService.info("Changed status successfully!");
            $rootScope.hideNotification();
        };
        $rootScope.errorNotification = function () {
            $scope.showWarning();
            //        $rootScope.scroll();
            //        alertService.danger("Error! Looks like something has gone wrong. Please try again later.");
            //        $rootScope.hideNotification();
        };
        $rootScope.ForbiddenError = function () {
            $scope.showError();
            //        $rootScope.scroll();
            //        alertService.danger("You are not authorized to access this page.");
            //        $rootScope.hideNotification();
        };
        $rootScope.scroll = function () {
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        };
        $rootScope.selectedContainer = function (getResponse) {
            if (getResponse.containers != undefined && getResponse.containers.length == 0) {
                $rootScope.addNewContainerVersion();
                $rootScope.hideCancelBtn = true;
            }
            else {
                $rootScope.selectContainerVersion($scope.containerIdVersionArray);
            }
        };
        $rootScope.getAllData = function () {
            var url = 'container';
            ApiService.getAllData(url)
                .then(function (getResponse) {
                    $scope.containerIdVersionArray = [];
                    angular.forEach(getResponse.containers, function (container, index) {
                        var versionNbrs = [];
                        angular.forEach(container.versions, function (version, index) {
                            versionNbrs.push(version.version);
                        });
                        var idVerObject = {
                            containerId: container.id,
                            containerName: container.name,
                            versions: versionNbrs
                        };
                        $scope.containerIdVersionArray.push(idVerObject);
                    });
                    if ($scope.isLocalStorageEmpty()) {
                        $rootScope.selectedContainer(getResponse);
                    }
                    else {
                        var validContainerId = false;
                        var validContainerVersion = false;
                        angular.forEach(getResponse.containers, function (container, index) {
                            if (container.id == $localStorage.selectedId) {
                                validContainerId = true;
                            }
                            angular.forEach(container.versions, function (version, index) {
                                if (validContainerId && version.version == $localStorage.selectedVersion) {
                                    validContainerVersion = true;
                                }
                            });
                        });
                        if (validContainerId && validContainerVersion) {
                            RulesService.init($localStorage.selectedId, $localStorage.selectedVersion);
                            $scope.selectedItem = $filter('filter')($scope.containerIdVersionArray, RulesService.selectedContainerId);
                            $state.go($scope.tabs[0].state);
                        }
                        else {
                            $localStorage.$reset();
                            $rootScope.selectedContainer(getResponse);
                        }
                    }
                }, function (error) {
                    $localStorage.$reset();
                    $rootScope.errorNotification();
                });
        };
        //    $rootScope.selectContVersionNotification = function() {
        //        alertService.info("Please select Container and Version!");
        //    };
        $rootScope.selectContainerVersion = function (containerIdVersionArray) {
            $scope.checkContainerLength = true;
            ModalService.showModal({
                templateUrl: 'views/selectContainerVersion.html',
                controller: "selectedContainerVersionCtrl",
                inputs: {
                    containerIdVersionArray: containerIdVersionArray
                }
            })
                .then(function (modal) {
                    modal.element.modal();
                    //                $rootScope.selectContVersionNotification();
                    modal.close.then(function () {
                        $scope.selectedItem = $filter('filter')($scope.containerIdVersionArray, RulesService.selectedContainerId);
                        $stateService.go($scope.tabs[0].state);
                    });
                });
        };
        $rootScope.addNewContNotification = function () {
            alertService.info("No Container available. Please add new Container!");
            $rootScope.hideNotification();
        };
        $rootScope.addNewContainerVersion = function () {
            $scope.checkContainerLength = false;
            ModalService.showModal({
                templateUrl: 'views/addNewContainer.html',
                controller: "addNewContainerCtrl"
            })
                .then(function (modal) {
                    modal.element.modal();
                    $rootScope.addNewContNotification();
                    modal.close.then(function () { });
                });
        };
        $scope.isContainerSelected = function () {
            $rootScope.getAllData();
        };
        $scope.isLocalStorageEmpty = function () {
            if ($localStorage.selectedId === null || $localStorage.selectedVersion === null || $localStorage.selectedId === undefined || $localStorage.selectedVersion === undefined || $localStorage.selectedId.trim() == "" || $localStorage.selectedVersion.trim() == "") {
                return true;
            }
            else {
                return false;
            }
        };
        $scope.changeContainerValue = function (id, version) {
            $scope.selectedItem = $filter('filter')($scope.containerIdVersionArray, id);
            var children = $filter('filter')($scope.selectedItem[0].versions, version);
            if (children.length == 1) {                
                RulesService.init(id, version);
                //$rootScope.getAllData();
            }
        };
      

        $('.logout-btn').on('click', function () {
            var $this = $(this);
            $this.button('loading');
            setTimeout(function () {
                $this.button('reset');
            }, 5000);
        });
        $scope.isContainerSelected();
        //     sessionStorage.clear();
        //     $localStorage.$reset();
    }]);

