const {
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { CreateAccountDialog, CREATE_ACCOUNT_DIALOG } = require('./createAccountDialog');

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const USER = 'USER';

class MainDialog extends ComponentDialog {
    constructor(userState) {
        super(MAIN_DIALOG);
        this.userState = userState;
        this.userProfileAccessor = userState.createProperty(USER);

        this.addDialog(new CreateAccountDialog(userState));
        this.addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                this.initialStep.bind(this),
                this.finalStep.bind(this)
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async initialStep(stepContext) {
        return await stepContext.beginDialog(CREATE_ACCOUNT_DIALOG);
    }

    async finalStep(stepContext) {
        const userInfo = stepContext.result;
        const status = 'DONE';
        await stepContext.context.sendActivity(status);
        await this.userProfileAccessor.set(stepContext.context, userInfo);
        return await stepContext.endDialog();
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;
