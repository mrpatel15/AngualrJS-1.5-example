policyApp.controller('configurationCtrl', ['$scope', '$http', '$location', '$window', '$localStorage', 'ApiService', 'ModalService', 'alertService', 'BASE_CONSTS', '$timeout', '$rootScope',
    function ($scope, $http, $location, $window, $localStorage, ApiService, ModalService, alertService, BASE_CONSTS, $timeout, $rootScope) {
        $scope.fields = [];
        $scope.editText = false;
        $scope.statusTypes = [{
            id: 'ACTIVE',
            name: 'ACTIVE'
        }, {
            id: 'INACTIVE',
            name: 'INACTIVE'
        }];
        $scope.selectConfigElement = function (getResp) {
            var dataObj;
            if (getResp.elements === null || getResp.elements === undefined) {
                getResp.elements = [];
                getResp.elements.push(dataObj);
            }
            var element = null;
            if (element != null) {
                return element;
            }
            angular.forEach(getResp.elements, function (el, index) {
                if (el.id == "re-config_draft") {
                    element = el;
                    return;
                } else if (el.id == "re-config") {
                    element = el;
                    return;
                }
            });
            return element;
        };
        $scope.getConfigData = function () {
            var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.CONF_CONST + '/' + '~';
            ApiService.getAllData(url).then(function (getResp) {
                $scope.elements = $scope.selectConfigElement(getResp);
                if ($scope.elements != null && $scope.elements.properties != null) {
                    $scope.obj = $scope.elements.properties.entries;
                }
            }, function (error) {
                $rootScope.errorNotification();
            });
        };
        $scope.editEntry = function () {
            $scope.editText = true;
        };
        $scope.cancelInput = function (index) {
            $scope.fields.splice(index, 1);
        };
        $scope.addEntry = function () {
            $scope.editMode = true;
            var newEntry = {};
            $scope.fields.push(newEntry);
        };
        $scope.backBtn = function () {
            $scope.editText = false;
            $scope.fields = [];
            $scope.getAllData();
        };
        $scope.removeEntry = function (index) {
            $scope.showConfirmModal(index);
        };
        $scope.showConfirmModal = function (index) {
            ModalService.showModal({
                templateUrl: 'views/confirmModal.html',
                controller: "confirmModalCtrl",
                inputs: {
                    deleteItem: $scope.obj[index].key
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result === 'Yes') {
                        $rootScope.deleteNotification();
                        $scope.obj.splice(index, 1);
                    }
                });
            });
        };
        $scope.saveField = function () {
            var duplicate = false;
            angular.forEach($scope.obj, function (entry, index) {
                angular.forEach($scope.fields, function (newEntry, index) {
                    if (newEntry.key == entry.key) {
                        newEntry.duplicate = true;
                        duplicate = true;
                    }
                });
            });
            if (!duplicate) {
                var allEntries;
                if ($scope.fields === undefined || $scope.fields === null) {
                    allEntries = $scope.obj;
                } else if ($scope.obj === undefined || $scope.obj === null) {
                    allEntries = $scope.fields;
                } else {
                    allEntries = $scope.obj.concat($scope.fields);
                }
                $scope.elements.properties = {};
                $scope.elements.type = "configurationModel";
                $scope.elements.properties.entries = allEntries;
                if (!$scope.elements.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                    $scope.elements.id = $scope.elements.id + BASE_CONSTS.DRAFT_CONST;
                }
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.CONF_CONST + '/' + '~';
                ApiService.postAllData($scope.elements, url).then(function () {
                    $scope.obj = $scope.elements.properties.entries;
                    $scope.fields = [];
                    $scope.editText = false;
                    $rootScope.successNotification();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            }
        };
        $('.btn-save').on('click', function () {
            var $this = $(this);
            $this.button('loading');
            setTimeout(function () {
                $this.button('reset');
            }, 5000);
        });
        $scope.getConfigData();
    }
]);
