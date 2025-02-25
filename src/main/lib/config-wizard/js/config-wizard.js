define([
    'backbone',
    'js-utils/js/wizard-custom',
    'js-utils/js/empty-navbar',
    'underscore'
], function(Backbone, Wizard, Navigation, _) {

    return Backbone.View.extend({

        initialize: function(options) {
            _.bindAll(this, 'handleFinishedSetup', 'handleStepChanged');

            options = options || {};

            this.template = options.template;
            this.navigationEl = options.navigationEl;
            this.wizardEl = options.wizardEl;

            this.logoutUri = options.logoutUri;
            this.strings = options.strings;

            this.wizard = new Wizard({
                onFinished: this.handleFinishedSetup,
                onStepChanged: this.handleStepChanged,
                strings: options.strings,
                steps: options.steps
            });

            this.navigation = new Navigation({
                showLogout: false,
                strings: _.pick(options.strings, 'appName')
            });

            this.render();
        },

        render: function() {
            this.$el.html(this.template());
            this.wizard.setElement(this.$(this.wizardEl));
            this.wizard.render();

            this.navigation.render();
            this.wizard.renderActiveStep();

            this.$(this.navigationEl).append(this.navigation.el);
        },

        handleFinishedSetup: function(){
            var lastStep = this.wizard.getCurrentStep().view;
            var validateFunction = lastStep.validate;

            if(validateFunction && !lastStep.validate()) {
                return;
            }

            /* the below URL needs to be given as input if this file gets generalized to a library */
            window.location = this.logoutUri;
        },

        handleStepChanged: function() {
            var $loginButton = this.wizard.$('[data-last="Login"]');
            var isLastStep = this.wizard.$('.users-panel').hasClass('active');

            $loginButton.toggleClass('btn-warning', isLastStep)
                        .find('i').toggleClass('icon-arrow-right', !isLastStep).toggleClass('icon-hand-right', isLastStep);

            if(isLastStep) {
                $loginButton.attr('data-toggle', 'tooltip')
                            .tooltip({
                                title: this.strings.loginTooltip,
                                container: this.$el
                            });
            }
            else {
                $loginButton.tooltip('destroy');
            }
        }
    });
});