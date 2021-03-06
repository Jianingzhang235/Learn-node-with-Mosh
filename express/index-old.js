const config = require('config');

// const dotenv = require("dotenv").config();


const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
// const logger = require('./logger');
const authe= require('./authentica');

// var path = require('path');
const app = express();

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);
console.log(process.env.app_password);
//
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('mail.password'));//command line should be: password=1234 NODE_ENV=production nodemon index.js


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
// app.use(logger);
app.use(authe);
if(app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...');
};
app.use(helmet());


  
const courses = [
    {id:1,name:'course1'},
    {id:2,name:'course2'},
    {id:3,name:'course3'}

];


 app.get('/api/courses', (req, res) => {
     res.send(courses);
 });
 
 app.post('/api/courses', (req, res) => {
  const {error} = Joi.validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);  
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
  const course =courses.find(c=> c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('the course with the given id was not found');
  const {error} = Joi.validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  course.name = req.body.name;
  res.send(course);
});

function validateCourse(course) {
    const schema = {
        name:Joi.string().min(3).required()
    };
}

app.delete('/api/courses/:id', (req, res) => {
    const course =courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('the course with the given id was not found');
    
    //delete
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
});
 app.get('/api/courses/:id', (req, res) => {
    const course =courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('the course with the given id was not found');
    res.send(course);
});
//  app.get('/api/courses/:id', (req, res) => {
//   res.send(req.params.id);
// })
// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.params);
// });
// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.query);
// });
 //port IN TERMINAL :export PORT=5000//NO SPACE;
 const port = process.env.PORT || 3000;
 app.listen(port, () => console.log(`Listening on port ${port}`));