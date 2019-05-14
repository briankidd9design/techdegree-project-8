var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//most references for how to set up routes were taken from the Treehouse lesson
//https://teamtreehouse.com/library/using-sql-and-nodejs-with-sequelize

/* GET books for full list of books */
router.get('/', function(req, res, next) {
  Book.findAll({order:[["Year", "DESC"]]}).then(function(books){
    if(book){
        res.render("index", {books: books, title: "Books Library" });
    } else {
        res.sendStatus(404);
    }
   }).catch(function(err){
     res.sendStatus(500, err);
   });
});

/* Create a new book form. */
router.get('/new', function(req, res, next) {
    res.render("books/new-book", { book: {}, title: "New Book"} );
  });

/* POST create book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(books){//the req.body is the data from the form
    res.redirect("/books/" + books.id)//it matches one to one from the form input to the properties on the form models 
  }).catch(function(err){//when the database is finished saving the article record the database will
    if(err.name === "SequelizeValidationError"){//redirect to the new article
      res.render("books/new-book", {//The views require instance methods on each of the article instances
        book: Book.build(req.body), 
        title: "New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.sendStatus(500, err);
  }); 

});

/* Edit book form. */
router.get("/:id/edit", function(req, res, next){
  //var article = find(req.params.id);  
  Article.findById(req.params.id).then(function(article){
    if (article) {//once the article is found it is put in the form
       res.render("articles/edit", {article: article, title: "Edit Article"});
    } else {
      res.sendStatus(404);
    }
  }).catch(function(err){
    res.sendStatus(500);
  });
});

/* Delete article form. */
router.get("/:id/delete", function(req, res, next){
  //var article = find(req.params.id);  
  Article.findById(req.params.id).then(function(article){
  if(article){
    res.render("articles/show", {article: article, title: article.title});
  } else {
    res.sendStatus(404);
  }
  }).catch(function(err){
    res.sendStatus(500);
  });
});

/* GET individual book */
router.get("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
  if(book){
    res.render("books/show-book", {book: book, title: book.title});
  } else {
    res.render("page-not-found", { book: {}, title: "Page Not Found" });
  }
  }).catch(function(err){
    res.sendStatus(500, err);
  });
});

/* PUT update book */
router.put("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
  if(book){
    return article.update(req.body);
  } else {
    res.sendStatus(404);
  }
  }).then (function(book){//this is the updated book
    res.redirect("/books/" + book.id); 
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      var book = Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", {
        book: book,
        title: "Edit Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.sendStatus(500, err);
  });
});

/*DELETE individual book */
router.delete("/:id", function(req, res, next){
    Book.findByPk(req.params.id).then(function(book){
    if(book){
      return book.destroy();//and asychronous call that destroys an article
    } else {
      res.sendStatus(404);
    }
    }).then(function(){
        res.redirect("/books");//redirects to articls path once promise is fulfilled 
    }).catch(function(err){
      res.sendStatus(500, err);
    });
  //  res.redirect("/articles");
  });

module.exports = router;