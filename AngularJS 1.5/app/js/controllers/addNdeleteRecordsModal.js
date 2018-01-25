policyApp.controller('addNdeleteRecordsModalCtrl', ['$scope', 'close', '$filter', '$element', '$window', '$timeout', '$rootScope', '$localStorage', 'modalType', 'selectedItem', 'items', 'ModalService', 'ApiService', 'alertService', 'BASE_CONSTS',
    function ($scope, close, $filter, $element, $window, $timeout, $rootScope, $localStorage, modalType, selectedItem, items, ModalService, ApiService, alertService, BASE_CONSTS) {
        $scope.modalType = modalType;
        $scope.selectedItem = selectedItem;
        $scope.items = items;
        $scope.dataSetTextArea = false;
        $scope.close = function (result) {
            close(result, 500);
            $element.modal('hide');
        };
        $scope.displayFileContents = function (contents) {
            console.log(contents);
            $scope.dataSetTextArea = contents;
        };
        $scope.step = 1;
        $scope.nextStep = function () {
            $scope.step++;
        }
        $scope.prevStep = function () {
            $scope.step--;
        }
        $scope.dataSetOperation = function ($event, idx) {
            var operation = "add";
            var dataSetJson;
            var arrUnique = unique($scope.dataSetTextArea);
            if ($event.currentTarget.id == "btnAdd") {
                operation = "add";
                $scope.dataSetValidation($scope.dataSetTextArea);
                dataSetJson = {
                    id: $scope.selectedItem,
                    data: $scope.dataSetTextArea
                };
                $scope.makePostCall(dataSetJson, operation);
            } else if ($event.currentTarget.id == "btnDelete") {
                operation = "delete";
                $scope.dataSetValidation($scope.dataSetTextArea);
                dataSetJson = {
                    id: $scope.selectedItem,
                    data: $scope.dataSetTextArea
                };
                $scope.makePostCall(dataSetJson, operation);
            }
            return false;
        };
        $scope.dataSetValidation = function (data) {
            if (data == null || data.length < 1 || data == undefined) {
                return;
            }
            for (var i = 0; i < data.length; i++) {
                data[i] = data[i].trim();
            }
            return data;
        };
        var unique = function (origArr) {
            var newArr = [],
                origLen = origArr.length,
                found, x, y;
            for (x = 0; x < origLen; x++) {
                found = undefined;
                for (y = 0; y < newArr.length; y++) {
                    if (origArr[x] === newArr[y]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    newArr.push(origArr[x]);
                }
            }
            return newArr;
        };
        $scope.makePostCall = function (dataSetJson, operation) {
            $scope.existingElementsCount = 0;
            angular.forEach(dataSetJson.data, function (item, index) {
                var tempVar = $filter('filter')($scope.items, item);
                if (tempVar != undefined && tempVar != null && tempVar.length >= 1) {
                    $scope.existingElementsCount++;
                    tempVar == null;
                }
            });
            var url = BASE_CONSTS.DATASET_CONST + '/' + $localStorage.selectedId + '/' + $scope.selectedItem + '/' + operation;
            ApiService.postAllData(dataSetJson, url).then(function () {
                $rootScope.fetchUpdatedList();
            }, function (error) {
                $rootScope.fetchUpdatedList();
                $rootScope.errorNotification();
            });
            $(".progress-bar").animate({
                width: "100%"
            }, 2000);
        };
    }
]);
