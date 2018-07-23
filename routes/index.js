var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");

router.get("/", function(req, res){
    res.render("landing");
});

// =======================
// AUTH ROUTES
// =======================

// REGISTRATION
// Show register form
router.get("/register", function(req, res){
    res.render("register");
});

// Handle registration logic
router.post("/register", function(req, res){
    // var newUser = new User({username: req.body.username});
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === "55555"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
            passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// LOG IN
// Show form
router.get("/login", function(req, res){
    res.render("login");
});

// Handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", 
    failureRedirect: "/login"
}), function(req, res){
    
});

// LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("error", "Logged you out!")
    res.redirect("/campgrounds");
});

// USER PROFILE
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "User not found");
            res.redirect("/");
        } else {
           Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
                if(err){
                    req.flash("error", "User not found");
                    res.redirect("/");
                } else {
                    res.render("users/show", {user: foundUser, campgrounds: campgrounds});
                }
           }); 
        }
    });
});

module.exports = router;