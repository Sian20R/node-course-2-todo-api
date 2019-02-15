const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {mongoose} = require('./../db/mongoose');
const {authenticate} = require('./../middleware/authenticate');

const {User} = require('./../models/user');

router.post('/', async (req, res) => {
    
    // Saving the users into db
   try {
       let body = _.pick(req.body, ['email', 'password']);
       let user = new User(body);
       await user.save();
       let token = await user.generateAuthToken();
       console.log(token);
       res.header('x-auth', token).send(user);
   } catch (e) {
       res.status(400).send(e);
   }
});

router.get('/me', authenticate, async (req, res) => {
  await res.send(req.user);
});

router.post('/login', async (req, res) => {
   // Authenticate the user login and set the token on x-auth to validate the user is valid
   try {
       var body = _.pick(req.body, ['email', 'password']);

       var user =  await User.findByCredentials(body.email, body.password);
       var token = await user.generateAuthToken();
       res.header('x-auth', token).send(user);
   } catch (e) {
       res.status(400).send();
   } 
});

router.delete('/me/token', authenticate, async (req, res) => {
   try {
       await req.user.removeToken(req.token);
       res.status(200).send();
   } catch(e) {
        res.status(400).send();
   }
});

module.exports = router;