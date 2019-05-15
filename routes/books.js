var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//most references for how to set up routes were taken from the Treehouse lesson
//https://teamtreehouse.com/library/using-sql-and-nodejs-with-sequelize

/* GET books for full list of books */
router.get('/', function(req, res, next) {
    Book.findAll({order: [["Year", "DESC"]]}).then(function(books){
      res.render("index", {books: books, title: "Brian's Library" });
    }).catch(function(error){
        res.send(500, error);
     });
  });

/* Create a new book form. */
router.get('/new', function(req, res, next) {
    res.render("books/new-book", { book: {}, title: "New Book"} );
  });

/* POST create book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book){//the req.body is the data from the form
    res.redirect("/books/")//it matches one to one from the form input to the properties on the form models 
  }).catch(function(error){//when the database is finished saving the article record the database will
    if(error.name === "SequelizeValidationError"){//redirect to the new article
      res.render("books/new-book", {//The views require instance methods on each of the article instances
        book: Book.build(req.body), 
        errors: error.errors,
        title: "New Book"})
    } else {
      throw error;
    }
  }).catch(function(error){
    res.sendStatus(500, error);
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
  }).catch(function(error){
    res.sendStatus(500);
  });
});

/* GET individual book */
router.get("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
  if(book){
    res.render("books/update-book", {book: book, title: book.title});
  } else {
    res.render("page-not-found", { book: {}, title: "Page Not Found" });
  }
  }).catch(function(error){
    res.sendStatus(500, error);
  });
});

/* PUT update book */
router.put("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
  if(book){
    return book.update(req.body);
  } else {
    res.sendStatus(404);
  }
  }).then (function(book){//this is the updated book
    res.redirect("/"); 
  }).catch(function(error){
    if(error.name === "SequelizeValidationError"){
      var book = Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", {
        book: book,
        title: "Edit Book",
        errors: error.errors
      });
    } else {
      throw error;
    }
  }).catch(function(error){
    res.sendStatus(500, error);
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
    }).catch(function(error){
      res.sendStatus(500, error);
    });
  //  res.redirect("/articles");
  });

module.exports = router;