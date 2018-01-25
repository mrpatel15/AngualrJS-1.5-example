policyApp.controller('RuleViewController', [
  '$scope',
  '$filter',
  'ApiService',
  'RulesService',
  '$element',
  '$stateParams',
  function (
    $scope,
    $filter,
    ApiService,
    RulesService,
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
    this.id = $stateParams.id;
    this.modalType = $stateParams.modalType;
    this.creatUrl = $stateParams.creatUrl;
    this.ruleSetEle = $stateParams.ruleSetEle;

    $scope.modalType = $stateParams.modalType;
    $scope.creatUrl = $stateParams.creatUrl;
    $scope.logAttributes = RulesService.json ? RulesService.json.attributes : null;
    $scope.ruleSetEle = $stateParams.ruleSetEle;
    $scope.entries = $scope.ruleSetEle.properties.entries;

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
    $scope.generateId = function (excludeDraft) {
      if ($scope.ruleSetEle.elementType === 'RULE_SET') {
        $scope.ruleSetEle.id = ApiService.getUniqueId("rs", excludeDraft);
      } else if ($scope.ruleSetEle.elementType === 'RULE_SUB_SET') {
        $scope.ruleSetEle.id = ApiService.getUniqueId("ss", excludeDraft);
      } else if ($scope.ruleSetEle.elementType === 'RULE') {
        $scope.ruleSetEle.id = ApiService.getUniqueId("rl", excludeDraft);
      }
    }

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
          if (conditionTemp.length) {
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
          }
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
    if ($scope.ruleSetEle.evaluationStatement) {
      popuateQueryBuilder($scope.evaluationParentRuleGroup.group, $scope.ruleSetEle.evaluationStatement.conditions);
    }
    if ($scope.ruleSetEle.applyStatement) {
      popuateQueryBuilder($scope.applyParentRuleGroup.group, $scope.ruleSetEle.applyStatement.conditions);
    }
    $scope.$watch('applyParentRuleGroup', function (newValue) {
      $scope.asOutput = computed(newValue.group);
    }, true);
    $scope.$watch('evaluationParentRuleGroup', function (newValue) {
      $scope.esOutput = computed(newValue.group);
    }, true);
  }
]);
