var AssessmentListElementView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

AssessmentListElementView = (function(superClass) {
  extend(AssessmentListElementView, superClass);

  function AssessmentListElementView() {
    this.assessmentDelete = bind(this.assessmentDelete, this);
    this.updateResultCount = bind(this.updateResultCount, this);
    this.update = bind(this.update, this);
    this.ghostLogin = bind(this.ghostLogin, this);
    return AssessmentListElementView.__super__.constructor.apply(this, arguments);
  }

  AssessmentListElementView.prototype.className = "AssessmentListElementView";

  AssessmentListElementView.prototype.tagName = "li";

  AssessmentListElementView.prototype.events = Modernizr.touch ? {
    'click .assessment_menu_toggle': 'assessmentMenuToggle',
    'click .admin_name': 'assessmentMenuToggle',
    'click .sp_assessment_delete': 'assessmentDeleteToggle',
    'click .sp_assessment_delete_cancel': 'assessmentDeleteToggle',
    'click .sp_assessment_delete_confirm': 'assessmentDelete',
    'click .sp_copy': 'copyTo',
    'click .sp_duplicate': 'duplicate',
    'click .sp_update': 'update',
    'click .sp_print': 'togglePrint',
    'click .archive': 'archive',
    'click a': 'respondToLink',
    'change #print_format': 'print'
  } : {
    'click .assessment_menu_toggle': 'assessmentMenuToggle',
    'click .admin_name': 'assessmentMenuToggle',
    'click .sp_assessment_delete': 'assessmentDeleteToggle',
    'click .sp_assessment_delete_cancel': 'assessmentDeleteToggle',
    'click .sp_assessment_delete_confirm': 'assessmentDelete',
    'click .sp_copy': 'copyTo',
    'click .sp_duplicate': 'duplicate',
    'click .sp_update': 'update',
    'click .sp_print': 'togglePrint',
    'click .archive': 'archive',
    'change #print_format': 'print'
  };

  AssessmentListElementView.prototype.blankResultCount = "-";

  AssessmentListElementView.prototype.initialize = function(options) {
    this.model = options.model;
    this.parent = options.parent;
    return this.isAdmin = Tangerine.user.isAdmin();
  };

  AssessmentListElementView.prototype.respondToLink = function(event) {
    var $target, route;
    $target = $(event.target);
    route = $target.attr("href");
    return Tangerine.router.navigate(route, true);
  };

  AssessmentListElementView.prototype.duplicate = function() {
    var newName;
    newName = "Copy of " + this.model.get("name");
    return this.model.duplicate({
      name: newName
    }, null, null, (function(_this) {
      return function(assessment) {
        return _this.model.trigger("new", assessment);
      };
    })(this));
  };

  AssessmentListElementView.prototype.copyTo = function(group) {
    return this.model.replicate(group, (function(_this) {
      return function() {
        return window.location = Tangerine.settings.urlIndex(group, "assessments");
      };
    })(this));
  };

  AssessmentListElementView.prototype.ghostLogin = function() {
    return Tangerine.user.ghostLogin(Tangerine.settings.upUser, Tangerine.settings.upPass);
  };

  AssessmentListElementView.prototype.update = function() {
    Utils.midAlert("Verifying connection");
    Utils.working(true);
    return this.model.verifyConnection({
      error: (function(_this) {
        return function() {
          Utils.working(false);
          Utils.midAlert("Verifying connection<br>Please retry update.");
          return _.delay(function() {
            return _this.ghostLogin();
          }, 5000);
        };
      })(this),
      success: (function(_this) {
        return function() {
          Utils.working(false);
          _this.model.on("status", function(message) {
            if (message === "import lookup") {
              return Utils.midAlert("Update starting");
            } else if (message === "import success") {
              Utils.midAlert("Updated");
              Utils.working(false);
              return _this.model.fetch({
                success: function() {
                  return _this.render();
                }
              });
            } else if (message === "import error") {
              Utils.working(false);
              return Utils.midAlert("Update failed");
            }
          });
          Utils.working(true);
          return _this.model.updateFromServer();
        };
      })(this)
    });
  };

  AssessmentListElementView.prototype.togglePrint = function() {
    return this.$el.find(".print_format_wrapper").toggle();
  };

  AssessmentListElementView.prototype.print = function() {
    var format;
    format = this.$el.find("#print_format option:selected").attr("data-format");
    if (format === "cancel") {
      this.$el.find(".print_format_wrapper").toggle();
      this.$el.find("#print_format").val("reset");
      return;
    }
    return Tangerine.router.navigate("print/" + this.model.id + "/" + format, true);
  };

  AssessmentListElementView.prototype.updateResultCount = function() {};

  AssessmentListElementView.prototype.archive = function() {
    var result;
    result = this.$el.find(".archive :selected").val() === "true";
    if (result === true) {
      this.$el.find(".admin_name").addClass("archived_assessment");
    } else {
      this.$el.find(".admin_name").removeClass("archived_assessment");
    }
    this.model.save({
      archived: result
    });
    return true;
  };

  AssessmentListElementView.prototype.assessmentMenuToggle = function() {
    this.$el.find('.assessment_menu_toggle').toggleClass('sp_down').toggleClass('sp_right');
    return this.$el.find('.assessment_menu').toggle();
  };

  AssessmentListElementView.prototype.assessmentDeleteToggle = function() {
    this.$el.find(".sp_assessment_delete_confirm").toggle();
    return false;
  };

  AssessmentListElementView.prototype.assessmentDelete = function() {
    return this.model.destroy();
  };

  AssessmentListElementView.prototype.spriteListLink = function() {
    var i, len, name, names, result, tagName;
    tagName = arguments[0], names = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    result = "";
    for (i = 0, len = names.length; i < len; i++) {
      name = names[i];
      result += "<" + tagName + " class='sp_" + (name.underscore()) + "'><a href='#" + name + "/" + this.model.id + "'>" + (name.underscore().titleize()) + "</a></" + tagName + ">";
    }
    return result;
  };

  AssessmentListElementView.prototype.spriteEvents = function() {
    var i, len, name, names, result, tagName;
    tagName = arguments[0], names = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    result = "";
    for (i = 0, len = names.length; i < len; i++) {
      name = names[i];
      result += "<" + tagName + "><button class='sp_" + (name.underscore()) + "' title='" + (name.underscore().titleize()) + "'>" + (name.underscore().titleize()) + "</button></" + tagName + "> ";
    }
    return result;
  };

  AssessmentListElementView.prototype.ul = function(options) {
    var html;
    html = "<ul " + (options.cssClass ? "class='" + options.cssClass + "'" : '') + ">";
    html += this.spriteListLink.apply(this, ["li"].concat(options.links));
    html += options.other || '';
    return html += "</ul>";
  };

  AssessmentListElementView.prototype.render = function() {
    var adminName, adminResultCount, archiveClass, archiveSwitch, deleteConfirm, downloadKey, format, isArchived, name, printSelector, resultCount, selected, toggleButton;
    isArchived = this.model.getBoolean('archived');
    archiveClass = isArchived ? " archived_assessment" : "";
    toggleButton = "<div class='assessment_menu_toggle sp_right'><div></div></div>";
    name = "<button class='name clickable'>" + (this.model.get('name')) + "</button>";
    adminName = "<button class='admin_name clickable " + archiveClass + "'>" + (this.model.get('name')) + "</button>";
    adminResultCount = "<label class='result_count small_grey no_help' title='Result count. Click to update.'>Results <b>" + this.resultCount + "</b></label>";
    resultCount = "<span class='result_count no_help'>Results <b>" + this.resultCount + "</b></span>";
    selected = " selected='selected'";
    deleteConfirm = "<span class='sp_assessment_delete_confirm confirmation'><div class='menu_box'>Confirm <button class='sp_assessment_delete_yes command_red'>Delete</button> <button class='sp_assessment_delete_cancel command'>Cancel</button></div></span>";
    printSelector = "<div class='print_format_wrapper confirmation'> <select id='print_format'> <option disabled='disabled' selected='selected' value='reset'>Select a print format</option> " + ((function() {
      var i, len, ref, results;
      ref = Tangerine.settings.config.get("printFormats");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        format = ref[i];
        results.push("<option data-format='" + format.key + "'>" + format.name + "</option>");
      }
      return results;
    })()) + " <option data-format='cancel'>Cancel</option> </select> </div>";
    downloadKey = "<li class='download_key small_grey'>Download key <b>" + (this.model.get("_id").substr(-5, 5)) + "</b></li>";
    archiveSwitch = "<select class='archive'> <option value='false' " + (isArchived ? selected : '') + ">Active</option> <option value='true'  " + (isArchived ? selected : '') + ">Archived</option> </select>";
    if (this.isAdmin) {
      this.$el.html("<div> " + toggleButton + " " + adminName + " </div> " + (this.ul({
        cssClass: "assessment_menu",
        links: ["run", "dataEntry", "results", "edit", "sync", "print"],
        other: this.spriteEvents("li", "duplicate", "assessment_delete") + downloadKey
      })) + " <div class='sub_menus'> " + deleteConfirm + " " + printSelector + " </div>");
    } else if (this.isAdmin && Tangerine.settings.getBoolean('satellite')) {
      this.$el.html("<div> " + toggleButton + " " + adminName + " </div> " + (this.ul({
        cssClass: "assessment_menu",
        links: ["run", "results", "edit", "sync", "print"],
        other: this.spriteEvents("li", "duplicate", "assessment_delete") + downloadKey
      })) + " <div class='sub_menus'> " + deleteConfirm + " " + printSelector + " </div>");
    } else {
      this.$el.html("<div class='non_admin'> " + (this.spriteListLink("span", 'run')) + name + " " + (this.spriteListLink("span", 'results')) + " " + (this.spriteListLink("span", 'print')) + " </div> <div class='sub_menus'> " + printSelector + " </div>");
    }
    return this.trigger("rendered");
  };

  return AssessmentListElementView;

})(Backbone.View);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXNzbWVudC9Bc3Nlc3NtZW50TGlzdEVsZW1lbnRWaWV3LmpzIiwic291cmNlcyI6WyJhc3Nlc3NtZW50L0Fzc2Vzc21lbnRMaXN0RWxlbWVudFZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEseUJBQUE7RUFBQTs7Ozs7QUFBTTs7Ozs7Ozs7Ozs7c0NBRUosU0FBQSxHQUFZOztzQ0FFWixPQUFBLEdBQVU7O3NDQUVWLE1BQUEsR0FBVyxTQUFTLENBQUMsS0FBYixHQUF3QjtJQUM5QiwrQkFBQSxFQUF3QyxzQkFEVjtJQUU5QixtQkFBQSxFQUF3QyxzQkFGVjtJQUc5Qiw2QkFBQSxFQUF3Qyx3QkFIVjtJQUk5QixvQ0FBQSxFQUF3Qyx3QkFKVjtJQUs5QixxQ0FBQSxFQUF3QyxrQkFMVjtJQU05QixnQkFBQSxFQUF3QyxRQU5WO0lBTzlCLHFCQUFBLEVBQXdDLFdBUFY7SUFROUIsa0JBQUEsRUFBd0MsUUFSVjtJQVM5QixpQkFBQSxFQUF3QyxhQVRWO0lBVTlCLGdCQUFBLEVBQXdDLFNBVlY7SUFXOUIsU0FBQSxFQUFZLGVBWGtCO0lBYTlCLHNCQUFBLEVBQXFDLE9BYlA7R0FBeEIsR0FjRDtJQUNMLCtCQUFBLEVBQXdDLHNCQURuQztJQUVMLG1CQUFBLEVBQXdDLHNCQUZuQztJQUdMLDZCQUFBLEVBQXdDLHdCQUhuQztJQUlMLG9DQUFBLEVBQXdDLHdCQUpuQztJQUtMLHFDQUFBLEVBQXdDLGtCQUxuQztJQU1MLGdCQUFBLEVBQXdDLFFBTm5DO0lBT0wscUJBQUEsRUFBd0MsV0FQbkM7SUFRTCxrQkFBQSxFQUF3QyxRQVJuQztJQVNMLGlCQUFBLEVBQXdDLGFBVG5DO0lBVUwsZ0JBQUEsRUFBd0MsU0FWbkM7SUFZTCxzQkFBQSxFQUFxQyxPQVpoQzs7O3NDQWVQLGdCQUFBLEdBQWtCOztzQ0FFbEIsVUFBQSxHQUFZLFNBQUMsT0FBRDtJQU1WLElBQUMsQ0FBQSxLQUFELEdBQVksT0FBTyxDQUFDO0lBQ3BCLElBQUMsQ0FB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WkksR0FZVSxTQVpwQixFQUZGO0tBQUEsTUFrQkssSUFBRyxJQUFDLENBQUEsT0FBRCxJQUFhLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBbkIsQ0FBOEIsV0FBOUIsQ0FBaEI7TUFFSCxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSxRQUFBLEdBRUosWUFGSSxHQUVTLEdBRlQsR0FHSixTQUhJLEdBR00sVUFITixHQU1QLENBQUMsSUFBQyxDQUFBLEVBQUQsQ0FDQTtRQUFBLFFBQUEsRUFBVSxpQkFBVjtRQUNBLEtBQUEsRUFBUSxDQUFDLEtBQUQsRUFBTyxTQUFQLEVBQWlCLE1BQWpCLEVBQXdCLE1BQXhCLEVBQStCLE9BQS9CLENBRFI7UUFFQSxLQUFBLEVBQVEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkLEVBQW9CLFdBQXBCLEVBQWlDLG1CQUFqQyxDQUFBLEdBQXdELFdBRmhFO09BREEsQ0FBRCxDQU5PLEdBVVAsMkJBVk8sR0FZSixhQVpJLEdBWVUsR0FaVixHQWFKLGFBYkksR0FhVSxTQWJwQixFQUZHO0tBQUEsTUFBQTtNQW9CSCxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSwwQkFBQSxHQUVMLENBQUMsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsTUFBaEIsRUFBdUIsS0FBdkIsQ0FBRCxDQUZLLEdBRTRCLElBRjVCLEdBRWlDLEdBRmpDLEdBRW1DLENBQUMsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsTUFBaEIsRUFBdUIsU0FBdkIsQ0FBRCxDQUZuQyxHQUVzRSxHQUZ0RSxHQUV3RSxDQUFDLElBQUMsQ0FBQSxjQUFELENBQWdCLE1BQWhCLEVBQXVCLE9BQXZCLENBQUQsQ0FGeEUsR0FFeUcsa0NBRnpHLEdBS0osYUFMSSxHQUtVLFNBTHBCLEVBcEJHOztXQThCTCxJQUFDLENBQUEsT0FBRCxDQUFTLFVBQVQ7RUFwRk07Ozs7R0E1SjhCLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFzc2Vzc21lbnRMaXN0RWxlbWVudFZpZXcgZXh0ZW5kcyBCYWNrYm9uZS5WaWV3XG5cbiAgY2xhc3NOYW1lIDogXCJBc3Nlc3NtZW50TGlzdEVsZW1lbnRWaWV3XCJcblxuICB0YWdOYW1lIDogXCJsaVwiXG5cbiAgZXZlbnRzOiBpZiBNb2Rlcm5penIudG91Y2ggdGhlbiB7XG4gICAgJ2NsaWNrIC5hc3Nlc3NtZW50X21lbnVfdG9nZ2xlJyAgICAgICA6ICdhc3Nlc3NtZW50TWVudVRvZ2dsZSdcbiAgICAnY2xpY2sgLmFkbWluX25hbWUnICAgICAgICAgICAgICAgICAgIDogJ2Fzc2Vzc21lbnRNZW51VG9nZ2xlJ1xuICAgICdjbGljayAuc3BfYXNzZXNzbWVudF9kZWxldGUnICAgICAgICAgOiAnYXNzZXNzbWVudERlbGV0ZVRvZ2dsZSdcbiAgICAnY2xpY2sgLnNwX2Fzc2Vzc21lbnRfZGVsZXRlX2NhbmNlbCcgIDogJ2Fzc2Vzc21lbnREZWxldGVUb2dnbGUnXG4gICAgJ2NsaWNrIC5zcF9hc3Nlc3NtZW50X2RlbGV0ZV9jb25maXJtJyA6ICdhc3Nlc3NtZW50RGVsZXRlJ1xuICAgICdjbGljayAuc3BfY29weScgICAgICAgICAgICAgICAgICAgICAgOiAnY29weVRvJ1xuICAgICdjbGljayAuc3BfZHVwbGljYXRlJyAgICAgICAgICAgICAgICAgOiAnZHVwbGljYXRlJ1xuICAgICdjbGljayAuc3BfdXBkYXRlJyAgICAgICAgICAgICAgICAgICAgOiAndXBkYXRlJ1xuICAgICdjbGljayAuc3BfcHJpbnQnICAgICAgICAgICAgICAgICAgICAgOiAndG9nZ2xlUHJpbnQnXG4gICAgJ2NsaWNrIC5hcmNoaXZlJyAgICAgICAgICAgICAgICAgICAgICA6ICdhcmNoaXZlJ1xuICAgICdjbGljayBhJyA6ICdyZXNwb25kVG9MaW5rJ1xuXG4gICAgJ2NoYW5nZSAjcHJpbnRfZm9ybWF0JyAgICAgICAgICAgICA6ICdwcmludCdcbiAgfSBlbHNlIHtcbiAgICAnY2xpY2sgLmFzc2Vzc21lbnRfbWVudV90b2dnbGUnICAgICAgIDogJ2Fzc2Vzc21lbnRNZW51VG9nZ2xlJ1xuICAgICdjbGljayAuYWRtaW5fbmFtZScgICAgICAgICAgICAgICAgICAgOiAnYXNzZXNzbWVudE1lbnVUb2dnbGUnXG4gICAgJ2NsaWNrIC5zcF9hc3Nlc3NtZW50X2RlbGV0ZScgICAgICAgICA6ICdhc3Nlc3NtZW50RGVsZXRlVG9nZ2xlJ1xuICAgICdjbGljayAuc3BfYXNzZXNzbWVudF9kZWxldGVfY2FuY2VsJyAgOiAnYXNzZXNzbWVudERlbGV0ZVRvZ2dsZSdcbiAgICAnY2xpY2sgLnNwX2Fzc2Vzc21lbnRfZGVsZXRlX2NvbmZpcm0nIDogJ2Fzc2Vzc21lbnREZWxldGUnXG4gICAgJ2NsaWNrIC5zcF9jb3B5JyAgICAgICAgICAgICAgICAgICAgICA6ICdjb3B5VG8nXG4gICAgJ2NsaWNrIC5zcF9kdXBsaWNhdGUnICAgICAgICAgICAgICAgICA6ICdkdXBsaWNhdGUnXG4gICAgJ2NsaWNrIC5zcF91cGRhdGUnICAgICAgICAgICAgICAgICAgICA6ICd1cGRhdGUnXG4gICAgJ2NsaWNrIC5zcF9wcmludCcgICAgICAgICAgICAgICAgICAgICA6ICd0b2dnbGVQcmludCdcbiAgICAnY2xpY2sgLmFyY2hpdmUnICAgICAgICAgICAgICAgICAgICAgIDogJ2FyY2hpdmUnXG5cbiAgICAnY2hhbmdlICNwcmludF9mb3JtYXQnICAgICAgICAgICAgIDogJ3ByaW50J1xuICB9XG5cbiAgYmxhbmtSZXN1bHRDb3VudDogXCItXCJcblxuICBpbml0aWFsaXplOiAob3B0aW9ucykgLT5cblxuICAgICMgZXZlbnRzXG4gICAgIyBvcHRpb25zLm1vZGVsLm9uIFwicmVzdWx0Q291bnRcIiwgQHVwZGF0ZVJlc3VsdENvdW50XG5cbiAgICAjYXJndW1lbnRzXG4gICAgQG1vZGVsICAgID0gb3B0aW9ucy5tb2RlbFxuICAgIEBwYXJlbnQgICA9IG9wdGlvbnMucGFyZW50XG5cbiAgICAjIHN3aXRjaGVzIGFuZCB0aGluZ3NcbiAgICBAaXNBZG1pbiAgICAgPSBUYW5nZXJpbmUudXNlci5pc0FkbWluKClcblxuICByZXNwb25kVG9MaW5rOiAoZXZlbnQpIC0+XG4gICAgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KVxuICAgIHJvdXRlICAgPSAkdGFyZ2V0LmF0dHIoXCJocmVmXCIpXG4gICAgVGFuZ2VyaW5lLnJvdXRlci5uYXZpZ2F0ZShyb3V0ZSwgdHJ1ZSlcblxuXG4gIGR1cGxpY2F0ZTogLT5cbiAgICBuZXdOYW1lID0gXCJDb3B5IG9mIFwiICsgQG1vZGVsLmdldChcIm5hbWVcIilcbiAgICBAbW9kZWwuZHVwbGljYXRlIHsgbmFtZSA6IG5ld05hbWUgfSwgbnVsbCwgbnVsbCwgKGFzc2Vzc21lbnQpID0+XG4gICAgICBAbW9kZWwudHJpZ2dlciBcIm5ld1wiLCBhc3Nlc3NtZW50XG5cbiAgY29weVRvOiAoZ3JvdXApIC0+XG4gICAgQG1vZGVsLnJlcGxpY2F0ZSBncm91cCwgPT5cbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IFRhbmdlcmluZS5zZXR0aW5ncy51cmxJbmRleChncm91cCwgXCJhc3Nlc3NtZW50c1wiKVxuXG4gIGdob3N0TG9naW46ID0+XG4gICAgVGFuZ2VyaW5lLnVzZXIuZ2hvc3RMb2dpbiBUYW5nZXJpbmUuc2V0dGluZ3MudXBVc2VyLCBUYW5nZXJpbmUuc2V0dGluZ3MudXBQYXNzXG5cbiAgdXBkYXRlOiA9PlxuICAgIFV0aWxzLm1pZEFsZXJ0IFwiVmVyaWZ5aW5nIGNvbm5lY3Rpb25cIlxuICAgIFV0aWxzLndvcmtpbmcgdHJ1ZVxuXG4gICAgQG1vZGVsLnZlcmlmeUNvbm5lY3Rpb25cbiAgICAgIGVycm9yOiA9PlxuICAgICAgICBVdGlscy53b3JraW5nIGZhbHNlXG4gICAgICAgIFV0aWxzLm1pZEFsZXJ0IFwiVmVyaWZ5aW5nIGNvbm5lY3Rpb248YnI+UGxlYXNlIHJldHJ5IHVwZGF0ZS5cIlxuICAgICAgICBfLmRlbGF5ID0+XG4gICAgICAgICAgQGdob3N0TG9naW4oKVxuICAgICAgICAsIDUwMDBcblxuICAgICAgc3VjY2VzczogPT5cbiAgICAgICAgVXRpbHMud29ya2luZyBmYWxzZVxuICAgICAgICBAbW9kZWwub24gXCJzdGF0dXNcIiwgKG1lc3NhZ2UpID0+XG4gICAgICAgICAgaWYgbWVzc2FnZSA9PSBcImltcG9ydCBsb29rdXBcIlxuICAgICAgICAgICAgVXRpbHMubWlkQWxlcnQgXCJVcGRhdGUgc3RhcnRpbmdcIlxuICAgICAgICAgIGVsc2UgaWYgbWVzc2FnZSA9PSBcImltcG9ydCBzdWNjZXNzXCJcbiAgICAgICAgICAgIFV0aWxzLm1pZEFsZXJ0IFwiVXBkYXRlZFwiXG4gICAgICAgICAgICBVdGlscy53b3JraW5nIGZhbHNlXG4gICAgICAgICAgICBAbW9kZWwuZmV0Y2hcbiAgICAgICAgICAgICAgc3VjY2VzczogPT5cbiAgICAgICAgICAgICAgICBAcmVuZGVyKClcbiAgICAgICAgICBlbHNlIGlmIG1lc3NhZ2UgPT0gXCJpbXBvcnQgZXJyb3JcIlxuICAgICAgICAgICAgVXRpbHMud29ya2luZyBmYWxzZVxuICAgICAgICAgICAgVXRpbHMubWlkQWxlcnQgXCJVcGRhdGUgZmFpbGVkXCJcbiAgICAgICAgVXRpbHMud29ya2luZyB0cnVlXG4gICAgICAgIEBtb2RlbC51cGRhdGVGcm9tU2VydmVyKClcblxuICB0b2dnbGVQcmludDogLT5cbiAgICBAJGVsLmZpbmQoXCIucHJpbnRfZm9ybWF0X3dyYXBwZXJcIikudG9nZ2xlKClcblxuICBwcmludDogLT5cbiAgICBmb3JtYXQgPSBAJGVsLmZpbmQoXCIjcHJpbnRfZm9ybWF0IG9wdGlvbjpzZWxlY3RlZFwiKS5hdHRyKFwiZGF0YS1mb3JtYXRcIilcblxuICAgIGlmIGZvcm1hdCA9PSBcImNhbmNlbFwiXG4gICAgICBAJGVsLmZpbmQoXCIucHJpbnRfZm9ybWF0X3dyYXBwZXJcIikudG9nZ2xlKClcbiAgICAgIEAkZWwuZmluZChcIiNwcmludF9mb3JtYXRcIikudmFsKFwicmVzZXRcIilcbiAgICAgIHJldHVyblxuXG4gICAgVGFuZ2VyaW5lLnJvdXRlci5uYXZpZ2F0ZSBcInByaW50LyN7QG1vZGVsLmlkfS8je2Zvcm1hdH1cIiwgdHJ1ZVxuXG5cbiAgdXBkYXRlUmVzdWx0Q291bnQ6ID0+XG4gICAgI0ByZXN1bHRDb3VudCA9IE1hdGguY29tbWFzIEBtb2RlbC5yZXN1bHRDb3VudFxuICAgICNAJGVsLmZpbmQoXCIucmVzdWx0X2NvdW50XCIpLmh0bWwgXCJSZXN1bHRzIDxiPiN7QHJlc3VsdENvdW50fTwvYj5cIlxuXG4gIGFyY2hpdmU6IC0+XG4gICAgcmVzdWx0ID0gQCRlbC5maW5kKFwiLmFyY2hpdmUgOnNlbGVjdGVkXCIpLnZhbCgpID09IFwidHJ1ZVwiXG4gICAgaWYgcmVzdWx0ID09IHRydWVcbiAgICAgIEAkZWwuZmluZChcIi5hZG1pbl9uYW1lXCIpLmFkZENsYXNzIFwiYXJjaGl2ZWRfYXNzZXNzbWVudFwiXG4gICAgZWxzZVxuICAgICAgQCRlbC5maW5kKFwiLmFkbWluX25hbWVcIikucmVtb3ZlQ2xhc3MgXCJhcmNoaXZlZF9hc3Nlc3NtZW50XCJcblxuICAgIEBtb2RlbC5zYXZlXG4gICAgICBhcmNoaXZlZCA6IHJlc3VsdFxuICAgIHJldHVybiB0cnVlXG5cbiAgYXNzZXNzbWVudE1lbnVUb2dnbGU6IC0+XG4gICAgQCRlbC5maW5kKCcuYXNzZXNzbWVudF9tZW51X3RvZ2dsZScpLnRvZ2dsZUNsYXNzKCdzcF9kb3duJykudG9nZ2xlQ2xhc3MoJ3NwX3JpZ2h0JylcbiAgICBAJGVsLmZpbmQoJy5hc3Nlc3NtZW50X21lbnUnKS50b2dnbGUoKVxuXG4gIGFzc2Vzc21lbnREZWxldGVUb2dnbGU6IC0+XG4gICAgQCRlbC5maW5kKFwiLnNwX2Fzc2Vzc21lbnRfZGVsZXRlX2NvbmZpcm1cIikudG9nZ2xlKCk7IGZhbHNlXG5cbiAgIyBkZWVwIG5vbi1nZXJuZXJpYyBkZWxldGVcbiAgYXNzZXNzbWVudERlbGV0ZTogPT5cbiAgICAjIHJlbW92ZXMgZnJvbSBjb2xsZWN0aW9uXG4gICAgQG1vZGVsLmRlc3Ryb3koKVxuXG4gIHNwcml0ZUxpc3RMaW5rOiAoIHRhZ05hbWUsIG5hbWVzLi4uICkgLT5cbiAgICByZXN1bHQgPSBcIlwiXG4gICAgZm9yIG5hbWUgaW4gbmFtZXNcbiAgICAgIHJlc3VsdCArPSBcIjwje3RhZ05hbWV9IGNsYXNzPSdzcF8je25hbWUudW5kZXJzY29yZSgpfSc+PGEgaHJlZj0nIyN7bmFtZX0vI3tAbW9kZWwuaWR9Jz4je25hbWUudW5kZXJzY29yZSgpLnRpdGxlaXplKCl9PC9hPjwvI3t0YWdOYW1lfT5cIlxuICAgIHJldHVybiByZXN1bHRcblxuICBzcHJpdGVFdmVudHM6ICggdGFnTmFtZSwgbmFtZXMuLi4pIC0+XG4gICAgcmVzdWx0ID0gXCJcIlxuICAgIGZvciBuYW1lIGluIG5hbWVzXG4gICAgICByZXN1bHQgKz0gXCI8I3t0YWdOYW1lfT48YnV0dG9uIGNsYXNzPSdzcF8je25hbWUudW5kZXJzY29yZSgpfScgdGl0bGU9JyN7bmFtZS51bmRlcnNjb3JlKCkudGl0bGVpemUoKX0nPiN7bmFtZS51bmRlcnNjb3JlKCkudGl0bGVpemUoKX08L2J1dHRvbj48LyN7dGFnTmFtZX0+IFwiXG4gICAgcmV0dXJuIHJlc3VsdFxuXG4gIHVsOiAob3B0aW9ucyktPlxuXG4gICAgaHRtbCA9IFwiPHVsICN7aWYgb3B0aW9ucy5jc3NDbGFzcyB0aGVuIFwiY2xhc3M9JyN7b3B0aW9ucy5jc3NDbGFzc30nXCIgZWxzZSAnJ30+XCJcbiAgICBodG1sICs9IEBzcHJpdGVMaXN0TGluay5hcHBseSBALCBbXCJsaVwiXS5jb25jYXQob3B0aW9ucy5saW5rcylcbiAgICBodG1sICs9IG9wdGlvbnMub3RoZXIgfHwgJydcbiAgICBodG1sICs9IFwiPC91bD5cIlxuXG4gIHJlbmRlcjogLT5cblxuICAgIGlzQXJjaGl2ZWQgPSBAbW9kZWwuZ2V0Qm9vbGVhbignYXJjaGl2ZWQnKVxuXG4gICAgIyBjb21tYW5kc1xuXG4gICAgIyBpbmRpY2F0b3JzIGFuZCB2YXJpYWJsZXNcbiAgICBhcmNoaXZlQ2xhc3MgICAgID0gaWYgaXNBcmNoaXZlZCB0aGVuIFwiIGFyY2hpdmVkX2Fzc2Vzc21lbnRcIiBlbHNlIFwiXCJcblxuICAgIHRvZ2dsZUJ1dHRvbiAgICAgPSBcIjxkaXYgY2xhc3M9J2Fzc2Vzc21lbnRfbWVudV90b2dnbGUgc3BfcmlnaHQnPjxkaXY+PC9kaXY+PC9kaXY+XCJcbiAgICBuYW1lICAgICAgICAgICAgID0gXCI8YnV0dG9uIGNsYXNzPSduYW1lIGNsaWNrYWJsZSc+I3tAbW9kZWwuZ2V0KCduYW1lJyl9PC9idXR0b24+XCJcbiAgICBhZG1pbk5hbWUgICAgICAgID0gXCI8YnV0dG9uIGNsYXNzPSdhZG1pbl9uYW1lIGNsaWNrYWJsZSAje2FyY2hpdmVDbGFzc30nPiN7QG1vZGVsLmdldCgnbmFtZScpfTwvYnV0dG9uPlwiXG4gICAgYWRtaW5SZXN1bHRDb3VudCA9IFwiPGxhYmVsIGNsYXNzPSdyZXN1bHRfY291bnQgc21hbGxfZ3JleSBub19oZWxwJyB0aXRsZT0nUmVzdWx0IGNvdW50LiBDbGljayB0byB1cGRhdGUuJz5SZXN1bHRzIDxiPiN7QHJlc3VsdENvdW50fTwvYj48L2xhYmVsPlwiXG4gICAgcmVzdWx0Q291bnQgICAgICA9IFwiPHNwYW4gY2xhc3M9J3Jlc3VsdF9jb3VudCBub19oZWxwJz5SZXN1bHRzIDxiPiN7QHJlc3VsdENvdW50fTwvYj48L3NwYW4+XCJcbiAgICBzZWxlY3RlZCAgICAgICAgID0gXCIgc2VsZWN0ZWQ9J3NlbGVjdGVkJ1wiXG5cbiAgICBkZWxldGVDb25maXJtICAgPSBcIjxzcGFuIGNsYXNzPSdzcF9hc3Nlc3NtZW50X2RlbGV0ZV9jb25maXJtIGNvbmZpcm1hdGlvbic+PGRpdiBjbGFzcz0nbWVudV9ib3gnPkNvbmZpcm0gPGJ1dHRvbiBjbGFzcz0nc3BfYXNzZXNzbWVudF9kZWxldGVfeWVzIGNvbW1hbmRfcmVkJz5EZWxldGU8L2J1dHRvbj4gPGJ1dHRvbiBjbGFzcz0nc3BfYXNzZXNzbWVudF9kZWxldGVfY2FuY2VsIGNvbW1hbmQnPkNhbmNlbDwvYnV0dG9uPjwvZGl2Pjwvc3Bhbj5cIlxuXG4gICAgcHJpbnRTZWxlY3RvciAgID0gXCJcbiAgICAgIDxkaXYgY2xhc3M9J3ByaW50X2Zvcm1hdF93cmFwcGVyIGNvbmZpcm1hdGlvbic+XG4gICAgICAgIDxzZWxlY3QgaWQ9J3ByaW50X2Zvcm1hdCc+XG4gICAgICAgIDxvcHRpb24gZGlzYWJsZWQ9J2Rpc2FibGVkJyBzZWxlY3RlZD0nc2VsZWN0ZWQnIHZhbHVlPSdyZXNldCc+U2VsZWN0IGEgcHJpbnQgZm9ybWF0PC9vcHRpb24+XG4gICAgICAgICN7KFwiPG9wdGlvbiBkYXRhLWZvcm1hdD0nI3tmb3JtYXQua2V5fSc+I3tmb3JtYXQubmFtZX08L29wdGlvbj5cIikgZm9yIGZvcm1hdCBpbiBUYW5nZXJpbmUuc2V0dGluZ3MuY29uZmlnLmdldChcInByaW50Rm9ybWF0c1wiKX1cbiAgICAgICAgPG9wdGlvbiBkYXRhLWZvcm1hdD0nY2FuY2VsJz5DYW5jZWw8L29wdGlvbj5cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2Rpdj5cbiAgICBcIlxuXG4gICAgZG93bmxvYWRLZXkgICA9IFwiPGxpIGNsYXNzPSdkb3dubG9hZF9rZXkgc21hbGxfZ3JleSc+RG93bmxvYWQga2V5IDxiPiN7QG1vZGVsLmdldChcIl9pZFwiKS5zdWJzdHIoLTUsNSl9PC9iPjwvbGk+XCJcbiAgICBhcmNoaXZlU3dpdGNoID0gXCJcbiAgICAgIDxzZWxlY3QgY2xhc3M9J2FyY2hpdmUnPlxuICAgICAgICA8b3B0aW9uIHZhbHVlPSdmYWxzZScgI3tpZiBpc0FyY2hpdmVkIHRoZW4gc2VsZWN0ZWQgZWxzZSAnJ30+QWN0aXZlPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24gdmFsdWU9J3RydWUnICAje2lmIGlzQXJjaGl2ZWQgdGhlbiBzZWxlY3RlZCBlbHNlICcnfT5BcmNoaXZlZDwvb3B0aW9uPlxuICAgICAgPC9zZWxlY3Q+XG4gICAgXCJcblxuICAgIGlmIEBpc0FkbWluXG4gICAgICAjIGFkbWluIHN0YW5kYXJkXG4gICAgICBAJGVsLmh0bWwgXCJcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAje3RvZ2dsZUJ1dHRvbn1cbiAgICAgICAgICAje2FkbWluTmFtZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICN7QHVsXG4gICAgICAgICAgY3NzQ2xhc3MgOiBcImFzc2Vzc21lbnRfbWVudVwiXG4gICAgICAgICAgbGlua3MgOiBbXCJydW5cIiwgXCJkYXRhRW50cnlcIiwgXCJyZXN1bHRzXCIsIFwiZWRpdFwiLCBcInN5bmNcIiwgXCJwcmludFwiIF1cbiAgICAgICAgICBvdGhlciA6IEBzcHJpdGVFdmVudHMoXCJsaVwiLCBcImR1cGxpY2F0ZVwiLCBcImFzc2Vzc21lbnRfZGVsZXRlXCIpICsgZG93bmxvYWRLZXlcbiAgICAgICAgfVxuICAgICAgICA8ZGl2IGNsYXNzPSdzdWJfbWVudXMnPlxuICAgICAgICAgICN7ZGVsZXRlQ29uZmlybX1cbiAgICAgICAgICAje3ByaW50U2VsZWN0b3J9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcIlxuXG4gICAgZWxzZSBpZiBAaXNBZG1pbiBhbmQgVGFuZ2VyaW5lLnNldHRpbmdzLmdldEJvb2xlYW4oJ3NhdGVsbGl0ZScpXG5cbiAgICAgIEAkZWwuaHRtbCBcIlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICN7dG9nZ2xlQnV0dG9ufVxuICAgICAgICAgICN7YWRtaW5OYW1lfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICAje0B1bFxuICAgICAgICAgIGNzc0NsYXNzOiBcImFzc2Vzc21lbnRfbWVudVwiXG4gICAgICAgICAgbGlua3MgOiBbXCJydW5cIixcInJlc3VsdHNcIixcImVkaXRcIixcInN5bmNcIixcInByaW50XCJdXG4gICAgICAgICAgb3RoZXIgOiBAc3ByaXRlRXZlbnRzKFwibGlcIiwgXCJkdXBsaWNhdGVcIiwgXCJhc3Nlc3NtZW50X2RlbGV0ZVwiKSArIGRvd25sb2FkS2V5XG4gICAgICAgIH1cbiAgICAgICAgPGRpdiBjbGFzcz0nc3ViX21lbnVzJz5cbiAgICAgICAgICAje2RlbGV0ZUNvbmZpcm19XG4gICAgICAgICAgI3twcmludFNlbGVjdG9yfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIFwiXG5cbiAgICBlbHNlXG4gICAgICBAJGVsLmh0bWwgXCJcbiAgICAgICAgPGRpdiBjbGFzcz0nbm9uX2FkbWluJz5cbiAgICAgICAgICAje0BzcHJpdGVMaXN0TGluayhcInNwYW5cIiwncnVuJyl9I3tuYW1lfSAje0BzcHJpdGVMaXN0TGluayhcInNwYW5cIiwncmVzdWx0cycpfSAje0BzcHJpdGVMaXN0TGluayhcInNwYW5cIiwncHJpbnQnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9J3N1Yl9tZW51cyc+XG4gICAgICAgICAgI3twcmludFNlbGVjdG9yfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIFwiXG5cblxuICAgIEB0cmlnZ2VyIFwicmVuZGVyZWRcIlxuIl19