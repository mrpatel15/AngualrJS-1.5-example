policyApp.controller('RulesController', ['RulesService', function (RulesService, ) {
    this.RulesService = RulesService;

    this.toggleVisibility = function (node, expanded) {
        if (expanded === undefined) {
            expanded = node.expanded;
        }
        node.expanded = !expanded;
        (node.rules || []).forEach(function (e) {
            e.expanded = false;
            e.visible = !expanded;
            if (e.rules && expanded) {
                self.toggleVisibility(e, expanded);
            }
        });
        return false;
    }
}]);
