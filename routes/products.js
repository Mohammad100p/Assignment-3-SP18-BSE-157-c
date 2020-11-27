var express = require('express');
var router = express.Router();
var Product=require("../models/product");
var checksessionAuth=require("../middlewares/checksessionAuth");
/* GET home page. */
router.get('/',async function(req, res, next) {
  let products= await Product.find();
  console.log(req.session.user);
  res.render("products/list",{title:"Products in DB",products});
});

router.get('/add',checksessionAuth,async function(req, res, next) {

  res.render("products/add");
});
//store data in db
router.post('/add',async function(req, res, next) {
  let product= new Product(req.body);
  await product.save();
  res.redirect("/products");
});

router.get('/delete/:id',async function(req, res, next) {
  let product= await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});

router.get('/cart/:id',async function(req, res, next) {
  let cart=[];
  let product= await Product.findById(req.params.id);
  if(req.cookies.cart) cart=req.cookies.cart;
  cart.push(product);
  res.cookie("cart", cart);
  console.log("Add this product in cart");
  res.redirect("/products");
});

router.get('/cart/remove/:id',async function(req, res, next) {
  let cart=[];
  
  if(req.cookies.cart) cart=req.cookies.cart;
  cart.splice(cart.findIndex(c=>c._id==req.params.id), 1);
  res.cookie("cart", cart);
  
  res.redirect("/cart");
});

router.get("/edit/:id",async function(req, res, next) {
  let product= await Product.findById(req.params.id)
  res.render("products/edit", {  product });
});

router.post("/edit/:id",async function(req, res, next) {
  let product= await Product.findById(req.params.id)
  product.name=req.body.name;
  product.price=req.body.price;
  await product.save();
  res.redirect("/products");
});
module.exports = router;