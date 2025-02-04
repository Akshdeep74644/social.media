const express = require("express");
const userRoutes = express.Router();
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRoutes.get("/", (req, res) => {
  res.render("welcome");
});

userRoutes.get("/feed", isLoggedIn, async (req, res) => {
  const allpost = await postModel.find().populate("user")

  res.render('feed', {allpost});
});

userRoutes.get("/register", (req, res) => {
  res.render("register");
});

userRoutes.post("/register", async (req, res) => {
  const { mail, password, name } = req.body;
  const hasgPassword = await bcrypt.hash(password, 10);
  const user = await userModel.findOne({ mail });
  if (user) return res.status(400).send("User already exists!");
  const newuser = await userModel.create({
    username: name,
    mail: mail,
    password: hasgPassword,
  });

  const token = jwt.sign(
    {
      user: {
        mail: newuser.mail,
        name: newuser.name,
        id: newuser._id,
      },
    },
    process.env.JWT_key
  );

  res.cookie("token", token);

  res.redirect("feed");
});

userRoutes.get("/login", (req, res) => {
  res.render("login");
});

userRoutes.get("/profile", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({
    mail: req.user.user.mail,
  }).populate("posts");
  res.render("profile", { user });
});

userRoutes.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("login");
});

userRoutes.get("/error", (req, res) => {
  res.render("error");
});

userRoutes.post("/login", async (req, res) => {
  const { mail, password } = req.body;

  const user = await userModel.findOne({ mail });
  if (!user) {
    return res.status(500).send("Something went wrong!");
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      const token = jwt.sign(
        {
          user: {
            mail: user.mail,
            name: user.username,
            id: user._id,
          },
        },
        process.env.JWT_key
      );

      res.cookie("token", token);
      res.redirect("feed");
    } else {
      res.redirect("error");
    }
  });
});

userRoutes.post("/post", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({
    mail: req.user.user.mail,
  });
  const { content } = req.body;

  const newpost = await postModel.create({
    user: user._id,
    content: content
  });
  user.posts.push(newpost._id);
  await user.save();
  res.redirect("profile")
  
});

userRoutes.get("/like/profile/:id", isLoggedIn, async (req, res) => {
  const post = await postModel.findOne({_id: req.params.id}).populate("user")

  if(post.like.indexOf(req.user.user.id) === -1){
    post.like.push(req.user.user.id)
  }else{
    post.like.splice(post.like.indexOf(req.user.user.id), 1)
  }
  await post.save() 
  res.redirect("/profile")
});

userRoutes.get("/like/feed/:id", isLoggedIn, async (req, res) => {
  const post = await postModel.findOne({_id: req.params.id}).populate("user")

  if(post.like.indexOf(req.user.user.id) === -1){
    post.like.push(req.user.user.id)
  }else{
    post.like.splice(post.like.indexOf(req.user.user.id), 1)
  }
  await post.save() 
  res.redirect("/feed")
});

userRoutes.get("/edit/:id", isLoggedIn, async (req, res) => {
  const post = await postModel.findOne({_id: req.params.id}).populate("user")
  res.render("edit", {post})
});

userRoutes.get("/delete/:id", isLoggedIn, async (req, res)=>{
  const post = await postModel.findOneAndDelete({_id: req.params.id})
  console.log(req.params.id)
  res.redirect("/profile")
})

userRoutes.post("/updatepost/:id", isLoggedIn, async (req, res) => {
  const post = await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content})
  res.redirect('/profile')
});

function isLoggedIn(req, res, next) {  
  if (req.cookies.token === "") {
    res.status(400).redirect("error");
  } else {
    let data = jwt.verify(req.cookies.token, process.env.JWT_key);
    req.user = data;
    next();
  }
}

module.exports = userRoutes;
