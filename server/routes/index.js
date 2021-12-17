var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const Snippet = require('../models/Snippet');
const Comment = require('../models/Comment');
const User = require('../models/User');
const passport = require('passport');


router.get('/api/snippets', function(req, res, next) {
  Snippet.find({}, (err, snippets) => {
    if(err) {
      return res.status(404).send({'error': error});
    }
    if(snippets){
      return res.send(snippets);
    }else {
      return res.send({error: "No snippets found"});
    }
  })
});

//post new snippet, escape HTML code
router.post('/api/snippet', passport.authenticate('jwt', { session: false }), [
  check('content').escape(),
  check('title').escape(),
  ], function(req, res, next) {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty){
      return res.status(400).json({errors: validationErrors.array()})
    }
    new Snippet({
      authorID: req.body.authorID,
      authorName: req.body.authorName,
      content: req.body.content,
      title: req.body.title,
      votes: 0
    }).save((err) => {
      if(err) return res.send(err);
      return res.send("ok");
    });
});

//modify snippet, escape HTML again
router.post('/api/snippet/:id', passport.authenticate('jwt', { session: false }), [
  check('content').escape(),
  check('title').escape(),
  ], function(req, res, next) {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty){
      return res.status(400).json({errors: validationErrors.array()})
    }
    const timeNow = Date(Date.now());
    const datetime = timeNow.slice().split("GMT");
    Snippet.findOneAndUpdate({_id: req.params.id}, {"content": req.body.content, "title": req.body.title, "edited": datetime[0]}, ((err, result) => {
      if(err) return res.send(err);
      return res.send({success: "Snippet succesfully updated."});
    }));
});

//edit comment
router.post('/api/edit/comment/:id', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  const timeNow = Date(Date.now());
  const datetime = timeNow.slice().split("GMT");
    Comment.findOneAndUpdate({_id: req.params.id}, {"content": req.body.content, "edited": datetime[0]}, {new: true}, ((err, result) => {
      if(err) return res.send(err);
      return res.send({result});
    }));
});

//add a comment
router.post('/api/comment/:code', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  new Comment({
    authorID: req.body.authorID,
    authorName: req.body.authorName,
    content: req.body.content,
    votes: 0,
    snippet: req.params.code
  }).save((err, result) => {
    if(err) return res.send(err);
    return res.json({id: result.id});
  });
});

//add votes on comments, both to comment and to user
router.post('/api/comment/vote/:user/:comment/:votes', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  Comment.findOneAndUpdate({_id: req.params.comment}, {votes: req.params.votes}, {new: true}, ((err, result) => {
    if(err) return res.send(err);
    User.findOneAndUpdate({_id: req.params.user}, {$push: {commentVotes: req.params.comment}}, {new: true}, (err, result) => {
      if(err) return res.send(err);
    return res.json({votes: req.params.votes, previousVotes: {commentVotes: result.commentVotes, snippetVotes: result.snippetVotes}});});
  }));
});

//add votes on snippets, both to snippet and to user
router.post('/api/snippet/vote/:user/:snippet/:votes', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  Snippet.findOneAndUpdate({_id: req.params.snippet}, {votes: req.params.votes}, {new: true}, ((err, result) => {
    if(err) return res.send(err);
    User.findOneAndUpdate({_id: req.params.user}, {$push: {snippetVotes: req.params.snippet}}, {new: true}, (err, result) => {
      if(err) return res.send(err);
    return res.json({votes: req.params.votes, previousVotes: {commentVotes: result.commentVotes, snippetVotes: result.snippetVotes}});});
  }));
});

//get all comments of a snippet
router.get('/api/snippet/:id/comments', function(req, res, next) {
  Comment.find({"snippet": req.params.id}, (err, comments) => {
    if(err) {
      return res.status(404).send({'error': error});
    }
    if(comments){
      return res.send(comments);
    }else {
      return res.send({error: "No comments found"});
    }
  })
});

router.get('/api/snippet/:id', function(req, res, next) {
  Snippet.findOne({"_id": req.params.id}, (err, snippet) => {
    if(err) {
      return res.status(404).send({'error': error});
    }
    if(snippet){
      return res.send(snippet);
    }else {
      return res.send({error: "The snippet was not found"});
    }
  })
});

//get comments and snippets a gicen user has voted on
router.get('/api/:id/votes', function(req, res, next) {
  User.findOne({"_id": req.params.id}, (err, user) => {
    if(err) {
      return res.status(404).send({'error': error});
    }
    if(user){
      return res.send({commentVotes: user.commentVotes, snippetVotes: user.snippetVotes});
    }else {
      return res.send({error: "Previous votes were not found"});
    }
  })
});

module.exports = router;
