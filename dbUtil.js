/* eslint-disable handle-callback-err */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const URL =
'mongodb://helloworld1:vQFvFtlzxTuJrISzLKy5HipTrSuGdFCN7fDXs2lbBMOFfOCyqADN2eRkOy33hadyn2UEyXrrOiinZpAqKWkE2w%3D%3D@helloworld1.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@helloworld1@';
  const uuidv4 = require('uuid/v4');

class DBUtil {
  insertUser(document, callback) {
    MongoClient.connect(URL, function(err, client) {
      const db = client.db("userdb");
      db.collection("users").insertOne(
        {
          _id: uuidv4(),
          name: document.name,
          age: document.age,
          contact: document.contact,
          email: document.email,
          picture: document.picture,
          policies: document.policies || []
        },
        function(err, result) {
          if (callback) {
            callback(result);
          }
        }
      );
    });
  }

  fetchPolicies(callback) {
    MongoClient.connect(URL, function(err, client) {
      const db = client.db("userdb");
      const policies = [];
      const cursor = db
        .collection("policies")
        .find({})
        .toArray(function(err, result) {
          if (result) {
            callback(result);
          }
        });
    });
  }

  //we do not need callback here
  async fetchPoliciesNew(callback) {
    const client = await MongoClient.connect(URL);
    const db = client.db("userdb");
    const policies = [];
    const results = await db
      .collection("policies")
      .find({})
      .toArray();
    return results;
  }

  async fetchHospitals(collection) {
    const client = await MongoClient.connect(URL);
    const db = client.db("userdb");
    const policies = [];
    const results = await db
      .collection(collection)
      .find({})
      .toArray();
    return results;
  }
  // findUser(db, id, callback) {
  //     const user = db.collection("users").find({"_id": id});
  //     user.each(function(err, doc) {
  //         console.log(doc);
  //         callback(doc);
  //     })
}

module.exports.DBUtil = DBUtil;
