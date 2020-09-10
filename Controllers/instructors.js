const fs = require('fs');
const data = require('../data.json');
const { date, age } = require('../utils/age');

// Show;
exports.show = (req, res) => {
  const { id } = req.params;

  const foundInstructor = data.instructors.find((instructor) =>  { return id == instructor.id });

  if(!foundInstructor) return res.send('Instructor not found');

  const instructor = {
    ...foundInstructor,
    age: age(foundInstructor.birth),
    services: foundInstructor.services.split(','),
    created_at: new Intl.DateTimeFormat('en-US').format(foundInstructor.created_at),
  }

  return res.render('instructors/show', { instructor });
}

// Create;
exports.post = (req, res) => {
  const keys = Object.keys(req.body)

  for(key of keys) {
    if(req.body[key] == "") 
      return res.send('Please, fill all fields!');
  }
  
  let { avatar_url, name, birth, gender, services } = req.body;

  birth = Date.parse(birth);
  created_at = Date.now();
  id = Number(data.instructors.length + 1);
  
  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
    if(err) return res.send('Write file error!');

    return res.redirect('/instructors');
  });

};

// edit
exports.edit = (req, res) => {
  const { id } = req.params;

  const foundInstructor = data.instructors.find((instructor) =>  { return id == instructor.id });

  if(!foundInstructor) return res.send('Instructor not found!');

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth),
  }

  return res.render('instructors/edit', {instructor});
}

// put

exports.put = (req, res) => {
  const { id } = req.body;

  const foundInstructor = data.instructors.find((instructor) =>  { return id == instructor.id });

  if(!foundInstructor) return res.send('Instructor not found!');

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth)
  }

  data.instructors[id - 1] = instructor;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send('Write error');

    return res.redirect(`/instructors/${id}`);
  });
}

// delete
exports.delete =(req, res) => {
  const { id } = req.body;

  const filteredInstructors = data.instructors.filter((instructor) => {
    return  instructor.id != id;
  });

  data.instructors = filteredInstructors;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send('Write error');

    return res.redirect(`/instructors/`);
  });
}