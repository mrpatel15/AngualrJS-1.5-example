policyApp.controller('rulesTypeCtrl', ['$scope', '$http', '$location', '$window', '$rootScope', '$localStorage', 'ApiService', 'ModalService', 'alertService', 'BASE_CONSTS', '$timeout',
    function ($scope, $http, $location, $window, $rootScope, $localStorage, ApiService, ModalService, alertService, BASE_CONSTS, $timeout) {
        $scope.successMsgRt = function () {
            alertService.success($scope.ruleSetElement.id + " Update successfully!");
            $rootScope.hideNotification();
        };
        $scope.selectRuleSetElement = function (getResp) {
            var rlTypeObj;
            $scope.rlTypeObj = getResp.elements;
            if (getResp.elements === null || getResp.elements === undefined) {
                getResp.elements = [];
                getResp.elements.push(rlTypeObj);
                return rlTypeObj;
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
        $rootScope.getRuleSetTypeData = function () {
            var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.RULESTYPE_CONST + '/' + '~';
            ApiService.getAllData(url).then(function (getResp) {
                $scope.elements = $scope.selectRuleSetElement(getResp);
            }, function (error) {
                $rootScope.errorNotification();
            });
        };
        $scope.deleteBtn = function (index) {
            $scope.showConfirmModal(index);
        };
        $scope.undeleteBtn = function (index) {
            var eId = $scope.rlTypeObj[index]
            if (!eId.id.endsWith(BASE_CONSTS.DRAFT_CONST) || eId.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                eId.status = "ACTIVE";
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.RULESTYPE_CONST + '/' + '~';
                ApiService.postAllData(eId, url).then(function () {
                    $rootScope.successNotification();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            }
        };
        $scope.makePostCall = function (index) {
            var eId = $scope.rlTypeObj[index]
            if (eId.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                eId.status = "ACTIVE";
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.RULESTYPE_CONST + '/' + '~' + '/' + eId.id;
                ApiService.deleteAllData(url).then(function () {
                    $scope.rlTypeObj.splice(index, 1);
                    $rootScope.deleteNotification();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            } else {
                eId.status = "INACTIVE";
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.RULESTYPE_CONST + '/' + '~';
                ApiService.postAllData(eId, url).then(function () {
                    $rootScope.successNotification();
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
                    deleteItem: $scope.rlTypeObj[index].name
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
                templateUrl: '/views/rulesTypeModal.html',
                controller: "ruleSetTypeModalCtrl",
                inputs: {
                    ruleSetElement: $scope.rlTypeObj[index],
                    newRuleSet: false
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function () { });
            });
        };
        $scope.addBtn = function () {
            var newRuleSet = {};
            ModalService.showModal({
                templateUrl: '/views/rulesTypeModal.html',
                controller: "ruleSetTypeModalCtrl",
                inputs: {
                    ruleSetElement: newRuleSet,
                    newRuleSet: true
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function () {
                    $scope.rlTypeObj.push(newRuleSet);
                });
            });
        };
        $rootScope.getRuleSetTypeData();
    }
]);
