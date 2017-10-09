const express = require('express');
const router = express.Router();

// Article Model
let Article = require('../models/article');
// User Model
let User = require('../models/user');
//Comment Model
let Comments = require('../models/comments');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title:'Add Post'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){

  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title:'Add Article',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.userid = req.user.id;
    article.author = req.user.name;
    article.body = req.body.body;
    article.like = 0;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Article Added');
        res.redirect('/');
      }
    });
  }
});
router.post('/comment', function(req, res){
let comment = new Comments;
  comment.comment=req.body.comment;
  comment.postid=req.body.postid;
  comment.userid=req.user.id;
  comment.name=req.user.name;
  comment.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success','comment Added');
      res.redirect('/');
    }
  });


});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.userid != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});
// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});
// Load Edit_comment Form
router.get('/edit_comment/:id', ensureAuthenticated, function(req, res){
  Comments.findById(req.params.id, function(err, comment){
    if(comment.userid != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_comment', {
      title:'Edit Comment',
      comment:comment
    });
  });
});
// Update Submit Comment Route
router.post('/edit_comment/:id', function(req, res){
  let comment = {};
  comment.comment = req.body.comment;

  let query = {_id:req.params.id}

  Comments.update(query, comment, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Comment Updated');
      res.redirect('/');
    }
  });
});

// Update like POST Route
router.post('/like', function(req, res){
  Article.findById(req.body.postid, function(err, article){
    if(err){
      console.log(err);
      return;
    }else{
      article.like=article.like+1;
      let query = {_id:req.body.postid}

      Article.update(query, article, function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Article liked');
          res.redirect('/');
        }
      });
    }
  });
});
// Delete Article
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.userid != req.user._id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Delete Comment
router.delete('/comment/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Comments.findById(req.params.id, function(err, comment){
    if(comment.userid != req.user._id){
      res.status(500).send();
    } else {
      Comments.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
