policyApp.controller('ListsController', [
    '$scope',
    '$http',
    '$location',
    '$window',
    '$timeout',
    '$filter',
    '$rootScope',
    '$localStorage',
    'ModalService',
    'ApiService',
    'alertService',
    'BASE_CONSTS',
    function (
        $scope,
        $http,
        $location,
        $window,
        $timeout,
        $filter,
        $rootScope,
        $localStorage,
        ModalService,
        ApiService,
        alertService,
        BASE_CONSTS
    ) {
        $scope.dataExport = false;
        $scope.disableSelect = true;
        $scope.status = true;
        $scope.changeStatus = function () {
            $scope.status = !$scope.status;
        }
        $('.btn-toggle').click(function () {
            $(this).find('.btn').toggleClass('active');
            if ($(this).find('.btn-primary').size() > 0) {
                $(this).find('.btn').toggleClass('btn-primary');
            }
            $(this).find('.btn').toggleClass('btn-default');
        });
        $scope.selectDataSet = function (getResp) {
            var dataType;
            $scope.dataType = getResp.dataSets;
            if (getResp.dataSets === null || getResp.dataSets === undefined) {
                getResp.dataSets = [];
                getResp.dataSets.push(dataType);
            }
        };
        $scope.getDataSet = function () {
            var url = BASE_CONSTS.DATASET_CONST + '/' + $localStorage.selectedId + '/' + '~';
            ApiService.getAllData(url).then(function (getResp) {
                $scope.selectDataSet(getResp);
            }, function (error) {
                $rootScope.errorNotification();
            });
        };
        $rootScope.fetchUpdatedList = function () {
            $scope.fetchDataList();
        }
        $scope.fetchDataList = function () {
            $scope.dataExport = true;
            $scope.disableSelect = false;
            $scope.dataSetTextArea = "";
            var withData = 'with-data';
            var url = BASE_CONSTS.DATASET_CONST + '/' + $localStorage.selectedId + '/' + $scope.selectedItem + '/' + withData;
            ApiService.getAllData(url).then(function (getList) {
                $scope.items = getList.dataSets[0].data;
                $scope.getArray = [];
                angular.forEach($scope.items, function (item, index) {
                    var tempVar = {
                        a: item
                    };
                    $scope.getArray.push(tempVar);
                });
                $scope.search();
            }, function (error) {
                $rootScope.errorNotification();
            });
            $scope.currentPage = 0;
            console.log($scope.currentPage);
        };
        var sortingOrder = 'dataList';
        $scope.sortingOrder = sortingOrder;
        $scope.pageSizes = [25, 50, 100, 200];
        $scope.reverse = false;
        $scope.filteredItems = [];
        $scope.itemsPerPage = 25;
        $scope.pagedItems = [];
        $scope.currentPage = 0;
        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };
        $scope.search = function () {
            $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                if (searchMatch(item, $scope.query)) return true;
                return false;
            });
            if ($scope.sortingOrder !== '') {
                $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
            }
            $scope.currentPage = 0;
            $scope.groupToPages();
        };
        $scope.perPage = function () {
            $scope.groupToPages();
        };
        $scope.groupToPages = function () {
            $scope.pagedItems = [];
            var newData;
            if ($scope.items === null || $scope.items === undefined) {
                $scope.pagedItems.push(newData);
            } else {
                for (var i = 0; i < $scope.filteredItems.length; i++) {
                    if (i % $scope.itemsPerPage === 0) {
                        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
                    } else {
                        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                    }
                }
            }
            $scope.currentPage = 0;
        };
        $scope.deleteSingleItem = function (index) {
            var operation = "delete";
            var dataSetJson;
            var itemToDelete = $scope.pagedItems[$scope.currentPage][index];
            dataSetJson = {
                id: $scope.selectedItem,
                data: itemToDelete
            };
            $scope.showConfirmModal(dataSetJson, operation, index);
        };
        $scope.showConfirmModal = function (dataSetJson, operation, index) {
            ModalService.showModal({
                templateUrl: 'views/confirmModal.html',
                controller: "confirmModalCtrl",
                inputs: {
                    deleteItem: dataSetJson.data
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result === 'Yes') {
                        $scope.doPostCall(dataSetJson, operation);
                    }
                });
            });
        };
        $scope.doPostCall = function (dataSetJson, operation) {
            var url = BASE_CONSTS.DATASET_CONST + '/' + $localStorage.selectedId + '/' + $scope.selectedItem + '/' + operation;
            ApiService.postAllData(dataSetJson, url).then(function () {
                $rootScope.deleteNotification();
                $scope.fetchDataList();
                $scope.search();
            }, function (error) {
                $scope.fetchDataList();
                $rootScope.errorNotification();
            });
        };
        $scope.addRecordsModal = function () {
            ModalService.showModal({
                templateUrl: 'views/addNdeleteRecordsModal.html',
                controller: "addNdeleteRecordsModalCtrl",
                inputs: {
                    modalType: 'add',
                    selectedItem: $scope.selectedItem,
                    items: $scope.items
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function () { });
            });
        };
        $scope.deleteRecordsModal = function () {
            ModalService.showModal({
                templateUrl: 'views/addNdeleteRecordsModal.html',
                controller: "addNdeleteRecordsModalCtrl",
                inputs: {
                    modalType: 'delete',
                    selectedItem: $scope.selectedItem,
                    items: $scope.items
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function () { });
            });
        };
        $scope.range = function (start, end) {
            var ret = [],
                i;
            if (!end) {
                end = start;
                start = 0;
            }
            for (i = start; i < end; i++) {
                ret.push(i);
            }
            var paging = ret;
            if (ret.length > 6) {
                var currentPage = $scope.currentPage;
                paging = ret.slice(0, 1);
                if (currentPage === 0 || currentPage === undefined) {
                    paging = paging.concat(ret.slice(1, 3));
                    paging.push(-1);
                    paging = paging.concat(ret.slice(ret.length - 3, ret.length));
                } else if (currentPage < 4) {
                    paging = paging.concat(ret.slice(1, 5));
                    paging.push(-1);
                    paging = paging.concat(ret.slice(ret.length - 1, ret.length));
                } else if (currentPage >= ret.length - 4) {
                    paging.push(-1);
                    paging = paging.concat(ret.slice(ret.length - 5, ret.length));
                } else {
                    paging.push(-1);
                    paging = paging.concat(ret.slice(currentPage - 1, currentPage + 2));
                    paging.push(-1);
                    paging = paging.concat(ret.slice(ret.length - 1, ret.length));
                }
            }
            return paging;
        };
        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };
        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };
        $scope.setPage = function (n) {
            $scope.currentPage = this.n;
        };
        $scope.sort_by = function (newSortingOrder) {
            if ($scope.sortingOrder == newSortingOrder) $scope.reverse = !$scope.reverse;
            $scope.sortingOrder = newSortingOrder;
        };
        $scope.getDataSet();
    }
]);
