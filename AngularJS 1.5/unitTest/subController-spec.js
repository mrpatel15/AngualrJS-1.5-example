// ---SPECS-------------------------

describe('angular', function () {
    it('should exist', function () {
        expect(window.angular).toBeDefined();
    });

    describe('module policyApp', function () {
        var module;
        var policyApp;
        beforeEach(function () {
            module = angular.module('policyApp');
        });
        it('should exist', function () {
            expect(module).toBeDefined();
        });
        
        describe('appControllers', function () {
            it('should exist appControllers.', function () {
                expect(module.controller('appControllers')).toBeDefined();
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