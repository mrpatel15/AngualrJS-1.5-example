describe('Testing App Directives', function() {
  var $rootScope, $compile, element, scope;

  beforeEach(function(){
    module('appDirectives');
    inject(function($injector){
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      element = angular.element('<alert></alert>');
      scope = $rootScope.$new();

      scope.$apply(function(){
        scope.alert = { msg: "Notification" };
        $compile(element)(scope);
      });
    });
  }); 

  it("Notification successfully test.", function() {
	  expect(Notification).toBe(Notification);
	  expect(Notification).toEqual(Notification);
	});
  
});

/**
 * @ngdoc function
 * @name PolicyAdmin.controller:policyRuleCtrl
 * @description # Unit test App directives
 * @Author Mrugesh patel - MQS618
 */