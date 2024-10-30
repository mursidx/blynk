const express = require("express");
const router = express.Router();
require("dotenv").config();
const {productModel} = require('../models/product')

router.get('/', async function(req, res){
    let prods = await productModel.find();
    res.send(prods)
})

router.post('/', async function(req, res){
    let prod = await productModel.find();
    res.send(prods)
})

module.exports = router;