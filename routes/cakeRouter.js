const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Cakes = require('../models/cake');
const cakeRouter = express.Router();

cakeRouter.use(bodyParser.json());

cakeRouter.route('/')
    .get((req, res, next) => {
        Cakes.find({})
            .then((cakes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cakes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Cakes.create(req.body)
            .then((cake) => {
                console.log('Cake Created', cake);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cake);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /cakes');
    })
    .delete((req, res, next) => {
        Cakes.deleteMany({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

cakeRouter.route('/:cakeId')
    .get((req, res, next) => {
        Cakes.findById(req.params.cakeId)
            .then((cake) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cake);
            }, (err) => next(err))
            .catch((err) => next(err));
            
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /cakes/' + req.params.cakeId);
    })
    .put((req, res, next) => {
        Cakes.findByIdAndUpdate(req.params.cakeId, {
            $set: req.body
        }, {new: true})
            .then((cake) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cake);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Cakes.findByIdAndDelete(req.params.cakeId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
///////////////////////////// 
cakeRouter.route('/:cakeId/toppings')
    .get((req, res, next) => {
        Cakes.findById(req.params.cakeId)
        .then((cake) => {
            if(cake != null){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cake.topping);
            }
            else{
                err = new Error('Cake ' + req.params.cakeId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Cakes.findById(req.params.cakeId)
            .then((cake) => {
                if(cake != null){
                    cake.topping.push(req.body);
                    cake.save()
                        .then((cake) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(cake);
                        }, (err) => next(err));
                }
                else{
                    err = new Error('Cake ' + req.params.cakeId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /cakes/' + req.params.cakeId + '/toppings');
    })
    .delete((req, res, next) => {
        Cakes.findById(req.params.cakeId)
            .then((cake) => {
                if(cake != null){
                    for(var i = (cake.topping.length -1); i >= 0; i++){
                        //// Test here
                        cake.topping.id(cake.topping[i]._id).deleteOne();
                    }
                    cake.save()
                        .then((cake) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(cake);
                        }, (err) => next(err));
                }else{
                    err = new Error('Cake ' + req.params.cakeId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    /////
    cakeRouter.route('/:cakeId/toppings/:toppingId')
    .get((req, res, next) => {
        Cakes.findById(req.params.cakeId)
            .then((cake) => {
                if(cake != null && cake.topping.id(req.params.toppingId) != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(cake.topping.id(req.params.toppingId));
                }
                else if(cake == null){
                    err = new Error('Cake ' + req.params.cakeId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else{
                    err = new Error('Topping ' + req.params.toppingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /cakes/' + req.params.cakeId + '/toppings/' + req.params.toppingId);
    })
    .put((req, res, next) => {
        Cakes.findById(req.params.cakeId)
            .then((cake) => {
                if(cake != null && cake.topping.id(req.params.toppingId) != null){
                    if(req.body.type){
                        cake.topping.id(req.params.toppingId).type = req.body.type;
                    }
                    if(req.body.price_extra){
                        cake.topping.id(req.params.toppingId).price_extra = req.body.price_extra;
                    }
                    cake.save()
                        .then((cake) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(cake);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else if(cake == null){
                    err = new Error('Cake ' + req.params.cakeId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else{
                    err = new Error('Topping ' + req.params.toppingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Cakes.findById(req.params.cakeId)
            .then((cake) => {
                if(cake != null && cake.topping.id(req.params.toppingId) != null){
                    cake.topping.id(req.params.toppingId).deleteOne();
                    cake.save()
                        .then((cake) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(cake);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else if(cake == null){
                    err = new Error('Cake ' + req.params.cakeId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else{
                    err = new Error('Topping ' + req.params.toppingId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
    });

module.exports = cakeRouter;