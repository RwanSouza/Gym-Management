const express = require('express');
const instructors = require('./Controllers/instructors');

const routes = express.Router();

routes.get('/', (req, res ) => {
  return res.redirect('/instructors');
});

routes.get('/instructors', (req, res ) => {
  return res.render('instructors/index');
});

routes.get('/instructors/create', (req, res) => {
  return res.render('instructors/create');
});

routes.post('/instructors', instructors.post);

routes.get('/members', (req, res ) => {
  return res.send('members');
});

module.exports = routes;
