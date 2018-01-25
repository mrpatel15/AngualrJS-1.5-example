/**
 * @ngdoc function
 * @name PolicyAdmin.controller:policyRuleCtrl
 * @description # UNit Test - App serives 
 * @Author Mrugesh patel - MQS618
 */

//  Unit testing the promise
 
describe('Testing Policy Admin Web Serives', function() {
	
	var $httpBackend, RulesEngineService, url;

	beforeEach(module('appServices'));

	beforeEach(inject(function (_$httpBackend_, _RulesEngineService_) {
	  $httpBackend = _$httpBackend_;
	  RulesEngineService = _RulesEngineService_;
	}));
	
	it('Test GET Call ', function () {

		var response = { data: 'result' };
		  var result = {}
		  $httpBackend.expect('GET', '/rule-engine-ldap-api-web/private/consumeridentityservices/identity/rules/' + url).respond(200, response);

		  RulesEngineService.getAllData().then(function (responseData) {
		    result = responseData;
		  });
		  
		  //If there are no pending requests to flush when the method is called, an exception is thrown (as this is typically a sign of programming error).
		  $httpBackend.flush();

		  expect(result).toEqual(response);
	});
	
	
	it('Test POST Call ', function () {

		var response = { data: 'result' };
		  var result = {}
		  
		  $httpBackend.expect('POST', '/rule-engine-ldap-api-web/private/consumeridentityservices/identity/rules/' + url).respond(200, response);

		  RulesEngineService.postAllData().then(function (responseData) {
		    result = responseData;
		  });
		  
		  $httpBackend.flush();

		  expect(result).toEqual(response);
	});
	
	it('Test Delete Call ', function () {

		var response = { data: 'result' };
		  var result = {}
		  
		  $httpBackend.expect('DELETE', '/rule-engine-ldap-api-web/private/consumeridentityservices/identity/rules/' + url).respond(200, response);

		  RulesEngineService.deleteAllData().then(function (responseData) {
		    result = responseData;
		  });
		  
		  $httpBackend.flush();

		  expect(result).toEqual(response);
	});
	  
});


 