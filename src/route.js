const express = require('express');
const router = express.Router();
const userController = require('./controller/userController');
const courseController = require('./controller/courseController');
const { authentication } = require('./middleware');

router.post('/user', userController.createUser);
router.post('/login', userController.loginUser);

router.post('/course', authentication, courseController.createCourse);
router.put('/course/approve/:courseId', authentication, courseController.createCourse);
router.put('/course/update/:courseId', authentication, courseController.createCourse);
router.delete('/course/delete/:courseId', authentication, courseController.createCourse);

router.all('/*', (req,res)=> res.status(404).send({status: false, message: "Invalid URL."}));

module.exports = router;