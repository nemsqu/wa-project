var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Avatar = require("../models/Avatar");
const jwt = require("jsonwebtoken");
const passport = require('passport');
var passportFile = require('../passport.js');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

router.post('/api/login',
  (req, res, next) => {
    User.findOne({name: req.body.name}, (err, user) =>{
    if(err) return res.send(err);
    if(!user) {
      return res.send({error: true});
    } else {
      //check password and create token
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if(err) return res.send(err);
        if(isMatch) {
          const jwtPayload = {
            id: user._id,
            name: user.name
          }
          jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: "1h"
            },
            (err, token) => {
              if(err) return res.send(err);
              res.json({success: true, token: token});
            }
          );
        } else {
          res.send({error: true});
        }
      })
    }
    })
});

router.post('/api/register', 
  (req, res) => {
    if(req.body.name.trim().length <1){
      res.send({nameError: "Name is required"})
      //check password length and contains
    } else if(req.body.password.trim().length < 8 || !req.body.password.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*., ?])")){
      res.send({passwordError: "Password is not strong enough. Need to have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character."});
    } else {
      User.findOne({name: req.body.name}, (err, user) => {
        if(err) {
          throw err;
        };
        if(user){
          return res.send({uniqueError: "Username already in use."});
        } else {
          //generate salt and save salted password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if(err) throw err;
              const today = new Date(Date.now());
              User.create(
                {
                  name: req.body.name,
                  email: req.body.email,
                  password: hash,
                  registerDate: today.toDateString(),
                  bio: "",
                  avatar: "",
                  commentVotes: [],
                  snippetVotes: []
                },
                (err, ok) => {
                  if(err) throw err;
                  res.json('ok');
                }
              );
            });
          });
        }
      });
    } 
});

//add votes for a user
router.get('/api/snippets/vote/:user/:snippet', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate({id: req.params.user}, {$push: {"commentVotes": req.params.snippet}}, {new: true}, (err, result) => {
    if(err) return res.send(err);
    return res.send("ok");
  })
})

//get user's data
router.get('/api/:name', (req, res) => {
  User.findOne({name: req.params.name}, (err, user) => {
    if(err) {
      return res.status(404).send({'error': error});
    }
    if(user){
      return res.send(user);
    }else {
      return res.send("No comments found");
    }
  })
});

//modify user's data, add new avatar if doesn't exist, return new data
router.post('/api/:id', passport.authenticate('jwt', { session: false }), upload.single('avatar'), (req, res) => {
  Avatar.findOneAndUpdate({user: req.params.id}, {
    encoding: req.file.encoding,
    mimetype: req.file.mimetype,
    buffer: req.file.buffer 
  }, {upsert: true, new: true}, ((err, avatar) => { 
    if(err) {
      return res.status(404).send({'error': error});
    }
    if(avatar){
      User.findOneAndUpdate({_id: avatar.user}, {
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio,
        avatar: avatar._id
      }, ((err, user) => { 
        if(err) {
          return res.status(404).send({'error': error});
        }
        if(user){
          return res.json("Profile updated succesfully.");
        }else {
          return res.send({error: "No user found."});
        }
      }))
    }else {
      return res.send({error: "Avatar could not be updated."});
    }
  }))
});

//update password
router.post('/api/update/password/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if(err) throw err;
      User.findOneAndUpdate({_id: req.params.id}, {
        password: hash
      }, ((err, user) => { 
        if(err) {
          return res.status(404).send({'error': error});
        }
        if(user){
          return res.json("Succesfully updated.");
        }else {
          return res.send("No comments found");
        }
      }))

    });
  });
});

//check password matches old password
router.post('/api/check/password', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  User.findById(req.body.id, (err, user) =>{
  if(err) return res.send({error: err});
  if(!user) {
    return res.json({error: "User could not be found"});
  } else {
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if(err) return res.send(err);
      if(isMatch) {
        res.json({success: true});
      } else {
        res.json({error: "Wrong password"});
      }
    })
  }
  })
});

//get user avatar
router.get('/api/avatar/:name', (req, res) => {
  User.findOne({name: req.params.name}, (err, user) => {
    if(err) {
      return res.status(404).send({'error': error});
    }
    if(user){
      Avatar.findOne({user: user._id}, (err, avatar) => {
        if(err) {
          return res.status(404).send({'error': error});
        }
        if(avatar){
          return res.header("Content-Type", avatar.mimetype).send(avatar.buffer);
        }else {
          return res.send({error: "No avatar found found"});
        }
      });
    }else {
      return res.send({error: "No user found found"});
    }
  })
});

module.exports = router;
