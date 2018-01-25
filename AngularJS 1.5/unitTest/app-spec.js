// ---SPECS-------------------------

describe('angular', function () {
    it('should exist', function () {
        expect(window.angular).toBeDefined();
    });

    describe('module policyApp', function () {
        var module, container;
        var policyApp;
        beforeEach(function () {
            module = angular.module('policyApp');
        });
        it('Should exist', function () {
            expect(module).toBeDefined();
        });
        describe('policyRuleCtrl', function () {
            it('should exist policyRuleCtrl.', function () {
                expect(module.controller('policyRuleCtrl')).toBeDefined();
            });
        });
        
        describe('toEqual', function() {
            it('passes if arrays are equal', function() {
                var arr = [1, 2, container];
                expect(arr).toEqual([1, 2, container]);
            });
        });

    });
});
    
  

/**
 * @ngdoc function
 * @name PolicyAdmin.controller:policyRuleCtrl
 * @description # App Controller of the Policy Admin
 * @Author Mrugesh patel - MQS618
 */