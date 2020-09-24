const Member = require('../models/member');
const { date, age } = require('../lib/utils');

module.exports = {
  index(req, res){
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 4
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(members) {

        const pagination = {
          total:Math.ceil(members[0].total / limit),
          page
        }

        return res.render('members/index', { members, filter, pagination });
      }
    }

    Member.paginate(params)

  },

  create(req, res){
    Member.instructorSelectOptions(function(options){
      
    return res.render('members/create', { instructorOptions: options});
    });
  },

  show(req, res){
    Member.find(req.params.id, function(member){

      member.age = age(member.birth);

      return res.render('members/show', { member});
    });
  },

  post(req, res){
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") 
        return res.send('Please, fill all fields!');
    }

    Member.create(req.body, function(member){
      return res.redirect(`/members/${member.id}` );
    });
  },

  edit(req, res){
    Member.find(req.params.id, function(member){

      member.birth = date(member.birth).iso;

      Member.instructorSelectOptions(function(options){
      
        return res.render('members/edit', { member, instructorOptions: options});
        });
    });
  },

  put(req, res){
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") 
        return res.send('Please, fill all fields!');
    }

    Member.update(req.body, function(){
      return res.redirect(`/members/${req.body.id}`)
    });
  },

  delete(req, res){
    Member.delete(req.body.id, function(){
      return res.redirect(`/members/`)
    });
  },
}


