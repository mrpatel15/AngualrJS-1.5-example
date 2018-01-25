policyApp.controller('confirmModalCtrl', ['$scope', 'close', '$element', 'deleteItem',
    function ($scope, close, $element, deleteItem) {
        $scope.deleteItem = deleteItem;
        $scope.close = function (result) {
            close(result, 500);
            $element.modal('hide');
        };
    }
]);
