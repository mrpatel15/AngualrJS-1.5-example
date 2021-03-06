policyApp.controller('attributeCtrl', ['$scope', '$http', '$location', '$window', '$localStorage', 'ApiService', 'ModalService', 'alertService', 'BASE_CONSTS', '$timeout', '$rootScope',
    function ($scope, $http, $location, $window, $localStorage, ApiService, ModalService, alertService, BASE_CONSTS, $timeout, $rootScope) {
        $scope.selectAttrElement = function (getResp) {
            var attrObj;
            $scope.attrObj = getResp.elements;
            if (getResp.elements === null || getResp.elements === undefined) {
                getResp.elements = [];
                getResp.elements.push(attrObj);
                return attrObj;
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
        $scope.getAttrData = function () {
            var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.ATTR_CONST + '/' + '~';
            ApiService.getAllData(url).then(function (getResp) {
                $scope.elements = $scope.selectAttrElement(getResp);
            }, function (error) {
                $rootScope.errorNotification();
            });
        };
        $scope.deleteBtn = function (index) {
            $scope.showConfirmModal(index);
        };
        $scope.undeleteBtn = function (index) {
            var eId = $scope.attrObj[index]
            if (!eId.id.endsWith(BASE_CONSTS.DRAFT_CONST) || eId.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                eId.status = "ACTIVE";
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.ATTR_CONST + '/' + '~';
                ApiService.postAllData(eId, url).then(function () {
                    $rootScope.successNotification();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            }
        };
        $scope.makePostCall = function (index) {
            var eId = $scope.attrObj[index]
            if (eId.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.ATTR_CONST + '/' + '~' + '/' + eId.id;
                ApiService.deleteAllData(url).then(function () {
                    $scope.attrObj.splice(index, 1);
                    $rootScope.deleteNotification();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            } else {
                eId.status = "INACTIVE";
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.ATTR_CONST + '/' + '~';
                ApiService.postAllData(eId, url).then(function () {
                    $rootScope.infoNotification();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            }
        }
        $scope.showConfirmModal = function (index) {
            ModalService.showModal({
                templateUrl: 'views/confirmModal.html',
                controller: "confirmModalCtrl",
                inputs: {
                    deleteItem: $scope.attrObj[index].name
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
        $scope.editBtn = function (index) {
            ModalService.showModal({
                templateUrl: '/views/attrModal.html',
                controller: "attrModalCtrl",
                inputs: {
                    attrElement: $scope.attrObj[index],
                    newAttr: false
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function () { });
            });
        };
        $scope.addBtn = function (index) {
            var newAttr = {};
            ModalService.showModal({
                templateUrl: '/views/attrModal.html',
                controller: "attrModalCtrl",
                inputs: {
                    attrElement: newAttr,
                    newAttr: true
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function () {
                    $scope.attrObj.push(newAttr);
                });
            });
        };
        $scope.getAttrData();
    }
]);
