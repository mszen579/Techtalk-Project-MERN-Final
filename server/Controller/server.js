//Controller/server.js

//npm
const { check, validationResult } = require('express-validator/check');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('../models/User');
var Post = require('../models/Post');
var Comment = require('../models/Comment');

//mongoDB'
mongoose.connect('mongodb://localhost/cl-4');
//express
var app = express();

//middelware
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true // enable set cookie
}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret: 'supersecretstring12345!',
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: (60000 * 30) },
}))
// app.use(bodyParser.urlencoded({ extended: true }));

////////////////////USER controller

// Registeration
var register = (req, res) => {
  const user = new User(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ status: "error", errors: errors.mapped() });
  }
  user.password = user.hashPassword(user.password);
  user
    .save()
    .then(user => {
      return res.send({ status: "success", message: "registerd successfuly" });
    })
    .catch(error => {
      console.log(error);
      return res.send({ status: "error", message: error });
    });
};

app.post(
  "/api/register",
  [
    check("name", "please enter your full name")
      .not()
      .isEmpty(),
    check("name", "your name must not contain any numbers").matches(
      /^[a-z''., ]+$/i
    ),
    check("name", "your name should be more than 4 charchters").isLength({
      min: 4
    }),

    check("email", "your email is not valid").isEmail(),
    check("email", "email already exist").custom(function(value) {
      return User.findOne({ email: value }).then(user => !user);
    }),
    check("desc", "please enter your full description")
      .not()
      .isEmpty(),
    check("desc", "your description must not contain any numbers").isAlpha(),

    check(
      "password",
      "your password should be more than 9 charchters"
    ).isLength({ min: 8 }),
    check("con_password", "your password confirmation dose not match").custom(
      (value, { req }) => value === req.body.password
    )
  ],
  register
);

// Login
var login = (req, res) => {
  console.log(req.body.email);
  User.findOne({
    email: req.body.email
  })
    .then(function(user) {
      if (!user) {
        return res.send({ error: true, message: "User does not exist!" });
      }
      if (!user.comparePassword(req.body.password, user.password)) {
        return res.send({ error: true, message: "Wrong password!" });
      }
      req.session.user = user;
      req.session.isLoggedIn = true;
      return res.send({ message: "You are signed in" });
      res.send(user);
    })
    .catch(function(error) {
      console.log(error);
    });
};

app.post("/api/login", login);


//logout
var logout = (req, res) => {
  req.session.destroy();
  res.json({ logout: true });
};
app.get("/api/logout", logout);

//current user / session for the user
var current = (req, res) => {
  if (req.session.user)
    User.findById(req.session.user._id)
      .then(user => {
        return user
          ? res.json(user)
          : res.status(422).json({ msg: "The authentication failed." });
      })
      .catch(err => console.log(err));
  else res.status(422).json({ msg: "The authentication failed" });
};
app.get("/api/currentuser", current);


//current post/ session for the post
var currentpost = (req, res) => {
    if (req.session.post)
        Post.findById(req.session.post._id)
            .then(post => { return post ? res.json(post) : res.status(422).json({ msg: 'The authentication failed.' }) })
            .catch(err => console.log(err));
    else
        res.status(422).json({ msg: 'The authentication failed' })
};
app.get('/api/currentpost', currentpost)

//all users
app.get('/api/users', function (req, res, next) {
    User.find({}, ['name', 'email', 'jobTitle'], (err, users) => {
        if (err) {
            console.log("Error getting users" + err);
            return next();
        }
        res.json(users)
    })
})

//show single users
app.get('/api/user/:_id', function findOneUser(req, res, next) {
    User.findOne({ _id: req.params._id }, ['name', 'email', 'jobTitle'], (err, user) => {
        if (err) {
            console.log("Error getting the user", user);
            return next();
        }
        res.json(user);
    })
})


////////////////////post new listings////////////////////////////
//post a listing
var postLising = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.send({ status: 'error', errors: errors.mapped() })
    }
    var post = new Post(req.body);
    post.user = req.session.user._id;    
    post.save()
    .then(post => {return res.send({ status: 'success', message: 'List created successfuly' }) })
        .catch(error => {
            console.log(error);
            return res.send({ status: 'error', message: error })
        })
}


