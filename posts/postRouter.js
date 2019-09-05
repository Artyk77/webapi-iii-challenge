const express = require('express')
const router = express.Router();
const postDb = require('./postDb')

router.get('/', (req, res) => {

    postDb.get()
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => {
        res.status(500).json({ message: 'Cannot get posts'})
    })
});

router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
    postDb.remove(req.post.id)
        .then(response => {
            res.status(200).json({ message: 'Post deleted'})
        })
        .catch(error => {
            res.status(500).json({ message: 'Cannot delete posts'})
        })

});

router.put('/:id', validatePostId, (req, res) => {
    postDb.update(req.post.id, {text: req.body.text})
        .then(response => {
            postDb.getById(req.post.id)
                .then(response => {
                    res.status(200).json(response)
                })
        })
        .catch(error => {
            res.status(500).json({ message: 'Cannot update user'})
        })

});

// custom middleware

function validatePostId(req, res, next) {
    const id = req.params.id
    postDb.getById(Number(id))
        .then(response => {
            if(response) {
                req.post = response
                next();
            }
            else {
                res.status(400).json({ message: 'Invalid post id'})
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Cannot fetch post data'})
        })
};

module.exports = router;