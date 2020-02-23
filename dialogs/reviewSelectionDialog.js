const { ChoicePrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');

const REVIEW_SELECTION_DIALOG = 'REVIEW_SELECTION_DIALOG';

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class ReviewSelectionDialog extends ComponentDialog {
    constructor() {
        super(REVIEW_SELECTION_DIALOG);

        this.doneOption = 'done';

        this.companiesSelected = 'value-companiesSelected';

        this.companyOptions = ['Adatum Corporation', 'Contoso Suites', 'Graphic Design Institute', 'Wide World Importers'];

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.selectionStep.bind(this),
            this.loopStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async selectionStep(stepContext) {
        const list = Array.isArray(stepContext.options) ? stepContext.options : [];
        stepContext.values[this.companiesSelected] = list;

        let message = '';
        if (list.length === 0) {
            message = `Please choose a company to review, or \`${ this.doneOption }\` to finish.`;
        } else {
            message = `You have selected **${ list[0] }**. You can review an additional company, or choose \`${ this.doneOption }\` to finish.`;
        }

        const options = list.length > 0
            ? this.companyOptions.filter(function(item) { return item !== list[0]; })
            : this.companyOptions.slice();
        options.push(this.doneOption);

        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: message,
            retryPrompt: 'Please choose an option from the list.',
            choices: options
        });
    }

    async loopStep(stepContext) {
        const list = stepContext.values[this.companiesSelected];
        const choice = stepContext.result;
        const done = choice.value === this.doneOption;

        if (!done) {
            list.push(choice.value);
        }

        if (done || list.length > 1) {
            return await stepContext.endDialog(list);
        } else {
            return await stepContext.replaceDialog(REVIEW_SELECTION_DIALOG, list);
        }
    }
}

module.exports.ReviewSelectionDialog = ReviewSelectionDialog;
module.exports.REVIEW_SELECTION_DIALOG = REVIEW_SELECTION_DIALOG;