app.post(
  "/api/postlist",
  [
    check("title", "your title must not contain any numbers").matches(
      /^[a-z''., ]+$/i
    ),
    check("title", "your title should be more than 9 charchters").isLength({
      min: 9
    }),
    check(
      "oneSentence",
      "your summary should be more than 9 charchters"
    ).isLength({
      min: 9
    }),
    check("keywords", "please enter your keywords name")
      .not()
      .isEmpty(),
    check("story", "your story should be more than 80 charchters").isLength({
      min: 80
    })
  ],
  postLising
);

//show me Allposts in home page
app.get('/api/Allposts', function (req, res, next) {
    Post.find().populate('user')
      .sort({ createdat: "desc" })
      .then(articles => {
        res.json(articles);
      })
      .catch(err => res.json(err));
  });


    //@get one random article
  app.get("/api/getrandomone", (req, res) => {
    Post.find().populate("user")
      .then(articles => {
        var x = Math.floor(Math.random() * articles.length + 0);
        res.json(articles[x]);
      })
      .catch(err => res.json(err));
  });



//showing single post:
app.get("/api/post/:_id", function findOneUser(req, res, next) {
 Post.findOne({ _id: req.params._id })
 .populate('user')
 .then(user=>{res.send(user)})
 .catch(err=>res.send(err))
});


//Delete post: here we need to add another componenet to complete this delete precess
app.delete('/api/deletepost/:id', function deleteListing(req, res) {
  Post.findOneAndRemove({_id:req.params.id})
  .then((res)=>{res.send( res)})
  .catch((err)=>{res.send(err)})
});


  // find all posts related to a user:
app.get('/api/usersposts', function (req, res, next) {
 Post.find().populate('user')
   .sort({ createdat: "desc" })
   .then(articles => {
     res.json(articles);
   })
   .catch(err => res.json(err));
});


////////////////////Add comment to listing////////////////////////////
// var commentListing = (req, res) => {
//     // if (!errors.isEmpty()) {
//     //     return res.send({ status: 'error', errors: errors.mapped() })
//     // }
//     var comment = new Comment(req.body);
//     comment.user = req.session.user._id;  //link the comment to the user session  
//     comment.post = req.session.post._id; // link the comment to the post session
//     comment.save()
//     .then(comment => {return res.send({ status: 'success', message: 'comment created successfuly' }) })
//         .catch(error => {
//             console.log(error);
//             return res.send({ status: 'error', message: error })
//         })
// }


// app.post('/api/post/comment', commentListing);


//voting
app.put('/api/post/vote/:id', function(req, res){
   Post.findByIdAndUpdate(req.params.id, {$inc: {vote:1}})
       .then(result => {res.status(200).json({status:'success', message:'your vote was added'})})
       .catch(error => res.status(422).json({status:'error', message: error}))
})

//Un-voting
app.put('/api/post/unvote/:id', function(req, res){
   Post.findByIdAndUpdate(req.params.id, {$inc: {vote:-1}})
       .then(result => {res.status(200).json({status:'success', message:'your unvote was added'})})
       .catch(error => res.status(422).json({status:'error', message: error}))
})




app.post("/api/comment", function(req, res) {
  Comment.create({
    text: req.body.text,
    post: req.body.postId,
    user: req.body.userId
  })
    .then(function(comment) {
      comment.populate("user", function(error, comment) {
        res.send(comment);
      });
    })
    .catch(function(error) {
      res.send({ status: "error", message: "problem in the database" });
    });
});

//List of Comments
app.get("/api/post/:id/comments", function(req, res) {
  Comment.find({ post: req.params.id })
    .populate("user") //user field in the mongodb
    .sort({ createdAt: "desc" })
    .then(function(comments) {
      res.send(comments);
    })
    .catch(function(error) {
      res.send({ status: "error", message: "Problem in the database" });
    });
});



/////////////////////////////////////////////////////////
app.listen(8000);
console.log('listening to port: 8000')