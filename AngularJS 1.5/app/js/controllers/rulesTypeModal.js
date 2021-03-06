policyApp.controller('ruleSetTypeModalCtrl', ['$scope', 'close', '$window', '$rootScope', '$localStorage', 'ruleSetElement', 'newRuleSet', 'ApiService', 'alertService', 'BASE_CONSTS', '$element', '$timeout',
    function ($scope, close, $window, $rootScope, $localStorage, ruleSetElement, newRuleSet, ApiService, alertService, BASE_CONSTS, $element, $timeout) {
        $scope.statusTypes = [{
            id: 'ACTIVE',
            name: 'ACTIVE'
        }, {
            id: 'INACTIVE',
            name: 'INACTIVE'
        }];
        $scope.ruleSetElement = {
            stopRuleEvaluationOnSuccess: true,
            stopRuleEvaluationOnFailure: true,
            stopRuleEvaluationOnError: true,
            stopRuleSetExecutionOnSuccess: true,
            stopRuleSetExecutionOnFailure: true,
            stopRuleSetExecutionOnError: true
        };
        $scope.newRuleSet = newRuleSet;
        $scope.ruleSetElement = ruleSetElement;
        if (!$scope.newRuleSet) {
            $scope.entries = $scope.ruleSetElement.properties.entries;
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
            alertService.success($scope.ruleSetElement.id + " Update successfully!");
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
                if (newRuleSet) {
                    $scope.ruleSetElement.properties = {};
                    $scope.ruleSetElement.type = "ruleSetTypeModel";
                }
                $scope.ruleSetElement.properties.entries = allEntries;
                if (!$scope.ruleSetElement.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
                    $scope.ruleSetElement.id = $scope.ruleSetElement.id + BASE_CONSTS.DRAFT_CONST;
                }
                var url = BASE_CONSTS.ELEMENT_CONST + '/' + $localStorage.selectedId + '/' + $localStorage.selectedVersion + '/' + BASE_CONSTS.RULESTYPE_CONST + '/' + '~';
                ApiService.postAllData($scope.ruleSetElement, url).then(function () {
                    $scope.successMsg();
                }, function (error) {
                    $rootScope.errorNotification();
                });
            }
        };
    }
]);
