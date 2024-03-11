const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


//Function to check if the user exists
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }else{
  return res.status(404).json({message: "Unable to register user, please provide username and password."});
  }
});

// // Get the book list available in the shop, non-async. Async code style below
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books));
// });

//task 10
public_users.get('/', async function (req, res) {
  try {
    res.send(JSON.stringify(books));
    console.log("Promise for Task 10 resolved");

  } catch(error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here

  let isbn = req.params.isbn
  let book = books[isbn]
  try {
    if (book){
    return res.status(200).send(book);
    } else {
      return res.status(400).send(`ISBN ${isbn} does not exist in the database!`)
    }

  } catch(error){
    console.error(`Error fetching book with ISBN ${isbn}:`, error);
    return res.status(500).send('Error fetching book');
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  
  try{
    let author = req.params.author
    
    for (let i in books){
      let book = books[i]
      if (book["author"] == author) {
        return res.status(200).send(book)
      }
    }
    return res.status(400).json({message: `Author ${author} does not exist in the database!`});


  }catch(error){
    console.error(`Error fetching book written by author ${author}:`, error);
    return res.status(500).send('Error fetching book.');
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  let title = req.params.title
  try{
  
  for (let i in books){
    let book = books[i]
    if (book["title"] == title) {
      return res.status(200).send(book)
    }
  }
  return res.status(400).json({message: `Book titled ${title} does not exist in the database!`});

  }
  catch(error){
    console.error(`Error fetching book titled ${title}:`, error);
    return res.status(500).send('Error fetching book.');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const book = req.params.isbn;
  return res.status(200).send(book["reviews"])


});

module.exports.general = public_users;
