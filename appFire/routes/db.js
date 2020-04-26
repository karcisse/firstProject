var express = require('express');
var admin = require('firebase-admin');
var router = express.Router();

var serviceAccount = require('../database/db_config.json');

// firebase setup
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://infosysdesign-4a619.firebaseio.com/'
});

var appName = 'app name loading';
var version = 'loading version ';
var persons = [];
var car = {};

var db = admin.database();

var personsRef = db.ref('persons');
personsRef.on('value', snap => persons = snap.val());
db.ref('car')
    .on('value', snap => car = snap.val());
db.ref('version')
    .on('value', snap => version = snap.val());
db.ref('appName')
    .on('value', snap => appName = snap.val());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('db', {
      appName,
      version,
      persons: persons,
      car
  })
});

const setAndRedirect = (res, newPersons) => personsRef.set(newPersons).then(() => res.redirect('/db'));

router.post('/add', (req, res) => {
    var newPerson = { ...req.body };
    setAndRedirect(res, persons.concat([newPerson]));
})

router.post('/update', (req, res) => {
    var newPerson = { ...req.body };
    setAndRedirect(res, persons.map(p => p.id === newPerson.id ? newPerson : p));
})

router.post('/remove', (req, res) => {
    var idToRemove = req.body.id;
    setAndRedirect(res, persons.filter(p => p.id !== idToRemove));
})
module.exports = router;
