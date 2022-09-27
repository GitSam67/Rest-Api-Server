const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Favorite = require("../models/favourite");
const authenticate = require("../authenticate");
const app = express();
const favRouter = express.Router(); 

app.use(bodyParser.json());

favRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    Favorite.find({clientId : req.user._id})
    .populate("clientId dishes")
    .then((favs)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favs);
    }, (err)=>next(err))
    .catch((err)=> next(err));   
})
.post(authenticate.verifyUser,(req,res,next)=>{
    var userId = req.user._id;
    var dishId = req.body._id;
    console.log(dishId);
    var favData = {
        clientId : userId,
        dishes : [ dishId ]
    }; 

    Favorite.findOne({clientId : userId})
    .then((fav) => {
        if (!fav || fav.length === 0) {
            Favorite.create(favData)
            .then((favour)=>{
                console.log("Favourites created "+ favData);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favour);
            }, (err)=>next(err))
            .catch((err)=> next(err));
        }
        else if (fav.dishes.indexOf(dishId) > -1){
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json("This dish with dishId "+dishId+" is already in your favourite list..!!");
        }
        else{
            fav.dishes.push(dishId);
            fav.save()
            .then((fa)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(fa);
            }, (err) => next(err));
        }
    }, (err)=>next(err))
    .catch((err)=> next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.send("PUT request is not supported for selecting dishes..");
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Favorite.remove({clientId : req.user._id})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    }, (err)=>next(err))
    .catch((err)=> next(err));
})

favRouter.route('/:dishId')
.post(authenticate.verifyUser,(req,res,next)=>{
    var userId = req.user._id;
    var dishId = req.params.dishId;
    console.log(dishId);
    var favData = {
        clientId : userId,
        dishes : [ dishId ]
    }; 

    Favorite.findOne({clientId : userId})
    .then((fav) => {
        if (!fav || fav.length === 0) {
            Favorite.create(favData)
            .then((favour)=>{
                console.log("Favourites created "+ favData);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favour);
            }, (err)=>next(err))
            .catch((err)=> next(err));
        }
        else if (fav.dishes.indexOf(dishId) > -1){
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json("This dish with dishId "+dishId+" is already in your favourite list..!!");
        }
        else{
            fav.dishes.push(dishId);
            fav.save()
            .then((fa)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(fa);
            }, (err) => next(err));
        }
    }, (err)=>next(err))
    .catch((err)=> next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    var dishId = req.params.dishId;
    console.log(dishId)
    Favorite.findOne({clientId : req.user._id, dishes: dishId})
    .then((fav)=>{
        fav.dishes.remove(dishId)
        fav.save()
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
        })
    }, (err)=>next(err))
    .catch((err)=> next(err));
})

module.exports = favRouter;