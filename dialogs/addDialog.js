const {
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { User } = require('../user');

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const POLICY_PROMPT = 'POLICY_PROMPT';
const ADD_DIALOG = "ADD_DIALOG";

const {SearchDialog, SEARCH_DIALOG} = require("./searchDialog");

/** 
This dialog adds an existing policy to the bot.
**/ 
class AddDialog extends ComponentDialog {
    constructor(userState) {
        super(ADD_DIALOG);

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new TextPrompt(POLICY_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new SearchDialog(userState));

        this.addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                this.policyTypeStep.bind(this),
                this.policyProviderStep.bind(this),
                this.policyNumberStep.bind(this),
                this.summaryStep.bind(this)
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }


    async policyTypeStep(step) {
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please select the policy type:',
            choices: ChoiceFactory.toChoices(['Life', 'Vehicle'])
        });
    }

    async policyProviderStep(step) {
        const userProfile = await this.userProfile.get(
            step.context,
            new User()
        );
        userProfile.category = step.result.value;

        if (userProfile.category === "Life") {
          return await step.prompt(CHOICE_PROMPT, {
            prompt: "Please select the policy provider",
            choices: ChoiceFactory.toChoices([
              "ICICI",
              "BAJAJ",
              "AEGON_RELIGARE"
            ])
          });
        }
    }

    async policyNumberStep(step) {
        const userProfile = await this.userProfile.get(
          step.context,
          new User()
        );
        userProfile.provider = step.result.value;
        return await step.prompt(POLICY_PROMPT, 'Enter Policy Number');
    }

    async summaryStep(step) {
        const userProfile = await this.userProfile.get(
          step.context,
          new User()
        );
        userProfile.policyNumber = step.result.value;
        let msg = `Entered provider ${ userProfile.provider }`;
        await step.context.sendActivity(msg);
         return await step.beginDialog(SEARCH_DIALOG);
    }
}

module.exports.AddDialog = AddDialog;
module.exports.ADD_DIALOG = ADD_DIALOG;