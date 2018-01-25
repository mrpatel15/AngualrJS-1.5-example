angular.module('appDirectives', []);

policyApp.directive('alert', ['alertService', function(alertService) {
  return {
    restrict: 'AE',
    link: function(scope, e, a) {
      scope.alert = alertService.alertObj;
    },
    template: '<div class="alert notify_msg element-animation" ng-class="alert.type" ng-show="alert.show">{{alert.msg}}' + '<a href="#" data-dismiss="alert" class="close" ng-click="hide()">&nbsp;&nbsp;&times;</a>'+'</div>'
  };
}]);

policyApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

policyApp.directive('toggle', function(){
	  return {
	    restrict: 'A',
	    link: function(scope, element, attrs){
	      if (attrs.toggle=="tooltip"){
	        $(element).tooltip();
	      }
	      if (attrs.toggle=="popover"){
	        $(element).popover();
	      }
	    }
	  };
});

policyApp.directive('queryBuilder', ['$compile',
	function ($compile) {
		return {
			restrict: 'E',
			scope: {
				group: '=',
				attributes: '=',
				conditions: '=',
				operators: '='
			},
			templateUrl: '/views/queryBuilderDirective.html',
			compile: function (element, attrs) {
				var content, directive;
				content = element.contents().remove();
				return function (scope, element, attrs) {
					scope.addCondition = function () {
						scope.group.rules.push({
							condition: '',
							attr1: '',
							attr2: '',
							invert: false
						});
					};
					scope.removeCondition = function (index) {
						scope.group.rules.splice(index, 1);
					};
					scope.addGroup = function () {
						scope.group.rules.push({
							group: {
								operator: 'AND',
								rules: [],
								invert: false
							}
						});
					};
					scope.removeGroup = function () {
						"group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
					};
					directive || (directive = $compile(content));
					element.append(directive(scope, function ($compile) {
						return $compile;
					}));
				}
			}
		}
	}
]);
/**** Query Builder form validation ********/
//policyApp.directive('requiredSelect', function () {
//  return {
//                      restrict: 'AE',
//                      require: 'ngModel',
//                      link: function(scope, elm, attr, ctrl) {
//
//                        if (!ctrl) return;
//                          attr.requiredSelect = true; 
//
//                          var validator = function(value) {
//                            if (attr.requiredSelect && ctrl.$isEmpty(value)) {
//                              ctrl.$setValidity('requiredSelect', false);
//                              return;
//                            } else {
//                              ctrl.$setValidity('requiredSelect', true);
//                              return value;
//                            }
//                          };
//
//                          ctrl.$formatters.push(validator);
//                          ctrl.$parsers.unshift(validator);
//
//                          attr.$observe('requiredSelect', function() {
//                            validator(ctrl.$viewValue);
//                          });
//                      }
//  };
//});

/**
 * @ngdoc function
 * @name App directive
 * @description # Global directive - Add multiple directive here - file already injected with app modual.
 * @Author Mrugesh patel - MQS618
 */
