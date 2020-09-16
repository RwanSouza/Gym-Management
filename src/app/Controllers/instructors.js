const Instructor = require('../models/instructor');
const { date, age } = require('../lib/utils');

module.exports = {
  index(req, res){

    Instructor.all(function(instructors){
      return res.render('instructors/index', {instructors});
    });
  },

  create(req, res){
    return res.render('instructors/create');
  },

  show(req, res){
    Instructor.find(req.params.id, function(instructor){

      instructor.age = age(instructor.birth);
      instructor.services = instructor.services.split(',');

      instructor.created_at = date(instructor.created_at).format;

      return res.render('instructors/show', { instructor});
    })
  },

  post(req, res){
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") 
        return res.send('Please, fill all fields!');
    }

    Instructor.create(req.body, function(instructor){
      return res.redirect(`/instructors/${instructor.id}` );
    })
  },

  edit(req, res){
    return
  },

  put(req, res){
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") 
        return res.send('Please, fill all fields!');
    }

    return
  },

  delete(req, res){
    return
  },
}


