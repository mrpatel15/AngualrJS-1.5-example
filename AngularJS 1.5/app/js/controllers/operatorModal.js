policyApp.controller('optModalCtrl', ['$scope', 'close', '$window', '$localStorage', 'optElement', 'newOpt', 'ModalService', 'ApiService', 'alertService', 'BASE_CONSTS', '$element', '$timeout', '$rootScope',
    function ($scope, close, $window, $localStorage, optElement, newOpt, ModalService, ApiService, alertService, BASE_CONSTS, $element, $timeout, $rootScope) {
        $scope.statusTypes = [{
            id: 'ACTIVE',
            name: 'ACTIVE'
        }, {
            id: 'INACTIVE',
            name: 'INACTIVE'
        }];
        $scope.newOpt = newOpt;
        $scope.optElement = optElement;
        if (!$scope.newOpt) {
            $scope.entries = $scope.optElement.properties.entries;
        }
        $scope.fields = [];
        $scope.editText = false;
        $scope.removeEntry = function (index) {
            $scope.entries.splice(index, 1);
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
        $scope.successMsg = function () {
            alertService.success($scope.optElement.id + " Update successfully!");
            $element.modal('hide');
            close(null, 500);
            $rootScope.hideNotification();
        };
        $scope.saveField = function () {
            var duplicate = false;
            angular.forEach($scope.entries, function (entry, index) {
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
                    allEntries = $scope.entries;
                } else if ($scope.entries === undefined || $scope.entries === null) {
                    allEntries = $scope.fields;
                } else {
                    allEntries = $scope.entries.concat($scope.fields);
                }
                if (newOpt) {
                    $scope.optElement.properties = {};
                    $scope.optElement.type = "operatorModel";
                }
                $scope.optElement.properties.entries = allEntries;
                if (!$scope.optElement.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                    $scope.optElement.id = $scope.optElement.id + BASE_CONSTS.DRAFT_CONST;
                }
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.OPER_CONST + '/' + '~';
                ApiService.postAllData($scope.optElement, url).then(function () {
                    $scope.successMsg();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            }
        };
    }
]);
