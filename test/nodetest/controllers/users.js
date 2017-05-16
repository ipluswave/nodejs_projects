var mongoose = require('mongoose');
var User = require('../model/user');

var users = {};

/* POST to Add User Service */
users.create = function(req, res) {
  // Get our form values. These rely on the "name" attributes
  console.log('create');
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
  var age = req.body.age;

  User.create({
      "first_name" : firstName,
      "last_name" : lastName,
      "age": age
  }, function (err, user) {
      if (err) {
        res.json(err);
      }
      else {
        res.json(user);
      }
  });
};

/* GET users listing. */
users.getAll = function(req, res) {
  User.find(function(err, users){
    if (err)
      res.send(err);
    else
      res.json(users);
  });
};

users.get = function(req, res) {
  console.log('id:', req.params.id);
  var o_id = mongoose.Types.ObjectId(req.params.id);
  console.log('id=' + o_id);
  User.findOne(o_id, function(err, user) {
    if(err)
      res.json(err);
    else
      res.json(user);
  });
};

users.update = function(req, res) {
  console.log('update');
  // Get our form values. These rely on the "name" attributes
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
  var age = req.body.age;

  var o_id = mongoose.Types.ObjectId(req.params.id);

  console.log('updated user:', o_id);

  User.update(
    {
      "_id": o_id
    },
    {
      $set: {
        "first_name" : firstName,
        "last_name" : lastName,
        "age": age
      }
    }, function (err, user) {
        if (err) {
          res.json(err);
        }
        else {
          res.json(user);
        }
    });
};

users.delete = function(req, res) {
  var o_id = mongoose.Types.ObjectId(req.params.id);

  User.remove({
    "_id": mongoose.Types.ObjectId(req.params.id)
  }, function(err, user) {
    if (err)
      res.json(err);
    else
      res.json(user);
  });
};

module.exports = users;