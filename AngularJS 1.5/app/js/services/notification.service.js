policyApp.service('alertService', function() {
	  var me = this;
	  me.alertObj = {
	    show: false,
	    msg: '',
	    type: 'alert-success'
	  };
	  me.alertShow = false;
	  me.alertTypes = ['alert-success', 'alert-info', 'alert-warning', 'alert-danger'];
	  me.alert = function(type, msg) {
	    me.alertObj.msg = msg;
	    me.alertObj.type = me.alertTypes[type];
	    me.alertObj.show = true;
	  };
	  me.success = function(msg) {
	    me.alert(0, msg);
	  };
	  me.info = function(msg) {
	    me.alert(1, msg);
	  };
	  me.warning = function(msg) {
	    me.alert(2, msg);
	  };
	  me.danger = function(msg) {
	    me.alert(3, msg);
	  };
	  me.hide = function() {
	    me.alertObj.show = false;
	  };
	  return this;
});



/**
 * @ngdoc function
 * @name PolicyAdmin.controller:policyRuleCtrl
 * @description notification service for web only
 * @Author Mrugesh patel - MQS618
 * 
 */