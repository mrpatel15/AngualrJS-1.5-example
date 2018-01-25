policyApp.controller('operatorsCtrl', ['$scope', '$http', '$location', '$window', '$localStorage', 'ApiService', 'ModalService', 'alertService', 'BASE_CONSTS', '$timeout', '$rootScope',
    function ($scope, $http, $location, $window, $localStorage, ApiService, ModalService, alertService, BASE_CONSTS, $timeout, $rootScope) {
        $scope.selectOptElement = function (getResp) {
            var optObj;
            $scope.optObj = getResp.elements;
            if (getResp.elements === null || getResp.elements === undefined) {
                getResp.elements = [];
                getResp.elements.push(optObj);
            }
            angular.forEach(getResp.elements, function (el, index) {
                var draftId = el.id + BASE_CONSTS.DRAFT_CONST;
                angular.forEach(getResp.elements, function (el1, index) {
                    if (draftId == el1.id) {
                        el.hideRow = true;
                    }
                });
            });
        };
        $scope.getOptData = function () {
            var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.OPER_CONST + '/' + '~';
            ApiService.getAllData(url).then(function (getResp) {
                $scope.elements = $scope.selectOptElement(getResp);
            }, function (error) {
                $rootScope.errorNotification();
            });
        };
        $scope.deleteBtn = function (index) {
            $scope.showConfirmModal(index);
        };
        $scope.undeleteBtn = function (index) {
            var eId = $scope.optObj[index]
            if (!eId.id.endsWith(BASE_CONSTS.DRAFT_CONST) || eId.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                eId.status = "ACTIVE";
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.OPER_CONST + '/' + '~';
                ApiService.postAllData(eId, url).then(function () {
                    $rootScope.successNotification();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            }
        };
        $scope.showConfirmModal = function (index) {
            ModalService.showModal({
                templateUrl: 'views/confirmModal.html',
                controller: "confirmModalCtrl",
                inputs: {
                    deleteItem: $scope.optObj[index].name
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result === 'Yes') {
                        $scope.makePostCall(index);
                    }
                });
            });
        };
        $scope.makePostCall = function (index) {
            var eId = $scope.optObj[index]
            if (eId.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.OPER_CONST + '/' + '~' + '/' + eId.id;
                ApiService.deleteAllData(url).then(function () {
                    $scope.optObj.splice(index, 1);
                    $rootScope.deleteNotification();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            } else {
                eId.status = "INACTIVE";
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.OPER_CONST + '/' + '~';
                ApiService.postAllData(eId, url).then(function () {
                    $rootScope.infoNotification();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            }
        }
        $scope.editBtn = function (index) {
            ModalService.showModal({
                templateUrl: '/views/operatorModal.html',
                controller: "optModalCtrl",
                inputs: {
                    optElement: $scope.optObj[index],
                    newOpt: false
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function () { });
            });
        };
        $scope.addBtn = function (index) {
            var newOpt = {};
            ModalService.showModal({
                templateUrl: '/views/operatorModal.html',
                controller: "optModalCtrl",
                inputs: {
                    optElement: newOpt,
                    newOpt: true
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function () {
                    $scope.optObj.push(newOpt);
                });
            });
        };
        $scope.getOptData();
    }
]);
