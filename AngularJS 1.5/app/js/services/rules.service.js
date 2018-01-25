/**
 * @ngdoc function
 * @name PolicyAdmin.Services
 * @description # Global services for API call
 * @Author Mrugesh patel - MQS618
 */
policyApp.factory('RulesService', ['ApiService', '$rootScope', '$localStorage', 'BASE_CONSTS',
    function(ApiService, $rootScope, $localStorage, BASE_CONSTS) {
    return {
        rules : [],
        json : null,
        selectedContainerId : null,
        selectedContainerVersion : null,
        _load: function(response) {
            this.json = JSON.parse(response.definition.json);
            this.rules = this.toList(this.json);
            return this.rules;
        },
        toList: function (ruleContainer, level) {
            level = level || 0;
            var children = ruleContainer.ruleSets || ruleContainer.rules || [];
            var self = this;
            return children.reduce(function (acc, val) {
                val.level = level;
                val.expanded = true;
                val.visible = true;
                acc.push(val);
                if (val.rules) {
                    acc.push.apply(acc, self.toList(val, level + 1));
                } else {
                    val.leaf = true;
                }
                return acc;
            }, [])
        },
        init: function(id, version) {
            if (!id && !version) {
                if ($localStorage.selectedId && $localStorage.selectedVersion) {
                    return this.init($localStorage.selectedId, $localStorage.selectedVersion);
                } else {
                    return;
                }
            }
            if (this.selectedContainerId !== id || this.selectedContainerVersion !== version) {
                this.selectedContainerId = id;
                this.selectedContainerVersion = version;
                $localStorage.selectedId = id;
                $localStorage.selectedVersion = version;

                var url = BASE_CONSTS.EXPORT_CONST + '/' + id + '/' + version;
                return ApiService.getAllData(url)
                    .then(this._load.bind(this), $rootScope.errorNotification);
            } else {
                return Promise.resolve(this.rules);
            }
        },
        update : function() {

        }
    }
}]);
