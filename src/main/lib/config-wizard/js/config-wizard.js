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
                columnClass: options.columnClass,
                strings: options.strings,
                steps: options.steps ,
                wizardOptions: {
                    onStepChanging: this.handleStepChange,
                    onStepChanged: this.handleStepChanged,
                    onFinished: this.handleFinishedSetup
                }
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

        handleStepChange: function(e, currentIndex, newIndex) {
            if (newIndex > currentIndex) {
                var currentStep = this.wizard.getCurrentStep().view;

                if (currentStep.canChangeStep && !currentStep.canChangeStep()) {
                    return false;
                }
                else {
                    Wizard.prototype.handleStepChange.apply(this.wizard, arguments);
                }
            }

            return true;
        },

        handleFinishedSetup: function(){
            var lastStep = this.wizard.getCurrentStep().view;
            var validateFunction = lastStep.validate;

            if(validateFunction && !lastStep.validate()) {
                return;
            }

            window.location = this.logoutUri;
        },

        handleStepChanged: function(e, currentIndex, priorIndex) {
            var $loginButton = this.wizard.$('[data-last="Login"]');
            var isLastStep = currentIndex === this.wizard.steps.length - 1;

            $loginButton.toggleClass('btn-warning', isLastStep);

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