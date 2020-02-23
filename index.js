const path = require("path");
const restify = require("restify");

const {
  BotFrameworkAdapter,
  MemoryStorage,
  UserState,
  ConversationState
} = require("botbuilder");

const { DialogAndWelcomeBot } = require("./bots/dialogAndWelcomeBot");
const { MainDialog } = require("./dialogs/mainDialog");

const ENV_FILE = path.join(__dirname, ".env");
require("dotenv").config({ path: ENV_FILE });

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
  console.log(`\n${server.name} listening to ${server.url}`);
  console.log(
    "\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator"
  );
  console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});

const memoryStorage = new MemoryStorage();

const userState = new UserState(memoryStorage);
const conversationState = new ConversationState(memoryStorage);

const dialog = new MainDialog(userState);
const bot = new DialogAndWelcomeBot(conversationState, userState, dialog);

adapter.onTurnError = async (context, error) => {
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  await context.sendActivity("The bot encountered an error or bug.");
  await context.sendActivity(
    "To continue to run this bot, please fix the bot source code."
  );

  await conversationState.clear(context);
};

server.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async context => {
    await bot.run(context);
  });
});

// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');
// var url =
//   'mongodb://helloworld:hukZG00ak0ajoaRaAm7pzj60BsC67SLJMGkJE0gmUCFSCTeYIxgiJ68yYpgEvZrGZ39zqRHEorvKOgTbeB1wWA%3D%3D@helloworld.mongo.cosmos.azure.com:10255/?ssl=true&appName=@helloworld@';

// var insertDocument = function(db, callback) {
//     db.collection('families').insertOne(
//         {
//             id: 'AndersenFamily',
//             lastName: 'Andersen',
//             parents: [{ firstName: 'Thomas' }, { firstName: 'Mary Kay' }],
//             children: [{ firstName: 'John', gender: 'male', grade: 7 }],
//             pets: [{ givenName: 'Fluffy' }],
//             address: { country: 'USA', state: 'WA', city: 'Seattle' }
//         },
//         function(err, result) {
//             assert.equal(err, null);
//             console.log('Inserted a document into the families collection.');
//             callback();
//         }
//     );
// };

// var findFamilies = function(db, callback) {
//     var cursor = db.collection('families').find();
//     cursor.each(function(err, doc) {
//         assert.equal(err, null);
//         if (doc != null) {
//             console.dir(doc);
//         } else {
//             callback();
//         }
//     });
// };

// var updateFamilies = function(db, callback) {
//     db.collection('families').updateOne(
//         { lastName: 'Andersen' },
//         {
//             $set: { pets: [{ givenName: 'Fluffy' }, { givenName: 'Rocky' }] },
//             $currentDate: { lastModified: true }
//         },
//         function(err, results) {
//             console.log(results);
//             callback();
//         }
//     );
// };

// var removeFamilies = function(db, callback) {
//     db.collection('families').deleteMany({ lastName: 'Andersen' }, function(
//         err,
//         results
//     ) {
//         console.log(results);
//         callback();
//     });
// };

// MongoClient.connect(url, function(err, client) {
//     assert.equal(null, err);
//     var db = client.db('familiesdb');
//     insertDocument(db, function() {
//         findFamilies(db, function() {
//             updateFamilies(db, function() {
//                 client.close();
//                 // removeFamilies(db, function() {
//                 // });
//             });
//         });
//     });
// });