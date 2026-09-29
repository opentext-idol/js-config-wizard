const Backbone = require('backbone');
const template = require('../templates/welcome.html');

module.exports = Backbone.View.extend({

    template: _.template(template),

    initialize: function(options) {
        this.options = options;
    },

    render: function(){
        this.$el.html(this.template(this.options));
    }
});
