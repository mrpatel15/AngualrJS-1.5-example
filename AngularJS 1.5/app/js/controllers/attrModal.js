policyApp.controller('attrModalCtrl', ['$scope', 'close', '$window', '$localStorage', 'attrElement', 'newAttr', 'ModalService', 'ApiService', 'alertService', 'BASE_CONSTS', '$element', '$timeout', '$rootScope',
    function ($scope, close, $window, $localStorage, attrElement, newAttr, ModalService, ApiService, alertService, BASE_CONSTS, $element, $timeout, $rootScope) {
        $scope.attrTypes = [{
            id: 'STATIC',
            name: 'STATIC'
        }, {
            id: 'JXPATH',
            name: 'JXPATH'
        }, {
            id: 'LDAP',
            name: 'LDAP'
        }, {
            id: 'CACHE',
            name: 'CACHE'
        }, {
            id: 'SPRING',
            name: 'SPRING'
        }];
        $scope.valueTypes = [{
            id: 'SINGLE',
            name: 'SINGLE'
        }, {
            id: 'MULTI',
            name: 'MULTI'
        }];
        $scope.statusTypes = [{
            id: 'ACTIVE',
            name: 'ACTIVE'
        }, {
            id: 'INACTIVE',
            name: 'INACTIVE'
        }];
        $scope.attrElement = {
            loggable: true
        };
        $scope.newAttr = newAttr;
        $scope.attrElement = attrElement;
        if (!$scope.newAttr) {
            $scope.entries = $scope.attrElement.properties.entries;
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
            alertService.success($scope.attrElement.id + " Update successfully!");
            $element.modal('hide');
            close(null, 500);
            $rootScope.successNotification();
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
                if (newAttr) {
                    $scope.attrElement.properties = {};
                    $scope.attrElement.type = "attributeModel";
                }
                $scope.attrElement.properties.entries = allEntries;
                if (!$scope.attrElement.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                    $scope.attrElement.id = $scope.attrElement.id + BASE_CONSTS.DRAFT_CONST;
                }
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.ATTR_CONST + '/' + '~';
                ApiService.postAllData($scope.attrElement, url).then(function () {
                    $scope.successMsg();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            }
        };
    }
]);
