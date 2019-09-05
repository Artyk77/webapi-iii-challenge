const express = require('express')
const userDb = require('./userDb')
const postDb = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    userDb.insert(req.body)
        .then(response =>{
            res.status(201).json(response)
        })
        .catch(error => {
            res.status(500).json({ message: 'User cannot be added'})
        })

});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    postDb.insert({ text: req.body.text, user_id: req.params.id })
        .then(response => {
            res.status(201).json(response)
        })
        .catch(error => {
            res.status(500).json({ message: 'Cannot post to the user'})
        })

});

router.get('/', (req, res) => { 
    userDb.get()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({ message: 'Cannot get users'})
        })

});

router.get('/:id', validateUserId, (req, res) => {
    userDb.getById(req.params.id)
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({ message: 'Invalid user id'})
        })

});

router.get('/:id/posts', validateUserId, (req, res) => {
    postDb.get()
        .then(response =>
            {
                res.status(200).json(response.filter(el => el.user_id === req.user.id))
            })
        .catch(_ =>
            {
                res.status(500).json({ errorMessage: "internal error: could not retrieve posts" })
            })

});

router.delete('/:id', validateUserId, (req, res) => {
    userDb.remove(req.user.id)
        .then(response => {
            res.status(200).json({message: 'User Deleted'})
        })
        .catch(error => {
            res.status(500).json({ message: 'Cannot delete user'})
        })

});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    userDb.update(req.user.id, {name: req.body.name})
        .then(response => {
            userDb.getById(req.user.id)
                .then(response => {
                    res.status(200).json(response)
                })
        })
        .catch(error => {
            res.status(500).json({ message: 'Could not update user'})
        })

});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id
    userDb.getById(Number(id))
        .then(response => {
            if(response) {
                req.user = response
                next();
            }
            else {
                res.status(400).json({ message: 'Invalid user id'})
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Cannot fetch user data'})
        })
};

function validateUser(req, res, next) {
    if(!req.body){
        res.status(400).json({ message: 'Missing body data'})
    }
    if(!req.body.name){
        res.status(400).json({ message: 'Missing body name data'})
    }
    next();
};

function validatePost(req, res, next) {
    if(!req.body){
        res.status(400).json({ message: 'Missing body data'})
    }
    if(!req.body.text){
        res.status(400).json({ message: 'Missing body name data'})
    }
    next();
};

module.exports = router;
