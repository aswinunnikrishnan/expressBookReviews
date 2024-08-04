const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {

    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {

        if(!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered.Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user.Username or password is missing!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

//get books in async callback

/*public_users.get("/server/asynbooks", async function (req,res) {
    try {
      let response = await axios.get("http://localhost:5005/");
      console.log(response.data);
      return res.status(200).json(response.data);
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Error getting book list"});
    }
  });*/

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found!" });
    }
 });


 //Get book details by ISBN using async
 /*public_users.get("/server/asynbooks/isbn/:isbn", function (req,res) {
    let {isbn} = req.params;
    axios.get(`http://localhost:5005/isbn/${isbn}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error while fetching book details."})
    })
  });*/


  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;  
    const authorBooks = [];  
    
    for (const book in books) {  
        if (books[book].author === author) {  
            authorBooks.push(books[book]);
        }
    }
    
    if (authorBooks.length > 0) {  
        res.send(authorBooks);  
    } else {
        res.status(404).send('No books found!');  
    }

});


//Get book details by author using async
/*public_users.get("/server/asynbooks/author/:author", function (req,res) {
    let {author} = req.params;
    axios.get(`http://localhost:5005/author/${author}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error while fetching book details."})
    })
  });*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;  
    const titleBooks = [];  
    
    for (const book in books) {  
        if (books[book].title === title) {  
            titleBooks.push(books[book]);
        }
    }
    
    if (titleBooks.length > 0) {  
        res.send(titleBooks);  
    } else {
        res.status(404).send('No books found!');  
    }

});


//Get book details by title using async
/*public_users.get("/server/asynbooks/title/:title", function (req,res) {
    let {title} = req.params;
    axios.get(`http://localhost:5005/title/${title}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error while fetching book details."})
    })
  });*/
  


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    const reviews = books[isbn].reviews;
    return res.status(200).json({ reviews: reviews });
});

module.exports.general = public_users;
