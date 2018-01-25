/**
 * @ngdoc function
 * @name PolicyAdmin.Services
 * @description # Global services for API call
 * @Author Mrugesh patel - MQS618
 */
policyApp.factory('ApiService', [
    '$http',
     '$q',
    function (
      $http,
       $q
       ) {
        var request = function (url, method, data) {
            var request = {
                method: method,
                url: '/rule-engine-ldap-api-web/private/consumeridentityservices/identity/rules/' + url,
                headers: {
                    'Api-Key': 'RTM',
                    'Accept': 'application/json;v=3',
                    'Content-Type': 'application/json;v=3'
                }
            }
            if (data) {
                request.data = data
            }
            return $http(request)
                .then(function (response) {
                    return response.data;
                }, function (response, status) {
                    throw response.data;
                });
        }

        var factory = {};
        factory.getAllData = function (url) {
            return request(url, 'get');
        };
        factory.postAllData = function (elements, url) {
            return request(url, 'post', elements);
        };
        factory.deleteAllData = function (url) {
            return request(url, 'delete');
        };
        factory.putAllData = function (url) {
            return request(url, 'put');
        };
        factory.getUniqueId = function (type, excludeDraft) {
            var _getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            var length = 6;
            var timestamp = +new Date;
            var ts = timestamp.toString();
            var parts = ts.split("").reverse();
            var id = "";
            for (var i = 0; i < length; ++i) {
                var index = _getRandomInt(0, parts.length - 1);
                id += parts[index];
            }
            if (excludeDraft) {
                return type + "-" + id;
            }
            // return type + "-" + id + "_draft";
            return type + "-" + id;
        };

        return factory;
    }]);
