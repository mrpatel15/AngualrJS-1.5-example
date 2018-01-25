policyApp.controller('RuleEditController', [
  '$scope',
  '$filter',
  '$rootScope',
  'ApiService',
  'RulesService',
  'alertService',
  'BASE_CONSTS',
  '$element',
  '$stateParams',
  function (
    $scope,
    $filter,
    $rootScope,
    ApiService,
    RulesService,
    alertService,
    BASE_CONSTS,
    $element,
    $stateParams
  ) {
    $scope.statusTypes = [{
      id: 'ACTIVE',
      name: 'ACTIVE'
    }, {
      id: 'INACTIVE',
      name: 'INACTIVE'
    }];
    $scope.ruleSetEleTypes = [{
      id: 'rl1',
      ruleType: 'RULE'
    }, {
      id: 'rl2',
      ruleType: 'RULE_SUB_SET'
    }];
    $scope.ruleScore = [{
      id: 'A',
      name: 'Score'
    }, {
      id: 'B',
      name: 'Status'
    }];
    $scope.newRuleSet = $stateParams.newRuleSet;
    $scope.modalType = $stateParams.modalType;
    $scope.creatUrl = $stateParams.creatUrl;
    $scope.logAttributes = RulesService.json.attributes;
    if ($scope.newRuleSet) {
      $scope.ruleSetEle = {};
      $scope.originalRuleSet = $stateParams.ruleSetEle;
    } else {
      $scope.ruleSetEle = $stateParams.ruleSetEle;
      $scope.entries = $scope.ruleSetEle.properties.entries;
    }
    $scope.fields = [];
    $scope.editText = false;
    $scope.removeEntry = function (index) {
      $scope.entries.splice(index, 1);
    };
    $scope.editEntry = function () {
      $scope.editText = true;
    };
    $scope.cancelInput = function (index) {
      $scope.fields.splice(index, 1);
    };
    $scope.addEntry = function () {
      $scope.editMode = true;
      var newEntry = {};
      $scope.fields.push(newEntry);
    };
    $scope.successMsg = function () {
      alertService.success($scope.ruleSetEle.id + " Update successfully!");
      $element.modal('hide');
      $rootScope.hideNotification();
    };
    $scope.generateId = function (excludeDraft) {
      if ($scope.ruleSetEle.elementType === 'RULE_SET') {
        $scope.ruleSetEle.id = ApiService.getUniqueId("rs", excludeDraft);
      } else if ($scope.ruleSetEle.elementType === 'RULE_SUB_SET') {
        $scope.ruleSetEle.id = ApiService.getUniqueId("ss", excludeDraft);
      } else if ($scope.ruleSetEle.elementType === 'RULE') {
        $scope.ruleSetEle.id = ApiService.getUniqueId("rl", excludeDraft);
      }
    }
    if ($scope.modalType === 'create') {
      $scope.ruleSetEle.elementType = 'RULE_SET';
      $scope.generateId();
    }
    $scope.saveField = function () {
      var duplicate = false;
      angular.forEach($scope.entries, function (entry, index) {
        angular.forEach($scope.fields, function (newEntry, index) {
          if (newEntry.key == entry.key) {
            newEntry.duplicate = true;
            duplicate = true;
          }
        });
      });
      if (!duplicate) {
        var allEntries;
        if ($scope.fields === undefined || $scope.fields === null) {
          allEntries = $scope.entries;
        } else if ($scope.entries === undefined || $scope.entries === null) {
          allEntries = $scope.fields;
        } else {
          allEntries = $scope.entries.concat($scope.fields);
        }
        if ($scope.newRuleSet) {
          $scope.ruleSetEle.properties = {};
        }
        $scope.ruleSetEle.properties.entries = allEntries;
        if (!$scope.ruleSetEle.id.endsWith(BASE_CONSTS.DRAFT_CONST)) {
          $scope.ruleSetEle.id = $scope.ruleSetEle.id + BASE_CONSTS.DRAFT_CONST;
        }
        $scope.createQueryStatement($scope.ruleSetEle);
        var url = BASE_CONSTS.ELEMENT_CONST + '/' + RulesService.selectedContainerId + '/' + RulesService.selectedContainerVersion + '/';
        if ($scope.ruleSetEle.elementType === 'RULE_SET') {
          url = url + BASE_CONSTS.RULESET_CONST + '/';
          $scope.ruleSetEle.type = "ruleSetModel";
        } else if ($scope.ruleSetEle.elementType === 'RULE_SUB_SET') {
          url = url + BASE_CONSTS.RULESUBSET_CONST + '/';
          $scope.ruleSetEle.type = "ruleSubSetModel";
        } else if ($scope.ruleSetEle.elementType === 'RULE') {
          url = url + BASE_CONSTS.RULES_CONST + '/';
          $scope.ruleSetEle.type = "ruleModel";
        }
        url = url + $scope.creatUrl;
        delete $scope.ruleSetEle["elementType"];
        ApiService.postAllData($scope.ruleSetEle, url).then(function () {
          $rootScope.getRuleSetData();
          $scope.successMsg();
        }, function (error) {
          $rootScope.errorNotification();
        });
      }
    };
    $scope.logicalOperatorList = [];
    $scope.attributesList = [];
    $scope.operatorsList = [];
    var gatherLogicalOperators = function (rules) {
      angular.forEach(rules, function (rule, key) {
        if (rule.rules != undefined || rule.rules != null) {
          gatherLogicalOperators(rule.rules);
        }
        var tempOpr;
        if (rule.applyStatement) {
          tempOpr = {
            id: $scope.logicalOperatorList.length + 1,
            name: rule.applyStatement.logicalOperator
          }
        } else if (rule.evaluationStatement) {
          tempOpr = {
            id: $scope.logicalOperatorList.length + 1,
            name: rule.evaluationStatement.logicalOperator
          }
        }
        if (tempOpr) {
          var found = $filter('filter')($scope.logicalOperatorList, tempOpr.name);
          if (found.length == 0) {
            $scope.logicalOperatorList.push(tempOpr);
          }
        }
      });
    }
    var inlv = {
      id: 'inlv',
      name: 'Inline Value'
    }
    $scope.attributesList.push(inlv);
    angular.forEach(RulesService.json.attributes, function (attr, key) {
      $scope.attributesList.push({
        id: attr.id,
        name: attr.name
      });
    });
    angular.forEach(RulesService.json.operators, function (operator, key) {
      $scope.operatorsList.push({
        id: operator.id,
        name: operator.symbol
      });
    });
    angular.forEach(RulesService.json.ruleSets, function (ruleSet, key) {
      gatherLogicalOperators(ruleSet.rules);
    });

    function htmlEntities(str) {
      return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function computed(group) {
      if (!group) return "";
      for (var str = "(", i = 0; i < group.rules.length; i++) {
        i > 0 && (str += ")" + " <strong>" + group.operator + "</strong> ");
        if (group.rules[i].invert) {
          str = str + "NOT (";
        } else {
          str = str + " (";
        }
        var showInlineVal1 = false;
        if (group.rules[i].attr1 == "Inline Value") {
          showInlineVal1 = true;
        }
        var showInlineVal2 = false;
        if (group.rules[i].attr2 == "Inline Value") {
          showInlineVal2 = true;
        }
        var attr1 = showInlineVal1 ? group.rules[i].inlv1 : group.rules[i].attr1;
        var attr2 = showInlineVal2 ? group.rules[i].inlv2 : group.rules[i].attr2;
        str += group.rules[i].group ? computed(group.rules[i].group) : attr1 + " " + "<b>" + htmlEntities(group.rules[i].condition) + "</b>" + " " + attr2;
      }
      return str + ")";
    }
    var popuateQueryBuilder = function (group, conditions) {
      angular.forEach(conditions, function (condition, index) {
        if (condition.conditionType === 'CONDITION') {
          var attr1Val = condition.operands[0];
          if (attr1Val && attr1Val.indexOf("inlv: ") > -1) {
            attr1Val = 'inlv';
          }
          var attr2Val = condition.operands[1];
          if (attr2Val != null && attr2Val.indexOf("inlv: ") > -1) {
            attr2Val = 'inlv';
          }
          var attr1 = $filter('filter')($scope.attributesList, attr1Val);
          var attr2 = $filter('filter')($scope.attributesList, attr2Val);
          var conditionTemp = $filter('filter')($scope.operatorsList, condition.operator);
          var rule = {
            condition: conditionTemp[0].name,
            attr1: attr1[0].name,
            attr2: attr2[0].name,
            invert: condition.invert
          };
          if (attr1Val === 'inlv') {
            rule.inlv1 = condition.operands[0].replace(/inlv: /g, '');
          }
          if (attr2Val === 'inlv') {
            rule.inlv2 = condition.operands[1].replace(/inlv: /g, '');
          }
          group.rules.push(rule);
        } else if (condition.conditionType === 'GROUP') {
          var condition = $filter('filter')($scope.operatorsList, condition.logicalOperator);
          var tempGroup = {
            operator: condition[0].name,
            rules: [],
            invert: condition.invert
          };
          popuateQueryBuilder(tempGroup, condition.conditions);
        }
      });
    }
    $scope.applyParentRuleGroup = {
      group: {
        operator: "AND",
        rules: [],
        invert: false
      }
    };
    $scope.evaluationParentRuleGroup = {
      group: {
        operator: "AND",
        rules: [],
        invert: false
      }
    };
    if (!$scope.newRuleSet) {
      if ($stateParams.ruleSetEle.evaluationStatement) {
        var evaluationStatement = $stateParams.ruleSetEle.evaluationStatement;
        $scope.evaluationParentRuleGroup.invert = evaluationStatement.invert;
        $scope.evaluationParentRuleGroup.operator = evaluationStatement.logicalOperator;
        popuateQueryBuilder($scope.evaluationParentRuleGroup.group, evaluationStatement.conditions);
      }
      if ($stateParams.ruleSetEle.applyStatement) {
        var applyStatement = $stateParams.ruleSetEle.applyStatement;
        $scope.applyParentRuleGroup.invert = applyStatement.invert;
        $scope.applyParentRuleGroup.operator = applyStatement.logicalOperator;
        popuateQueryBuilder($scope.applyParentRuleGroup.group, applyStatement.conditions);
      }
    }
    $scope.$watch('applyParentRuleGroup', function (newValue) {
      $scope.asOutput = computed(newValue.group);
    }, true);
    $scope.$watch('evaluationParentRuleGroup', function (newValue) {
      $scope.esOutput = computed(newValue.group);
    }, true);
    var createGroupJson = function (invert, operator) {
      var tempGroupCond = {
        id: ApiService.getUniqueId("gr"),
        //		   				conditionType :  "GROUP",
        type: "ruleConditionModel",
        invert: invert,
        logicalOperator: operator,
        conditions: []
      };
      return tempGroupCond;
    }
    var createConditionJson = function (id, invert, condition, attr1, attr2) {
      var tempCond = {
        id: ApiService.getUniqueId("cn"),
        //		   				conditionType :  "CONDITION",
        type: "ruleConditionModel",
        invert: invert,
        operator: condition,
        operands: [attr1, attr2]
      };
      return tempCond;
    }
    var iterateRules = function (rules, conditions) {
      angular.forEach(rules, function (rule, index) {
        var tempCond = null;
        if (rule.group) {
          tempCond = createGroupJson(rule.group.invert, rule.group.operator);
          iterateRules(rule.group.rules, tempCond.conditions);
        } else {
          var attr1 = $filter('filter')($scope.attributesList, rule.attr1);
          var attr2 = $filter('filter')($scope.attributesList, rule.attr2);
          var condition = $filter('filter')($scope.operatorsList, rule.condition);
          if (rule.attr1 === 'Inline Value') {
            attr1 = attr1[0].id + ": " + rule.inlv1;
          } else {
            attr1 = attr1[0].id;
          }
          if (rule.attr2 === 'Inline Value') {
            attr2 = attr2[0].id + ": " + rule.inlv2;
          } else {
            attr2 = attr2[0].id;
          }
          tempCond = createConditionJson(index, rule.invert, condition[0].id, attr1, attr2);
        }
        conditions.push(tempCond);
      });
    }
    var createPostJson = function (parentRuleGroup, isApplyStatement) {
      var postJson = null;
      if (isApplyStatement) {
        postJson = {
          id: ApiService.getUniqueId("as"),
          type: "ruleConditionStatementModel",
          //							conditionType : "STATEMENT",
          invert: false,
          logicalOperator: "OR",
          conditions: []
        };
      } else {
        postJson = {
          id: ApiService.getUniqueId("es"),
          type: "ruleConditionStatementModel",
          //						conditionType : "STATEMENT",
          invert: false,
          logicalOperator: "OR",
          conditions: []
        };
      }
      //				var tempGroupCond = createGroupJson("Test_id", parentRuleGroup.group.invert, parentRuleGroup.group.operator);
      //				
      //				if (isApplyStatement) {
      //					postJson.applyStatement.conditions.push(tempGroupCond);
      iterateRules(parentRuleGroup.group.rules, postJson.conditions);
      //				} else {
      //					postJson.evaluationStatement.conditions.push(tempGroupCond);
      //					iterateRules(parentRuleGroup.group.rules, postJson.evaluationStatement.conditions);
      //				}
      return postJson;
    }
    $scope.createQueryStatement = function (ruleSetElement) {
      if ($scope.applyParentRuleGroup.group.rules.length > 0) {
        ruleSetElement.applyStatement = createPostJson($scope.applyParentRuleGroup, true);
      }
      if ($scope.evaluationParentRuleGroup.group.rules.length > 0) {
        ruleSetElement.evaluationStatement = createPostJson($scope.evaluationParentRuleGroup, false);
      }
    };
  }
]);
