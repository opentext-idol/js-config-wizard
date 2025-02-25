define([
    'backbone',
    'text!config-wizard/templates/welcome.html'
], function(Backbone, template) {

    return Backbone.View.extend({

        template: _.template(template),

        initialize: function(options) {
            this.options = options;
        },

        render: function(){
            this.$el.html(this.template(this.options));
        }
    });
});