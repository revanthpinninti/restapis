const express = require('express');
const router = express();
const Post = require('../models/Post');
const nodemailer = require('nodemailer');
const SMS = require('node-sms-send');

//Get all posts
router.get('/', async (req, res) => {
    try{
        const posts = await Post.find();
        res.json(posts);
    } catch(err) {
        res.status(400).send(err);
    }
});

//Add a post
router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    try{
        const savedPost = await post.save();
        res.status(200).json(savedPost);
    } catch(err) {
        res.status(400).send(err);
    }
});


//Get a specific post
router.get('/:postId', async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch(err) {
        res.status(400).send(err);
    }
});


//Delete a specific post
router.delete('/:postId', async (req, res) => {
    try{
        const removedPost = await Post.remove({_id: req.params.postId});
        res.json(removedPost);
    } catch(err) {
        res.status(400).send(err);
    }
});


//Update a post
router.patch('/:postId', async (req, res) => {
    try{
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId},
            { $set: { title: req.body.title } }
        );

        res.json(updatedPost);
    } catch(err) {
        res.status(400).json(err);
    }
});

router.post('/message', (req, res) => {
    const sms = new SMS()
});

router.post('/email', async (req, res) => {

    try{
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await nodemailer.createTestAccount();
  
   // return res.send(testAccount);
    //create a reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
            service: process.env.SENDER_SERVICE,
            auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
        }
    });
   
    //Send an email with defined transport object
    const message = {
        from: req.body.from,
        to: req.body.to,
        cc: req.body.cc,
        bcc: req.body.bcc,
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html,
        attachments: [
            {
                filename: "wishes.jpeg",
                path: "https://www.google.com/url?sa=i&url=https%3A%2F%2Findianexpress.com%2Farticle%2Flifestyle%2Flife-style%2Fhappy-diwali-2020-deepavali-wishes-images-status-quotes-messages-wallpapers-and-photos-6956237%2F&psig=AOvVaw0qBcWxIDhLBoLtfP2kCPSm&ust=1605757418371000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCNj1m9mWi-0CFQAAAAAdAAAAABAF"
            }
        ]
    };
    
    let info = await transporter.sendMail(message);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.send(`Email has been sent: ${info.messageId}`);
   
    } catch(err) {
        res.status(400).send(err);
    }
});


module.exports = router;