const express = require('express');

const router = express.Router();

router.get("/",(req,res)=>{
    res.render("index");
});

router.get("/register",(req,res)=>{
    res.render("register");
});
router.get("/login",(req,res)=>{
    res.render("login");
});
router.get("/dashboard",(req,res)=>{
    res.render("dashboard");
});
router.get('/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.redirect('/login');
});


module.exports = router;
