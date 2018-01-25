/**
 * @ngdoc function
 * @name PolicyAdmin.controller:policyRuleCtrl
 * @description # App Controller of the Policy Admin
 * @Author Mrugesh patel - MQS618
 */
var policyApp = angular.module('policyApp', ['ui.router', 'ngResource',
    'ngAria', 'ngAnimate', 'ngSanitize', 'ngStorage', 'ngTouch',
    'angularModalService', 'ngCookies', 'ngCsv', 'angular.backtop',
    'ngNotificationsBar']);

policyApp.constant('BASE_CONSTS', {
    'DRAFT_CONST': '_draft',
    'CONF_CONST': 'configuration',
    'ATTR_CONST': 'attribute',
    'OPER_CONST': 'operator',
    'RULESTYPE_CONST': 'rule-set-type',
    'RULESET_CONST': 'rule-set',
    'RULESUBSET_CONST': 'rule-sub-set',
    'RULES_CONST': 'rule',
    'DATASET_CONST': 'data-set',
    'EXPORT_CONST': 'export',
    'ELEMENT_CONST': 'element'
});

policyApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    function (
        $stateProvider,
        $urlRouterProvider,
        $httpProvider
    ) {
        $httpProvider.interceptors.push(['$q', '$rootScope', function ($q, $rootScope) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $rootScope.ForbiddenError();
                        return $q.defer().promise;
                    } else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    }]);

policyApp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('lists', {
            url: '/lists',
            controller: 'ListsController as ctrl',
            templateUrl: 'views/lists.html'
        })
        .state('rules', {
            url: '/rules',
            controller: 'RulesController as ctrl',
            templateUrl: 'views/rules.html'
        })
        .state('rules.detail', {
            url: '/{id}',
            controller: 'RuleViewController as ctrl',
            templateUrl: 'views/ruleView.html',
            params: {
                ruleSetEle: {},
                modalType: '',
                creatUrl: '~'
            }
        })
        .state('edit', {
            url: '/rules/{id}/edit',
            controller: 'RuleEditController as ctrl',
            templateUrl: 'views/ruleEdit.html',
            params: {
                ruleSetEle: {},
                newRuleSet: false,
                modalType: '',
                creatUrl: '~'
            }
        })
}]);
