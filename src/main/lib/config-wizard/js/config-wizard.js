define([
    'backbone',
    'js-utils/js/wizard-custom',
    'js-utils/js/empty-navbar',
    'underscore'
], function(Backbone, Wizard, Navigation, _) {

    return Backbone.View.extend({

        initialize: function(options) {
            _.bindAll(this, 'handleFinishedSetup', 'handleStepChanged', 'handleStepChange');

            options = options || {};

            this.template = options.template;
            this.navigationEl = options.navigationEl;
            this.wizardEl = options.wizardEl;

            this.logoutUri = options.logoutUri;
            this.strings = options.strings;

            this.wizard = new Wizard({
                onFinished: this.handleFinishedSetup,
                onStepChange: this.handleStepChange,
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

        handleStepChange: function(e, data) {
            if (data.direction === 'next') {
                var currentStep = this.wizard.getCurrentStep().view;

                if (currentStep.canChangeStep && !currentStep.canChangeStep()) {
                    e.preventDefault(); //prevents wizard from going to next step
                }
                else {
                    Wizard.prototype.handleStepChange.apply(this.wizard, arguments);
                }
            }
        },

        handleFinishedSetup: function(){
            var lastStep = this.wizard.getCurrentStep().view;
            var validateFunction = lastStep.validate;

            if(validateFunction && !lastStep.validate()) {
                return;
            }

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