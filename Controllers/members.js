const fs = require('fs');
const data = require('../data.json');
const { date, age } = require('../utils/age');

// Index
exports.index = (req, res) => {
  
  return res.render('members/index', { members: data.members });
}

// Show;
exports.show = (req, res) => {
  const { id } = req.params;

  const foundMember = data.members.find((member) =>  { return id == member.id });

  if(!foundMember) return res.send('Member not found');

  const member = {
    ...foundMember,
    age: age(foundMember.birth),
  }

  return res.render('members/show', { member });
}

// Create
exports.create = (req, res) => {
  return res.render('members/create');
}

// Post;
exports.post = (req, res) => {
  const keys = Object.keys(req.body)

  for(key of keys) {
    if(req.body[key] == "") 
      return res.send('Please, fill all fields!');
  }
  
  let { avatar_url, name, email, birth, gender, blood, weight, height } = req.body;
  birth = Date.parse(birth);

  let id = 1;
  const lastMember = data.members[data.members.length -1];

  if(lastMember) {
    id = lastMember.id + 1
  }
  
  data.members.push({
    id,
    avatar_url,
    name,
    email,
    birth,
    gender,
    blood,
    weight,
    height,
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
    if(err) return res.send('Write file error!');

    return res.redirect('/members');
  });

};

// edit
exports.edit = (req, res) => {
  const { id } = req.params;

  const foundMember = data.members.find((member) =>  { return id == member.id });

  if(!foundMember) return res.send('Member not found!');

  const member = {
    ...foundMember,
    birth: date(foundMember.birth),
  }

  return res.render('members/edit', {member});
}

// put

exports.put = (req, res) => {
  const { id } = req.body;
  let memberIndex = 0;

  const foundMember = data.members.find((member, foundIndex) =>  {
     if(id == member.id) {
       memberIndex = foundIndex;
       return true;
     }});

  if(!foundMember) return res.send('Member not found!');

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id:Number(req.body.id)
  }

  data.members[memberIndex] = member;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send('Write error');

    return res.redirect(`/members/${id}`);
  });
}

// delete
exports.delete =(req, res) => {
  const { id } = req.body;

  const filteredMembers = data.members.filter((member) => {
    return  member.id != id;
  });

  data.members = filteredMembers;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send('Write error');

    return res.redirect(`/members/`);
  });
}