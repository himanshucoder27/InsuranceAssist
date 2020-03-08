const {
    ComponentDialog,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog,
    ChoicePrompt,
    ConfirmPrompt,
    AttachmentPrompt
} = require('botbuilder-dialogs');

const { AddDialog, ADD_DIALOG } = require('./addDialog');

const { MessageFactory } = require('botbuilder');
const { User } = require('../user');
const { channels } = require('botbuilder-dialogs/lib/choices/channel');
const emailValidator = require('email-validator');

const CREATE_ACCOUNT_DIALOG = 'CREATE_ACCOUNT_DIALOG';

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const EMAIL_PROMPT = 'EMAIL_PROMPT';
const USER_PROFILE = 'USER_PROFILE';

const { DBUtil } = require('../dbUtil');

/** 
This dialog creates a user account by asking for its details.
**/ 
class CreateAccountDialog extends ComponentDialog {
    constructor(userState) {
        super(CREATE_ACCOUNT_DIALOG);

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new TextPrompt(EMAIL_PROMPT, this.emailValidator));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.agePromptValidator));
        this.addDialog(
            new AttachmentPrompt(ATTACHMENT_PROMPT, this.picturePromptValidator)
        );
        this.addDialog(new AddDialog(userState));

        this.addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                this.nameStep.bind(this),
                this.emailStep.bind(this),
                this.mobileNoStep.bind(this),
                this.ageConfirmStep.bind(this),
                this.ageStep.bind(this),
                this.profilePictureStep.bind(this),
                this.pictureConfirmStep.bind(this),
                this.summaryStep.bind(this),
                this.searchStep.bind(this)
            ])
        );

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async nameStep(step) {
        return await step.prompt(
            NAME_PROMPT,
            'Hi, my name is Mysurance, What is your name?'
        );
    }

    async emailStep(step) {
        step.values.name = step.result;

        await step.context.sendActivity(`Thanks ${ step.result }.`);

        const promptOptions = {
            prompt: 'Please enter your email Id',
            retryPrompt: 'The value entered must be valid Email.'
        };

        return await step.prompt(EMAIL_PROMPT, promptOptions);
    }

    async mobileNoStep(step) {
        step.values.email = step.result;

        return await step.prompt(NUMBER_PROMPT, 'Enter your mobile number');
    }

    async ageConfirmStep(step) {
        step.values.contact = step.result;

        return await step.prompt(CONFIRM_PROMPT, 'Do you want to give your age?', [
            'yes',
            'no'
        ]);
    }

    async ageStep(step) {
        if (step.result) {
            const promptOptions = {
                prompt: 'Please enter your age.',
                retryPrompt:
          'The value entered must be greater than 0 and less than 150.'
            };

            return await step.prompt(NUMBER_PROMPT, promptOptions);
        } else {
            return await step.next(-1);
        }
    }

    async profilePictureStep(step) {
        step.values.age = step.result;

        const msg =
      step.values.age === -1
          ? 'No age given.'
          : `I have your age as ${ step.values.age }.`;

        await step.context.sendActivity(msg);

        if (step.context.activity.channelId === channels.msteams) {
            await step.context.sendActivity(
                'Skipping attachment prompt in Teams channel...'
            );
            return await step.next(undefined);
        } else {
            var promptOptions = {
                prompt:
          'Please attach a profile picture (or type any message to skip).',
                retryPrompt: 'The attachment must be a jpeg/png image file.'
            };

            return await step.prompt(ATTACHMENT_PROMPT, promptOptions);
        }
    }

    async pictureConfirmStep(step) {
        step.values.picture = step.result && step.result[0];

        return await step.prompt(CONFIRM_PROMPT, { prompt: 'Is this okay?' });
    }

    async summaryStep(step) {
        if (step.result) {
            const userProfile = await this.userProfile.get(
                step.context,
                new User()
            );
            userProfile.name = step.values.name;
            userProfile.age = step.values.age;
            userProfile.picture = step.values.picture;
            userProfile.email = step.values.email;
            userProfile.contact = step.values.contact;

            new DBUtil().insertUser(userProfile, function(data) {
                console.log('returned data', data.insertedId);
            });

            let msg = `I have your name as ${ userProfile.name }`;
            msg += ` and your mobile number as ${ userProfile.contact }`;
            msg += ` and your email as ${ userProfile.email }`;

            if (userProfile.age !== -1) {
                msg += ` and your age as ${ userProfile.age }`;
            }

            msg += '.';
            await step.context.sendActivity(msg);
            if (userProfile.picture) {
                try {
                    await step.context.sendActivity(
                        MessageFactory.attachment(
                            userProfile.picture,
                            'This is your profile picture.'
                        )
                    );
                } catch {
                    await step.context.sendActivity(
                        'A profile picture was saved but could not be displayed here.'
                    );
                }
            }
        } else {
            await step.context.sendActivity('Thanks. Your profile will not be kept.');
        }
        return await step.beginDialog(ADD_DIALOG);
    }

    async searchStep(step) {
        // TODO: new
        return await step.endDialog();
    }

    async agePromptValidator(promptContext) {
        return promptContext.recognized.succeeded;
    }

    async emailValidator(promptContext) {
        return emailValidator.validate(promptContext.recognized.value);
    }

    async picturePromptValidator(promptContext) {
        if (promptContext.recognized.succeeded) {
            var attachments = promptContext.recognized.value;
            var validImages = [];

            attachments.forEach(attachment => {
                if (
                    attachment.contentType === 'image/jpeg' ||
          attachment.contentType === 'image/png'
                ) {
                    validImages.push(attachment);
                }
            });

            promptContext.recognized.value = validImages;

            return !!validImages.length;
        } else {
            await promptContext.context.sendActivity(
                'No attachments received. Proceeding without a profile picture...'
            );

            return true;
        }
    }
}

module.exports.CreateAccountDialog = CreateAccountDialog;
module.exports.CREATE_ACCOUNT_DIALOG = CREATE_ACCOUNT_DIALOG;
