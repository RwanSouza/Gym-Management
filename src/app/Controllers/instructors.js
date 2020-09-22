const Instructor = require('../models/instructor');
const { date, age } = require('../lib/utils');

module.exports = {
  index(req, res){

    const { filter } = req.query

    if (filter) {
      Instructor.findBy(filter, function(instructors){
        return res.render('instructors/index', { instructors, filter })
      });
    } else {
      Instructor.all(function(instructors){
        return res.render('instructors/index', { instructors });
      });
    } 
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
    });
  },

  post(req, res){
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") 
        return res.send('Please, fill all fields!');
    }

    Instructor.create(req.body, function(instructor){
      return res.redirect(`/instructors/${instructor.id}` );
    });
  },

  edit(req, res){
    Instructor.find(req.params.id, function(instructor){

      instructor.birth = date(instructor.birth).iso;
    
      return res.render('instructors/edit', { instructor});
    });
  },

  put(req, res){
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") 
        return res.send('Please, fill all fields!');
    }

    Instructor.update(req.body, function(){
      return res.redirect(`/instructors/${req.body.id}`)
    });
  },

  delete(req, res){
    Instructor.delete(req.body.id, function(){
      return res.redirect(`/instructors/`)
    });
  },
}


