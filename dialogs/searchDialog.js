const {
  ComponentDialog,
  TextPrompt,
  WaterfallDialog
} = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");

const NAME_PROMPT = "NAME_PROMPT";
const USER_PROFILE = "USER_PROFILE";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
const SEARCH_DIALOG = "SEARCH_DIALOG";

const { DBUtil } = require("../dbUtil");
/**
 * Asks the user to enter disease, taking into account the disease, policy of user and hospitals covered for it, 
 * returns the hospital list which user can get admitted.
 */
class SearchDialog extends ComponentDialog {
  constructor(userState) {
    super(SEARCH_DIALOG);

    this.userProfile = userState.createProperty(USER_PROFILE);

    this.addDialog(new TextPrompt(NAME_PROMPT));

    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.searchStep.bind(this),
        this.searchResultStep.bind(this)
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async searchStep(step) {
    return await step.prompt(NAME_PROMPT, "Please enter the disease.");
  }

  async searchResultStep(step) {
    const diseaseIn = step.result;
    let dbUtils = new DBUtil();

    let pol = await dbUtils.fetchPoliciesNew();

     const validPolicies = pol.filter(policy => {
         if(policy.illness) {
             return (
               policy.illness.filter(name =>
                 name.toLowerCase().includes(diseaseIn.toLowerCase())
               ).length > 0
             );
         } else {
             return false;
         }
     });

     let results = [];
     for await(let policy of validPolicies) {
         let hospitals = await new DBUtil().fetchHospitals(policy.E2ESupplier);

         results = [...results, ...hospitals];
     }

    await step.context.sendActivity({
      attachments: [this.createAdaptiveCard(results)]
    });

    return await step.endDialog();
  }

  createAdaptiveCard(results) {
    let struct = {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.0",
      type: "AdaptiveCard"
    };

    const body = [];
    results.forEach(result => {
      body.push({
        type: "TextBlock",
        text: result.name,
        weight: "bolder",
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: result.address,
        wrap: true,
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: result.city,
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: result.state,
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: result.pin,
        isSubtle: false
      });

      body.push({
        type: "TextBlock",
        text: "",
        isSubtle: false
      });
    });
    struct.body = body;

    return CardFactory.adaptiveCard(struct);
  }
}

module.exports.SearchDialog = SearchDialog;
module.exports.SEARCH_DIALOG = SEARCH_DIALOG;
